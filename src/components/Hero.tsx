import { Button } from "@/components/ui/button";
import { ArrowRight, Database, BarChart3, Globe } from "lucide-react";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import TransitionLink from "./TransitionLink";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import AuthModal from "@/components/auth/AuthModal";


const Hero = () => {
  const location = useLocation();
  const isLanding = location.pathname === "/";
  const sectionRef = useRef<HTMLElement | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  // Scroll progress for parallax: when hero enters to leaves viewport
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -36]); // increased upward drift for visibility
  const bgPos = useTransform(scrollYProgress, [0, 1], ['center 55%', 'center 35%']); // stronger background shift
  const titleScale = useTransform(scrollYProgress, [0, 1], [1, 1.035]); // gentle scale up

  return (
    <section ref={sectionRef} className="min-h-screen flex items-center justify-center w-full pt-24 md:pt-32 pb-16 md:pb-24 px-4">
          {/* Logo - fixed at top left */}
      <div className="absolute top-8 left-8 text-3xl font-bold text-primary">
        Ocean<span className="text-primary-glow">Data</span>
      </div>
      {isLanding && (
        <Button 
          variant="ocean" 
          size="lg"
          className="group fixed top-8 right-8 text-sm md:text-base hover:scale-105 transition-transform duration-300"
          onClick={() => setAuthOpen(true)}
        >
          login
        </Button>
      )}
      <div className="w-full px-6 text-center">
        {/* Main Hero Content */}
        <div className="max-w-4xl mx-auto">
          <motion.h1 style={{ y: titleY, scale: titleScale }} className="text-6xl sm:text-7xl md:text-8xl font-bold mb-6 md:mb-8 text-foreground leading-[0.9] will-change-transform">
            <div className="-mb-2 sm:-mb-3 md:-mb-4">
              <TextHoverEffect text="Democratizing" />
            </div>
            <motion.span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "url('/sea4.jpg')",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: bgPos
              }}
            >
          Ocean Data
            </motion.span>
          </motion.h1>          
          <p className="text-lg md:text-2xl text-muted-foreground mb-10 md:mb-12 max-w-3xl mx-auto leading-relaxed">
            Access, Query, and Visualize the Ocean like never before.
            Unlock the power of marine data for research, conservation, and discovery.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-14 md:mb-16">
            <TransitionLink to="/chat" variant="wave">
              <Button 
                variant="ocean" 
                size="xl"
                className="group"
              >
                Wave Us
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </TransitionLink>
            
            <Button 
              variant="outline" 
              size="xl"
              className="bg-card/50 backdrop-blur-sm hover:bg-card/80 border-primary/20 hover:border-primary/40"
            >
              Learn More
            </Button>
          </div>  
        </div>
      </div>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </section>
  );
};

export default Hero;