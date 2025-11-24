import { motion } from 'framer-motion';

interface AnimatedWordProps {
  text: string;
  gradient: string;
  delay: number;
}

const AnimatedWord = ({ text, gradient, delay }: AnimatedWordProps) => {
  return (
    <motion.div
      className="flex items-center"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.43, 0.13, 0.23, 0.96]
      }}
    >
      {/* Bolita con gradiente */}
      <motion.div
        className={`w-3 h-3 rounded-full bg-gradient-to-r ${gradient} mr-3`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          duration: 0.4,
          delay: delay + 0.2,
          type: "spring",
          stiffness: 200
        }}
      />
      
      <motion.span
        className={`text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r ${gradient} text-transparent bg-clip-text tracking-wide whitespace-nowrap`}
        whileHover={{
          scale: 1.05,
          transition: { duration: 0.2 }
        }}
        whileTap={{ scale: 0.95 }}
      >
        {text}
      </motion.span>
    </motion.div>
  );
};

export default AnimatedWord;