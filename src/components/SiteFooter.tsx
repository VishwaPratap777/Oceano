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
    <footer className="relative w-full px-4 pt-16 pb-20 md:pt-20 md:pb-24 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent border-t border-slate-800/40 overflow-hidden">
      {/* Local keyframes for wave strip animation */}
      <style>{`
        @keyframes waveSlide {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
      {/* Bubble background integrated */}
      <div className="absolute inset-0 pointer-events-none">
        {/* dark gradient to simulate ocean floor (neutral slate, no green tint) */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/50 to-transparent" />
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

      {/* Hardcoded animated wave SVGs at the very bottom of the footer */}
      <div className="absolute inset-x-0 bottom-0 h-80 md:h-96 pointer-events-none" aria-hidden>
        {/* Layer 1 (back, darkest, lower height) */}
        <div className="absolute inset-x-0 bottom-0" style={{ height: '55%', opacity: 0.95 }}>
          <div className="flex" style={{ width: '200%', animation: 'waveSlide 46s linear infinite' }}>
            <svg className="w-1/2 h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
              <path d="M0,230 C180,210 360,250 540,230 C720,210 900,250 1080,230 C1260,210 1440,240 1440,240 L1440,320 L0,320 Z" fill="#0b3a58" fillOpacity={0.55} />
            </svg>
            <svg className="w-1/2 h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
              <path d="M0,230 C180,210 360,250 540,230 C720,210 900,250 1080,230 C1260,210 1440,240 1440,240 L1440,320 L0,320 Z" fill="#0b3a58" fillOpacity={0.55} />
            </svg>
          </div>
        </div>
        {/* Layer 2 (mid-dark, taller) */}
        <div className="absolute inset-x-0 bottom-0" style={{ height: '66%', opacity: 0.96 }}>
          <div className="flex" style={{ width: '200%', animation: 'waveSlide 28s linear infinite' }}>
            <svg className="w-1/2 h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
              <path d="M0,230 C180,210 360,250 540,230 C720,210 900,250 1080,230 C1260,210 1440,240 1440,240 L1440,320 L0,320 Z" fill="#0a3b5a" fillOpacity={0.6} />
            </svg>
            <svg className="w-1/2 h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
              <path d="M0,230 C180,210 360,250 540,230 C720,210 900,250 1080,230 C1260,210 1440,240 1440,240 L1440,320 L0,320 Z" fill="#0a3b5a" fillOpacity={0.6} />
            </svg>
          </div>
        </div>
        {/* Layer 3 (mid, taller) */}
        <div className="absolute inset-x-0 bottom-0" style={{ height: '78%', opacity: 0.98 }}>
          <div className="flex" style={{ width: '200%', animation: 'waveSlide 18s linear infinite' }}>
            <svg className="w-1/2 h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
              <path d="M0,230 C180,210 360,250 540,230 C720,210 900,250 1080,230 C1260,210 1440,240 1440,240 L1440,320 L0,320 Z" fill="#093a56" fillOpacity={0.65} />
            </svg>
            <svg className="w-1/2 h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
              <path d="M0,230 C180,210 360,250 540,230 C720,210 900,250 1080,230 C1260,210 1440,240 1440,240 L1440,320 L0,320 Z" fill="#093a56" fillOpacity={0.65} />
            </svg>
          </div>
        </div>
        {/* Layer 4 (front, tallest) */}
        <div className="absolute inset-x-0 bottom-0" style={{ height: '88%', opacity: 1 }}>
          <div className="flex" style={{ width: '200%', animation: 'waveSlide 12s linear infinite' }}>
            <svg className="w-1/2 h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
              <path d="M0,230 C180,210 360,250 540,230 C720,210 900,250 1080,230 C1260,210 1440,240 1440,240 L1440,320 L0,320 Z" fill="#082f49" fillOpacity={0.72} />
            </svg>
            <svg className="w-1/2 h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
              <path d="M0,230 C180,210 360,250 540,230 C720,210 900,250 1080,230 C1260,210 1440,240 1440,240 L1440,320 L0,320 Z" fill="#082f49" fillOpacity={0.72} />
            </svg>
          </div>
        </div>
        {/* Extra micro-layers for added richness (slightly less than the tallest) */}
        <div className="absolute inset-x-0 bottom-0" style={{ height: '84%', opacity: 0.85 }}>
          <div className="flex" style={{ width: '200%', animation: 'waveSlide 16s linear infinite' }}>
            <svg className="w-1/2 h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
              <path d="M0,230 C180,210 360,250 540,230 C720,210 900,250 1080,230 C1260,210 1440,240 1440,240 L1440,320 L0,320 Z" fill="#0b4566" fillOpacity={0.5} />
            </svg>
            <svg className="w-1/2 h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
              <path d="M0,230 C180,210 360,250 540,230 C720,210 900,250 1080,230 C1260,210 1440,240 1440,240 L1440,320 L0,320 Z" fill="#0b4566" fillOpacity={0.5} />
            </svg>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0" style={{ height: '80%', opacity: 0.9 }}>
          <div className="flex" style={{ width: '200%', animation: 'waveSlide 20s linear infinite' }}>
            <svg className="w-1/2 h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
              <path d="M0,230 C180,210 360,250 540,230 C720,210 900,250 1080,230 C1260,210 1440,240 1440,240 L1440,320 L0,320 Z" fill="#0a3852" fillOpacity={0.55} />
            </svg>
            <svg className="w-1/2 h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
              <path d="M0,230 C180,210 360,250 540,230 C720,210 900,250 1080,230 C1260,210 1440,240 1440,240 L1440,320 L0,320 Z" fill="#0a3852" fillOpacity={0.55} />
            </svg>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0" style={{ height: '74%', opacity: 0.92 }}>
          <div className="flex" style={{ width: '200%', animation: 'waveSlide 24s linear infinite' }}>
            <svg className="w-1/2 h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
              <path d="M0,230 C180,210 360,250 540,230 C720,210 900,250 1080,230 C1260,210 1440,240 1440,240 L1440,320 L0,320 Z" fill="#0b2f49" fillOpacity={0.58} />
            </svg>
            <svg className="w-1/2 h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
              <path d="M0,230 C180,210 360,250 540,230 C720,210 900,250 1080,230 C1260,210 1440,240 1440,240 L1440,320 L0,320 Z" fill="#0b2f49" fillOpacity={0.58} />
            </svg>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0" style={{ height: '68%', opacity: 0.94 }}>
          <div className="flex" style={{ width: '200%', animation: 'waveSlide 32s linear infinite' }}>
            <svg className="w-1/2 h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
              <path d="M0,230 C180,210 360,250 540,230 C720,210 900,250 1080,230 C1260,210 1440,240 1440,240 L1440,320 L0,320 Z" fill="#0a2940" fillOpacity={0.6} />
            </svg>
            <svg className="w-1/2 h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
              <path d="M0,230 C180,210 360,250 540,230 C720,210 900,250 1080,230 C1260,210 1440,240 1440,240 L1440,320 L0,320 Z" fill="#0a2940" fillOpacity={0.6} />
            </svg>
          </div>
        </div>
        {/* Bottom fade to floor */}
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-slate-950 to-transparent" />
        {/* Soft top fade to blend waves into footer content */}
        <div className="absolute inset-x-0 top-0 h-12 md:h-16 bg-gradient-to-b from-transparent to-slate-900/70" />
      </div>

      {/* Subtle grain overlay for texture */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-soft-light opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at center, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0) 70%), repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 2px)",
          backgroundSize: "120% 120%, 8px 8px",
          backgroundPosition: "center, 0 0",
        }}
      />
    </footer>
  );
};

export default SiteFooter;
