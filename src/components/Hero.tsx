import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown } from "lucide-react";
import TransitionLink from "./TransitionLink";
import { useRef, useState, lazy, Suspense, useCallback, memo } from "react";
import { useLocation } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";

// Lazy load heavy/rarely-used components to reduce initial bundle
const AuthModal = lazy(() => import("@/components/auth/AuthModal"));

// Ocean background image for text clipping
const OCEAN_BG_IMAGE = "url('/sea2.jpg')";

const Hero = () => {
  const location = useLocation();
  const isLanding = location.pathname === "/";
  const sectionRef = useRef<HTMLElement | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);

  // Handlers memoized to avoid re-creating functions for children
  const openAuth = useCallback(() => setAuthOpen(true), []);
  const closeAuth = useCallback(() => setAuthOpen(false), []);

  // Handle video loading and content reveal
  const handleVideoLoad = useCallback(() => {
    setVideoLoaded(true);
    // Small delay to ensure smooth transition
    setTimeout(() => setShowContent(true), 300);
  }, []);

  // Scroll progress for parallax effects
  const { scrollYProgress } = useScroll({ 
    target: sectionRef, 
    offset: ["start end", "end start"] 
  });
  
  // Parallax transforms for different elements
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const bgPosY = useTransform(scrollYProgress, [0, 1], ['200%', '-300%']);

  return (
    <>
      <section 
        ref={sectionRef} 
        className="fixed top-0 left-0 w-full overflow-hidden z-10"
        style={{ 
          height: '100vh', 
          width: '100vw',
          minHeight: '100vh',
          maxHeight: '100vh',
          display: 'block',
          position: 'fixed'
        }}
      >
      
      {/* Video Background */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        onLoadedData={handleVideoLoad}
        style={{ 
          objectPosition: 'center center',
          objectFit: 'cover',
          height: '100vh',
          width: '100vw',
          minHeight: '100vh',
          minWidth: '100vw',
          maxHeight: '100vh',
          maxWidth: '100vw',
          display: 'block',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          margin: 0,
          padding: 0,
          border: 'none',
          outline: 'none'
        }}
      >
        <source src="/seav.mp4" type="video/mp4" />
      </video>
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Floating particles - only show after video loads */}
      {videoLoaded && (
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-400/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              initial={{ opacity: 0 }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      )}

      {/* Navigation */}
      <div className="absolute top-0 left-0 right-0 z-20 p-8">
        <div className="flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl font-bold text-white"
          >
            Ocean<span className="text-blue-300">Data</span>
          </motion.div>
          
          {isLanding && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Button 
                variant="ocean" 
                size="sm"
                className="group hover:text-white"
                onClick={openAuth}
              >
                Sign In
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Main Content Overlay - only show after video loads */}
      {showContent && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6 max-w-6xl mx-auto"
          style={{ height: '100vh', width: '100vw' }}
        >
          {/* Main Heading with Ocean Background Clipped Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-4 text-center mt-6"
          >
            <motion.h1 
              style={{ y: titleY }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-none text-center"
            >
              <div className="mb-1">
                <span 
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white"
                  style={{
                    textShadow: '0 1px 3px rgba(255, 255, 255, 0.7)'
                  }}
                >
                  Democratizing
                </span>
              </div>
              <span
                className="bg-clip-text text-transparent block"
                style={{
                  backgroundImage: OCEAN_BG_IMAGE,
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: `center ${bgPosY}`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Ocean Data
              </span>
            </motion.h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xl sm:text-2xl md:text-3xl text-white font-light mt-2 mb-6 max-w-4xl mx-auto leading-relaxed drop-shadow-xl"
            style={{
              textShadow: '0 0 15px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 0, 0, 0.6), 0 0 45px rgba(0, 0, 0, 0.4)'
            }}
          >
            Discover the depths of marine knowledge through advanced data visualization and analysis
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-4 md:mb-6"
          >
            <TransitionLink to="/chat" variant="fade">
              <Button 
                variant="ocean" 
                size="lg"
                className="group hover:text-white"
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
          </motion.div>

          {/* Animated Scroll Arrow */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ 
                y: [0, 12, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2.5, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative"
            >
              <ChevronDown 
                className="w-8 h-8 text-white drop-shadow-2xl"
                style={{
                  filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.8)) drop-shadow(0 0 20px rgba(59, 130, 246, 0.6)) drop-shadow(0 0 30px rgba(59, 130, 246, 0.4))',
                  textShadow: '0 0 20px rgba(255, 255, 255, 0.8)'
                }}
              />
              {/* Glow effect */}
              <motion.div 
                className="absolute inset-0 w-8 h-8 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(59, 130, 246, 0.6) 0%, transparent 70%)',
                }}
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}

      {/* Loading State Overlay */}
      {!showContent && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center" style={{ height: '100vh', width: '100vw' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="w-16 h-16 border-4 border-blue-300/30 border-t-blue-300 rounded-full animate-spin mb-4 mx-auto"></div>
            <p className="text-blue-200 text-lg">Loading Ocean Data...</p>
          </motion.div>
        </div>
      )}

      <Suspense fallback={null}>
        {authOpen ? <AuthModal open={authOpen} onClose={closeAuth} /> : null}
      </Suspense>
      </section>
      
      {/* Spacer div to push about section below the fixed hero */}
      <div style={{ height: '100vh', width: '100%' }} />
    </>
  );
};

export default memo(Hero);