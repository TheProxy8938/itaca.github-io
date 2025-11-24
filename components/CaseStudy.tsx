import { motion } from 'framer-motion';

interface CaseStudyProps {
  name: string;
  company: string;
  testimonial: string;
  image: string;
}

export default function CaseStudy({ name, company, testimonial, image }: CaseStudyProps) {
  return (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
    className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6 hover:transform hover:scale-105 transition duration-300"
  >
    <div className="flex items-center space-x-4 mb-4">
      <img
        src={image}
        alt={name}
        className="w-16 h-16 rounded-full object-cover"
      />
      <div>
        <h3 className="text-lg font-semibold text-white">{name}</h3>
        <p className="text-gray-300">{company}</p>
      </div>
    </div>
    <p className="text-gray-200 italic">&quot;{testimonial}&quot;</p>
  </motion.div>
  );
}