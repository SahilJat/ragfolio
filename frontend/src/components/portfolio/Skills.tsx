import { motion } from 'framer-motion';

export function Skills() {
  const skills = [
    {
      category: 'Programming Languages',
      items: ['JavaScript', 'Python', 'SQL', 'TypeScript', 'C++', 'Bash'],
    },
    {
      category: 'Backend Frameworks & Tools',
      items: ['Node.js', 'Express', 'Django', 'FastAPI', 'Pydantic'],
    },
    {
      category: 'Databases',
      items: ['PostgreSQL', 'Redis', 'Prisma ORM'],
    },
    {
      category: 'DevOps & Cloud',
      items: ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'CI/CD'],
    },
    {
      category: 'Real-Time Communication',
      items: ['WebSockets', 'WebRTC', 'Apache Kafka'],
    },
  ];

  return (
    <section id="skills" className="py-24 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        <h2 className="text-4xl font-bold text-white mb-6 text-center">Skills</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {skills.map((skill, index) => (
            <div key={index}>
              <h3 className="text-2xl font-semibold text-blue-500 mb-4">
                {skill.category}
              </h3>
              <ul className="list-disc list-inside text-zinc-400">
                {skill.items.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
