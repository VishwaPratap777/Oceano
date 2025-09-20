import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export type TransitionVariant = "ripple" | "fade" | "slide";

interface UsePageTransitionReturn {
  isTransitioning: boolean;
  transitionTo: (path: string, variant?: TransitionVariant) => void;
  completeTransition: () => void;
}

export const usePageTransition = (): UsePageTransitionReturn => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const navigate = useNavigate();

  const transitionTo = useCallback((path: string, variant: TransitionVariant = "ripple") => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setPendingPath(path);
  }, [isTransitioning]);

  const completeTransition = useCallback(() => {
    if (pendingPath) {
      navigate(pendingPath);
      setPendingPath(null);
    }
    setIsTransitioning(false);
  }, [navigate, pendingPath]);

  return {
    isTransitioning,
    transitionTo,
    completeTransition
  };
};
