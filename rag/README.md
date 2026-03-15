# RAG

uv project: chromadb, fastembed, requests. Minimal package for use by the backend (e.g. from `rag_query`).

## Install

```bash
uv sync
```

## Running Embeddings

To generate embeddings for the resume and store them in the vector database, run the following command from the `rag` directory:

```bash
uv run create-embeddings.py
```

### How it works
The script processes the `resume.txt` file by splitting it into semantic chunks, generating vector embeddings using the `BAAI/bge-small-en-v1.5` model, and persisting them into a local ChromaDB collection for retrieval.

Package is `rag`. Extend with RAG logic and call from the backend’s `rag_query` module.
