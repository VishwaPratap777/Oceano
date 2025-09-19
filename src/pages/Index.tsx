import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Hero from "@/components/Hero";
import AboutSection from "@/components/sections/AboutSection";
import HomeSections from "@/components/sections/HomeSections";
import OceanBackground from "@/components/backgrounds/OceanBackground";
import HowWeDoIt from "@/components/sections/HowWeDoIt";
import ScrollIndicators from "@/components/scroll/ScrollIndicators";
import SiteFooter from "@/components/SiteFooter";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname.replace(/^\/+/, "");
    const targetId = path === "about"
      ? "about"
      : path === "data"
      ? "visualization" // route /data should scroll to visualization section
      : path === "visualization"
      ? "visualization"
      : "";
    if (targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        const offset = 80; // account for floating navbar spacing
        const rect = el.getBoundingClientRect();
        const targetTop = rect.top + window.pageYOffset - offset;
        window.scrollTo({ top: targetTop, behavior: "smooth" });
      }
    } else if (path === "") {
      // Scroll to top for Home
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location]);

  return (
    <>
      <OceanBackground />
      <ScrollIndicators />
      <main className="relative z-10">
        <Hero />
        <AboutSection />
        <HomeSections />
        <HowWeDoIt />
        <SiteFooter />
      </main>
    </>
  );
};

export default Index;
