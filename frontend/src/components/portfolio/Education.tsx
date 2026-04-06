import { motion } from 'framer-motion';

export function Education() {
  const education = [
    {
      degree: '100xDevs (Advanced Architecture Cohort)',
      institution: 'Gurugram, India',
      duration: 'Jul 2024 — Jul 2026',
      details:
        'An intensive masterclass in modern software engineering, focusing on real-time protocols, distributed microservices, and modern deployment pipelines.',
    },
    {
      degree: 'BTech in Civil Engineering',
      institution: 'National Institute of Technology (NIT) Kurukshetra',
      duration: 'May 2020 — May 2024',
      details:
        'Graduated from one of India’s premier engineering institutes, applying core engineering principles to software architecture.',
    },
  ];

  return (
    <section id="education" className="py-24 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        <h2 className="text-4xl font-bold text-white mb-6 text-center">Education</h2>
        <div className="space-y-8">
          {education.map((edu, index) => (
            <div key={index}>
              <h3 className="text-2xl font-semibold text-blue-500">
                {edu.degree}
              </h3>
              <p className="text-zinc-400 text-sm mb-2">
                {edu.institution} | {edu.duration}
              </p>
              <p className="text-zinc-400">{edu.details}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
