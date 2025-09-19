import { ReactNode, MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface TransitionLinkProps {
  to: string;
  variant?: "ripple" | "wave" | "fade" | "slide";
  children: ReactNode;
  className?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}

const TransitionLink = ({ 
  to, 
  variant = "ripple", 
  children, 
  className = "",
  onClick 
}: TransitionLinkProps) => {
  const navigate = useNavigate();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    if (onClick) {
      onClick(e);
    }
    
    // Simple navigation with a small delay for visual feedback
    setTimeout(() => {
      navigate(to);
    }, 100);
  };

  return (
    <motion.a
      href={to}
      onClick={handleClick}
      className={className}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.a>
  );
};

export default TransitionLink;
