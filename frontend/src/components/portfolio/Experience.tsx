import { motion } from 'framer-motion';

export function Experience() {
  const experiences = [
    {
      role: 'Open Source Engineer',
      company: 'Flagsmith',
      location: 'London, United Kingdom (Remote)',
      duration: 'Nov 2025 — Present',
      responsibilities: [
        'Stabilized and optimized core database operations and data validation layers.',
        'Resolved PostgreSQL deadlocks by architecting a delegated transaction management system.',
        'Implemented strict Pydantic V2 schema validations to sanitize data pipelines.',
      ],
    },
    {
      role: 'Open Source Engineer',
      company: 'Yamada UI',
      location: 'Tokyo, Japan (Remote)',
      duration: 'Nov 2025 — Present',
      responsibilities: [
        'Engineered intelligent, backend-driven CLI utilities using Node.js and TypeScript.',
        'Automated React component generation and project scaffolding.',
        'Improved developer experience (DX) for global users.',
      ],
    },
    {
      role: 'Freelance Full Stack Engineer',
      company: 'Fashion Retail Client',
      location: 'Gurugram, India',
      duration: 'Jan 2023 — Mar 2023',
      responsibilities: [
        'Architected and deployed a high-traffic e-commerce platform.',
        'Ensured 99.9% uptime during high-pressure product launches.',
        'Optimized server resources and frontend rendering for scalability.',
      ],
    },
  ];

  return (
    <section id="experience" className="py-24 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        <h2 className="text-4xl font-bold text-white mb-6 text-center">Experience</h2>
        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <div key={index}>
              <h3 className="text-2xl font-semibold text-blue-500">
                {exp.role} @ {exp.company}
              </h3>
              <p className="text-zinc-400 text-sm mb-2">
                {exp.location} | {exp.duration}
              </p>
              <ul className="list-disc list-inside text-zinc-400">
                {exp.responsibilities.map((resp, idx) => (
                  <li key={idx}>{resp}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
