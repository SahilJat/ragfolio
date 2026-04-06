import { motion } from 'framer-motion';

export function About() {
  return (
    <section id="about" className="py-24 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto text-center"
      >
        <h2 className="text-4xl font-bold text-white mb-6">About Me</h2>
        <p className="text-lg text-zinc-400 leading-relaxed">
          I am a highly capable and versatile Backend Engineer with a strong focus on building scalable, distributed, and event-driven systems. Transitioning from Civil Engineering to advanced software architecture, I bring a systems-level approach to problem-solving. My expertise spans Node.js, Python, and real-time data flows, with a passion for developer experience and resilient infrastructure.
        </p>
      </motion.div>
    </section>
  );
}
