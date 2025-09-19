import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => {
  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        y: 8,
        filter: "blur(3px)"
      }}
      animate={{ 
        opacity: 1, 
        y: 0,
        filter: "blur(0px)"
      }}
      exit={{ 
        opacity: 0, 
        y: -6,
        filter: "blur(1px)"
      }}
      transition={{
        duration: 0.35,
        ease: [0.25, 0.46, 0.45, 0.94], // Smoother cubic-bezier
        staggerChildren: 0.06,
        delayChildren: 0.03
      }}
      style={{
        willChange: 'transform, opacity, filter'
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.3,
          ease: [0.25, 0.46, 0.45, 0.94],
          delay: 0.05
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default PageTransition;