import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import PageTransitionWrapper from "./components/PageTransitionWrapper";
import { AnimatePresence } from "framer-motion";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const isChatPage = location.pathname === '/chat';

  return (
    <div className="min-h-screen">
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
