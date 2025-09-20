import { ReactNode } from "react";
import Stairs from "./Stairs";

interface PageTransitionWrapperProps {
  children: ReactNode;
  variant?: "ripple" | "fade" | "slide" | "stairs";
}

const PageTransitionWrapper = ({ children, variant = "stairs" }: PageTransitionWrapperProps) => {
  // Use stairs animation for all pages
  if (variant === "stairs") {
    return <Stairs>{children}</Stairs>;
  }

  // Fallback to simple rendering for other variants (if needed)
  return <div className="min-h-screen">{children}</div>;
};

export default PageTransitionWrapper;
