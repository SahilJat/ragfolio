import { motion } from 'framer-motion';

export function Projects() {
  const projects = [
    {
      name: 'CodeStream',
      description:
        'A real-time collaborative interview platform featuring live code execution in isolated Docker containers, WebRTC video/audio, and WebSocket-driven collaborative editing.',
      technologies: ['React', 'Next.js', 'Node.js', 'WebSockets', 'Redis', 'WebRTC'],
    },
    {
      name: 'Smart E-Commerce Platform',
      description:
        'An event-driven microservices architecture for high-traffic e-commerce, utilizing Apache Kafka, Redis, and PostgreSQL for fault tolerance and scalability.',
      technologies: ['Node.js', 'Express', 'Apache Kafka', 'Redis', 'PostgreSQL', 'Prisma ORM'],
    },
  ];

  return (
    <section id="projects" className="py-24 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        <h2 className="text-4xl font-bold text-white mb-6 text-center">Projects</h2>
        <div className="space-y-8">
          {projects.map((project, index) => (
            <div key={index}>
              <h3 className="text-2xl font-semibold text-blue-500">
                {project.name}
              </h3>
              <p className="text-zinc-400 mb-2">{project.description}</p>
              <p className="text-zinc-400 text-sm">
                <strong>Technologies:</strong> {project.technologies.join(', ')}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
