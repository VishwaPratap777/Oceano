import { useMemo } from "react";
import { motion } from "framer-motion";
import { Mail, Github, Twitter } from "lucide-react";
import TransitionLink from "@/components/TransitionLink";

const LinkItem = ({ href = "#", children }: { href?: string; children: React.ReactNode }) => (
  <a
    href={href}
    className="text-slate-400 hover:text-slate-200 transition-colors text-sm"
    target={href?.startsWith("http") ? "_blank" : undefined}
    rel={href?.startsWith("http") ? "noreferrer" : undefined}
  >
    {children}
  </a>
);

const SiteFooter = () => {
  const bubbles = useMemo(() => (
    Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100, // percentage
      size: 8 + Math.random() * 14, // px
      delay: Math.random() * 3.5,
      duration: 7 + Math.random() * 8,
      drift: (Math.random() - 0.5) * 32 // px
    }))
  ), []);

  return (
    <footer className="relative w-full px-4 pt-16 pb-20 md:pt-20 md:pb-24 bg-gradient-to-t from-slate-950 via-slate-900/70 to-transparent border-t border-slate-800/40 overflow-hidden">
      {/* Bubble background integrated */}
      <div className="absolute inset-0 pointer-events-none">
        {/* dark gradient to simulate ocean floor */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/50 to-transparent" />
        <div className="absolute inset-0 overflow-hidden">
          {bubbles.map(b => (
            <motion.span
              key={b.id}
              className="absolute rounded-full bg-cyan-200/22 border border-cyan-300/15 shadow-[0_0_10px_rgba(34,211,238,0.18)]"
              style={{ left: `${b.left}%`, bottom: -20, width: b.size, height: b.size }}
              initial={{ y: 0, opacity: 0, x: 0 }}
              animate={{ y: -300, opacity: [0, 0.85, 0], x: b.drift }}
              transition={{ duration: b.duration, delay: b.delay, repeat: Infinity, ease: "easeOut" }}
            />
          ))}
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 z-10">
        <div>
          <h4 className="text-slate-200 font-semibold mb-3">OceanData</h4>
          <p className="text-slate-400 text-sm leading-relaxed">
            Putting global ocean intelligence at your fingertips. Minimal UI. Smooth motion. Clear insights.
          </p>
        </div>
        <div>
          <h4 className="text-slate-200 font-semibold mb-3">APIs</h4>
          <div className="flex flex-col gap-2">
            <LinkItem href="#">REST API (mock)</LinkItem>
            <LinkItem href="#">GraphQL API (mock)</LinkItem>
            <LinkItem href="#">Webhooks (mock)</LinkItem>
          </div>
        </div>
        <div>
          <h4 className="text-slate-200 font-semibold mb-3">Resources</h4>
          <div className="flex flex-col gap-2">
            <LinkItem href="#">Docs (mock)</LinkItem>
            <LinkItem href="#">Changelog (mock)</LinkItem>
            <TransitionLink to="/visualization" variant="fade" >
              <span className="text-slate-400 hover:text-slate-200 transition-colors text-sm">Visualization</span>
            </TransitionLink>
          </div>
        </div>
        <div>
          <h4 className="text-slate-200 font-semibold mb-3">Contact</h4>
          <div className="flex flex-col gap-3 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" /> contact@oceandata.example
            </div>
            <div className="flex items-center gap-2">
              <Github className="w-4 h-4" /> <LinkItem href="https://github.com/your-org/oceandata">GitHub</LinkItem>
            </div>
            <div className="flex items-center gap-2">
              <Twitter className="w-4 h-4" /> <LinkItem href="https://twitter.com/yourhandle">Twitter</LinkItem>
            </div>
          </div>
        </div>
      </div>
      <div className="relative max-w-6xl mx-auto mt-10 pt-6 border-top border-slate-800/40 flex items-center justify-between text-xs text-slate-500 z-10">
        <span>© {new Date().getFullYear()} OceanData. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <LinkItem href="#">Privacy</LinkItem>
          <LinkItem href="#">Terms</LinkItem>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
