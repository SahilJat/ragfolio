import os
import logging
import time
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Any, Dict, Tuple, Optional
try:
    from .rag_query import answer_question, retrieve_context, build_prompt, call_gemini
except ImportError:
    from rag_query import answer_question, retrieve_context, build_prompt, call_gemini

# Configure logging with detailed formatting
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("ragfolio")

app = FastAPI(
    title="Ragfolio RAG API",
    description="An orchestration layer for querying resume data using RAG.",
    version="1.0.0",
)

# CORS Configuration for development flexibility
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    """
    Middleware to log request start and end with latency tracking.
    Logs method, path, status code, and response time.
    """
    start_time = time.time()
    logger.debug(f"Request START: {request.method} {request.url.path}")
    
    try:
        response = await call_next(request)
        latency = time.time() - start_time
        logger.debug(
            f"Request END: {request.method} {request.url.path} "
            f"- Status: {response.status_code} - Latency: {latency:.3f}s"
        )
        return response
    except Exception as e:
        latency = time.time() - start_time
        logger.exception(
            f"Request FAILED: {request.method} {request.url.path} "
            f"- Latency: {latency:.3f}s - Exception: {str(e)}"
        )
        raise

class AskRequest(BaseModel):
    """
    Schema for the RAG query request.
    """
    question: str


class AskResponse(BaseModel):
    """
    Schema for the RAG query response.
    """
    answer: str


@app.get("/api/health")
async def health():
    """
    Simple health check endpoint.
    """
    return {"status": "ok"}


def answer_question_debug(question: str) -> Tuple[str, Dict[str, Any]]:
    """
    Debug-capable wrapper for the RAG pipeline that exposes internal details.
    
    Returns:
        Tuple of (answer, debug_info) where debug_info contains:
        - question: The incoming user question
        - retrieved_context: List of retrieved context chunks with metadata
        - gemini_prompt: The full prompt sent to Gemini
        - gemini_output: The raw response from Gemini
        - model_info: Model name and parameters used
    """
    debug_info = {
        "question": question,
        "retrieved_context": [],
        "gemini_prompt": "",
        "gemini_output": "",
        "model_info": {
            "embedding_model": "BAAI/bge-small-en-v1.5",
            "gemini_model": "gemini-2.5-flash-lite",
            "top_k": 3
        }
    }
    
    try:
        # Step 1: Retrieve context with error handling for ChromaDB compatibility
        logger.debug("Starting context retrieval...")
        context_chunks = retrieve_context(question, top_k=3)
        
        if context_chunks:
            debug_info["retrieved_context"] = [
                {"content": chunk, "index": i} 
                for i, chunk in enumerate(context_chunks)
            ]
            logger.debug(f"Retrieved {len(context_chunks)} context chunks")
            for i, chunk in enumerate(context_chunks):
                logger.debug(f"  Context {i+1}: {chunk[:100]}...")
        else:
            logger.debug("No context retrieved from vector store")
            return (
                "I could not find any resume context to answer from. "
                "Make sure the vector store has been built by running rag/ingest.py.",
                debug_info
            )
        
        # Step 2: Build prompt
        logger.debug("Building Gemini prompt...")
        prompt = build_prompt(question, context_chunks)
        debug_info["gemini_prompt"] = prompt
        logger.debug(f"Prompt built. Length: {len(prompt)} characters")
        logger.debug(f"Prompt preview:\n{prompt[:200]}...\n")
        
        # Step 3: Call Gemini
        logger.debug("Calling Gemini API...")
        answer = call_gemini(prompt)
        debug_info["gemini_output"] = answer
        logger.debug(f"Gemini response received. Length: {len(answer)} characters")
        logger.debug(f"Gemini output: {answer}")
        
        return answer, debug_info
        
    except Exception as e:
        logger.exception("Error in answer_question_debug")
        debug_info["error"] = str(e)
        raise

@app.post("/api/ask", response_model=AskResponse)
async def ask(request: AskRequest):
    """
    Primary RAG endpoint that takes a user question, retrieves context from the 
    resume vector store, and returns an AI-generated answer from Gemini.
    
    Request body:
        - question (str): The user's query about the resume
    
    Returns:
        AskResponse with the generated answer
    
    Raises:
        HTTPException 400: If question is empty or whitespace-only
        HTTPException 500: If RAG processing fails
    """
    # Validate that the question is not empty or whitespace-only
    if not request.question or not request.question.strip():
        logger.warning("Question validation failed: Empty or whitespace-only question received")
        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty or whitespace only.",
        )

    try:
        # Log the incoming question
        logger.debug(f"=== NEW RAG QUERY ===")
        logger.debug(f"Incoming question: {request.question}")

        # Integrate with the RAG query engine (debug-capable)
        answer, debug_info = answer_question_debug(request.question)

        # Log comprehensive debug information
        logger.debug("=== RAG DEBUG INFO ===")
        logger.debug(f"Question: {debug_info.get('question')}")
        
        # Log retrieved context
        retrieved = debug_info.get('retrieved_context', [])
        if retrieved:
            logger.debug(f"Retrieved {len(retrieved)} context items:")
            for item in retrieved:
                logger.debug(
                    f"  [Item {item['index']}] {item['content'][:150]}..."
                )
        else:
            logger.debug("No context items retrieved")
        
        # Log Gemini prompt (structured logging)
        prompt = debug_info.get('gemini_prompt', '')
        if prompt:
            logger.debug(f"Gemini Input Prompt (first 300 chars):\n{prompt[:300]}...")
        
        # Log Gemini output
        output = debug_info.get('gemini_output', '')
        if output:
            logger.debug(f"Gemini Output:\n{output}")
        
        # Log model information
        model_info = debug_info.get('model_info', {})
        logger.debug(f"Model Info: {model_info}")
        
        # Log the final response
        logger.debug(f"=== RAG QUERY COMPLETE ===")
        logger.debug(f"Generated answer: {answer}")

        return AskResponse(answer=answer)
        
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        # Log the exception with full stack trace
        logger.exception("An error occurred during RAG processing.")
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred during RAG processing: {str(e)}",
        )


# Serve Frontend Static Files (only in production)
FRONTEND_DIST_DIR = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")

if os.path.exists(FRONTEND_DIST_DIR):
    app.mount("/assets", StaticFiles(directory=os.path.join(FRONTEND_DIST_DIR, "assets")), name="static")

    @app.get("/{full_path:path}")
    async def serve_react_app(request: Request, full_path: str):
        # Allow /api to pass through
        if full_path.startswith("api"):
            raise HTTPException(status_code=404)
        
        # Look for the file in the frontend/dist folder
        file_path = os.path.join(FRONTEND_DIST_DIR, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
            
        # Default to React's index.html
        return FileResponse(os.path.join(FRONTEND_DIST_DIR, "index.html"))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

