import { motion } from 'framer-motion';

export function Education() {
  return (
    <section className="py-12 px-4 border-t border-zinc-800/50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-white mb-6">Education</h2>
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800/80 hover:bg-zinc-900/50 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
              <h3 className="text-lg font-medium text-white">Bachelor of Technology in Computer Science</h3>
              <span className="text-sm text-zinc-500 font-mono">2020 - 2024</span>
            </div>
            <p className="text-zinc-400">National Institute of Technology</p>
            <p className="text-sm text-zinc-500 mt-4 leading-relaxed italic">
              Graduated with honors. Specialized in software engineering and data structures.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
