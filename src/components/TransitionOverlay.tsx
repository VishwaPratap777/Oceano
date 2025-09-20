import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface TransitionOverlayProps {
  isVisible: boolean;
  onComplete: () => void;
  variant?: "ripple" | "fade" | "slide";
  // Controls whether loader UI (spinner + particles) is shown. Defaults to false so it doesn't appear on every transition.
  showLoader?: boolean;
}

const TransitionOverlay = ({ isVisible, onComplete, variant = "ripple", showLoader = false }: TransitionOverlayProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const rippleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && overlayRef.current) {
      const overlay = overlayRef.current;
      const ripple = rippleRef.current;

      // GSAP timeline for cinematic effect
      const tl = gsap.timeline({
        onComplete: () => {
          setTimeout(onComplete, 300); // Reduced delay for smoother transition
        }
      });

      if (variant === "ripple") {
        // Oceanic ripple effect with smoother easing
        tl.set(overlay, { scale: 0, opacity: 0 })
          .to(overlay, { 
            scale: 1, 
            opacity: 1, 
            duration: 0.6, 
            ease: "power3.out" 
          })
          .to(ripple, {
            scale: 1.2,
            opacity: 0.8,
            duration: 1,
            ease: "power3.inOut"
          }, "-=0.15")
          .to(ripple, {
            scale: 1.4,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
          }, "-=0.1");
      } else if (variant === "fade") {
        // Simple fade with smoother easing
        tl.set(overlay, { opacity: 0 })
          .to(overlay, { 
            opacity: 1, 
            duration: 1, 
            ease: "power3.out" 
          });
      } else if (variant === "slide") {
        // Slide effect with enhanced smoothness
        tl.set(overlay, { x: "-100%", opacity: 0 })
          .to(overlay, { 
            x: "0%", 
            opacity: 1, 
            duration: 0.6, 
            ease: "power4.out" 
          });
      }
    }
  }, [isVisible, variant, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={overlayRef}
          className="fixed inset-0 z-[9999] pointer-events-none"
          style={{ backgroundColor: '#0f172a' }} // Solid dark blue fallback
          initial={{ opacity: 0 }}
          exit={{ opacity: 0 }}
        >
          {/* Main overlay with full opacity dark background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900" />
          {/* Secondary overlay for richer depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 via-transparent to-blue-900/60" />

          {variant === 'ripple' && (
            <>
              {/* Ripple effect */}
              <div
                ref={rippleRef}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-96 h-96 rounded-full bg-gradient-to-r from-cyan-400/20 to-blue-500/20 border-2 border-cyan-400/30" />
              </div>

              {/* Oceanic particles (only when loader is enabled) */}
              {showLoader && (
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-cyan-400/60 rounded-full"
                      initial={{ 
                        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
                        y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
                        opacity: 0,
                        scale: 0
                      }}
                      animate={{ 
                        y: [null, -100],
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0]
                      }}
                      transition={{
                        duration: 2,
                        delay: i * 0.1,
                        repeat: Infinity,
                        repeatDelay: 3
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Loading indicator (only when loader is enabled) */}
              {showLoader && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <div className="text-center">
                    <motion.div
                      className="w-12 h-12 border-4 border-cyan-400/40 border-t-cyan-400 rounded-full mx-auto mb-4"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.p
                      className="text-cyan-100/90 text-sm font-medium tracking-wide"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      Diving into the depths...
                    </motion.p>
                  </div>
                </motion.div>
              )}
            </>
          )}

          {/* No wave variant rendering */}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TransitionOverlay;