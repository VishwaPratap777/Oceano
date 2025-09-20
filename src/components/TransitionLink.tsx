import { ReactNode, MouseEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import TransitionOverlay from "./TransitionOverlay";

interface TransitionLinkProps {
  to: string;
  variant?: "ripple" | "fade" | "slide";
  children: ReactNode;
  className?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  noOverlay?: boolean;
}

const TransitionLink = ({ 
  to, 
  variant = "ripple", 
  children, 
  className = "",
  onClick,
  noOverlay = false,
}: TransitionLinkProps) => {
  const navigate = useNavigate();
  const [showOverlay, setShowOverlay] = useState(false);

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    if (onClick) {
      onClick(e);
    }
    
    if (noOverlay) {
      // Immediate navigation with no overlay/animation
      navigate(to);
      return;
    }

    // Start overlay animation; navigate on overlay completion
    setShowOverlay(true);
  };

  return (
    <>
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
      <TransitionOverlay
        isVisible={showOverlay}
        onComplete={() => {
          setShowOverlay(false);
          navigate(to);
        }}
        variant={variant}
        showLoader={false}
      />
    </>
  );
};

export default TransitionLink;
