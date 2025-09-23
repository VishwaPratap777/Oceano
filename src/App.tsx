import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useRef, useState, useCallback, memo } from "react";
import Index from "./pages/Index";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import PageTransitionWrapper from "./components/PageTransitionWrapper";
import { AnimatePresence } from "framer-motion";
import Learn from "./pages/Learn";
import Login from "./pages/Login";
import MouseRippleTrail from "./components/effects/MouseRippleTrail";
import ScrollIndicators from "@/components/scroll/ScrollIndicators";
import OceanBackground from "@/components/backgrounds/OceanBackground";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const isChatPage = location.pathname === '/chat';
  const isHome = location.pathname === '/';
  
  // Waves should be hidden on the hero (home) until scrolled past 10vh; visible on all other routes
  const initialShow = () => {
    if (!isHome) return true;
    if (typeof window === 'undefined') return false;
    return window.scrollY > window.innerHeight * 0.1;
  };
  const [showWaves, setShowWaves] = useState<boolean>(initialShow);
  const rafRef = useRef<number | null>(null);

  const onScroll = useCallback(() => {
    if (rafRef.current) return;
    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = null;
      setShowWaves(window.scrollY > window.innerHeight * 0.1);
    });
  }, []);

  useEffect(() => {
    if (!isHome) {
      setShowWaves(true);
      return;
    }
    setShowWaves(window.scrollY > window.innerHeight * 0.1);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isHome, onScroll]);

  return (
    <div className="min-h-screen">
      <MouseRippleTrail />
      {/* Waves are hidden on the hero until scroll > 10vh; visible on all other routes */}
      {showWaves && (
        <OceanBackground dim={isChatPage} />
      )}
      <ScrollIndicators />
      {!isChatPage && <Navbar />}
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={
            <PageTransitionWrapper variant="stairs">
              <Index />
            </PageTransitionWrapper>
          } />
          <Route path="/about" element={
            <PageTransitionWrapper variant="stairs">
              <Index />
            </PageTransitionWrapper>
          } />
          <Route path="/data" element={
            <PageTransitionWrapper variant="stairs">
              <Index />
            </PageTransitionWrapper>
          } />
          <Route path="/visualization" element={
            <PageTransitionWrapper variant="stairs">
              <Index />
            </PageTransitionWrapper>
          } />
          <Route path="/chat" element={
            <PageTransitionWrapper variant="stairs">
              <Chat />
            </PageTransitionWrapper>
          } />
          <Route path="/login" element={
            <PageTransitionWrapper variant="stairs">
              <Login />
            </PageTransitionWrapper>
          } />
          <Route path="/learn" element={
            <PageTransitionWrapper variant="stairs">
              <Learn />
            </PageTransitionWrapper>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={
            <PageTransitionWrapper variant="stairs">
              <NotFound />
            </PageTransitionWrapper>
          } />
        </Routes>
      </AnimatePresence>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
