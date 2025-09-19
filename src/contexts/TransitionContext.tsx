import { createContext, useContext, ReactNode } from "react";
import { usePageTransition, TransitionVariant } from "../hooks/usePageTransition";

interface TransitionContextType {
  isTransitioning: boolean;
  transitionTo: (path: string, variant?: TransitionVariant) => void;
  completeTransition: () => void;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export const useTransition = () => {
  const context = useContext(TransitionContext);
  if (context === undefined) {
    throw new Error('useTransition must be used within a TransitionProvider');
  }
  return context;
};

interface TransitionProviderProps {
  children: ReactNode;
}

export const TransitionProvider = ({ children }: TransitionProviderProps) => {
  const transition = usePageTransition();

  return (
    <TransitionContext.Provider value={transition}>
      {children}
    </TransitionContext.Provider>
  );
};
