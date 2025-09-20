import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import TransitionLink from "./TransitionLink";
import { useRef, useState, lazy, Suspense, useCallback, memo, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";

// Lazy load heavy/rarely-used components to reduce initial bundle
const AuthModal = lazy(() => import("@/components/auth/AuthModal"));

// Constants that don't need to be recreated on each render
const BG_IMAGE = "url('/sea4.jpg')";

const Hero = () => {
  const location = useLocation();
  const isLanding = location.pathname === "/";
  const sectionRef = useRef<HTMLElement | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [hasVisited, setHasVisited] = useState<boolean>(true);
  const [showSplash, setShowSplash] = useState<boolean>(false);
  const [suppressMotionThisMount, setSuppressMotionThisMount] = useState<boolean>(false);

  // Handlers memoized to avoid re-creating functions for children
  const openAuth = useCallback(() => setAuthOpen(true), []);
  const closeAuth = useCallback(() => setAuthOpen(false), []);

  // Remove internal splash in favor of the global loader in Stairs

  // Scroll progress for parallax: when hero enters to leaves viewport
  const motionEnabled = useMemo(() => !suppressMotionThisMount, [suppressMotionThisMount]);
  const { scrollYProgress } = useScroll({ target: (motionEnabled ? sectionRef : undefined) as any, offset: ["start end", "end start"] });
  // Stronger title movement and scale for a more pronounced parallax feel
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -96]);
  const titleScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  // Subtitle ("Democratizing") lift and fade with higher intensity
  const subTitleY = useTransform(scrollYProgress, [0, 1], [0, -48]);
  const subTitleOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.5]);
  // Background image parallax on the word-mark (larger shift)
  const bgPosY = useTransform(scrollYProgress, [0, 1], ['45%', '30%']);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center w-full pt-24 md:pt-32 pb-16 md:pb-24 px-4">
      {/* Logo - fixed at top left */}
      <div className="absolute top-8 left-8 text-3xl font-bold text-primary">
        Ocean<span className="text-primary-glow">Data</span>
      </div>
      {isLanding && (
        <Button 
          variant="ocean" 
          size="lg"
          className="group fixed top-8 right-8 text-sm md:text-base hover:scale-105 transition-transform duration-300"
          onClick={openAuth}
        >
          login
        </Button>
      )}
      {/* First-visit splash screen */}
      {showSplash && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-5xl md:text-6xl font-extrabold tracking-tight"
          >
            <span className="text-primary">Ocean</span><span className="text-primary-glow">Data</span>
          </motion.div>
          <motion.div
            initial={{ width: 0, opacity: 0.6 }}
            animate={{ width: 120, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="mt-6 h-1 rounded bg-primary/20 overflow-hidden"
          >
            <motion.div
              initial={{ x: -120 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.9, ease: 'easeInOut' }}
              className="h-full w-full bg-primary"
            />
          </motion.div>
        </div>
      )}

      {!showSplash && (
        <motion.div initial={{ opacity: suppressMotionThisMount ? 1 : 0 }} animate={{ opacity: 1 }} transition={{ duration: suppressMotionThisMount ? 0 : 0.25, ease: 'easeOut' }} className="w-full px-6 text-center">
          {/* Main Hero Content */}
          <div className="max-w-3xl mx-auto">
            {motionEnabled ? (
              <motion.h1 style={{ y: titleY, scale: titleScale }} className="text-5xl sm:text-6xl md:text-7xl font-bold mb-2 md:mb-4 text-foreground leading-[0.78] will-change-transform">
                <motion.div
                  className="-mb-6 sm:-mb-7 md:-mb-8 origin-center mx-auto"
                  style={{ y: subTitleY, opacity: subTitleOpacity }}
                >
                  {/* Slightly smaller on small screens to avoid viewport wrapping */}
                  <div className="scale-[0.72] sm:scale-[0.85] md:scale-[0.92]">
                    <TextHoverEffect text="Democratizing" />
                  </div>
                </motion.div>
                <motion.span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: BG_IMAGE,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPositionX: 'center',
                    backgroundPositionY: bgPosY as any
                  }}
                >
                  Ocean Data
                </motion.span>
              </motion.h1>
            ) : (
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-2 md:mb-4 text-foreground leading-[0.78]">
                <div className="-mb-6 sm:-mb-7 md:-mb-8">
                  <span className="inline-block scale-[0.72] sm:scale-[0.85] md:scale-[0.92]">Democratizing</span>
                </div>
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: BG_IMAGE,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: 'center 45%'
                  }}
                >
                  Ocean Data
                </span>
              </h1>
            )}
            <p className="text-base md:text-lg text-muted-foreground mb-5 md:mb-6 max-w-3xl mx-auto leading-relaxed">
              Access, Query, and Visualize the Ocean like never before.
              Unlock the power of marine data for research, conservation, and discovery.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8 md:mb-10">
              <TransitionLink to="/chat" variant="fade">
                <Button 
                  variant="ocean" 
                  size="lg"
                  className="group"
                >
                  Wave Us
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </TransitionLink>
              
              <TransitionLink to="/learn" variant="fade">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="bg-card/50 backdrop-blur-sm hover:bg-card/80 border-primary/20 hover:border-primary/40"
                >
                  Learn More
                </Button>
              </TransitionLink>
            </div>  
          </div>
        </motion.div>
      )}
      <Suspense fallback={null}>
        {authOpen ? <AuthModal open={authOpen} onClose={closeAuth} /> : null}
      </Suspense>
    </section>
  );
};

export default memo(Hero);