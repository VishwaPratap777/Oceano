import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const OceanBackground = () => {
  const waveBack = useRef<HTMLDivElement>(null);
  const waveMid = useRef<HTMLDivElement>(null);
  const waveFront = useRef<HTMLDivElement>(null);
  const leftStreamRef = useRef<HTMLDivElement>(null);
  const rightStreamRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Debug: confirm background waves mounted
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line no-console
      console.log('[OceanBackground] initializing wave animations');
    }
    const layers = [
      { ref: waveBack, duration: 60 },
      { ref: waveMid, duration: 40 },
      { ref: waveFront, duration: 25 }
    ];

    const animations: gsap.core.Tween[] = [];

    layers.forEach(({ ref, duration }) => {
      if (!ref.current) return;
      // Two tiles create a seamless loop. Animate X from 0 to -50% and repeat.
      const tween = gsap.to(ref.current, {
        xPercent: -50,
        ease: "none",
        duration,
        repeat: -1
      });
      animations.push(tween);
    });

    // Side bubble streams animation
    const animateStream = (container: HTMLDivElement | null) => {
      if (!container) return [] as gsap.core.Tween[];
      const elems = Array.from(container.querySelectorAll<HTMLElement>('.side-bubble'));
      const tweens: gsap.core.Tween[] = [];
      const h = typeof window !== 'undefined' ? window.innerHeight : 800;
      elems.forEach((el, idx) => {
        const startY = h + Math.random() * 200;
        const travel = h + 300;
        const dur = 6 + Math.random() * 6;
        const del = Math.random() * 4;
        gsap.set(el, { y: startY, opacity: 0 });
        tweens.push(
          gsap.to(el, { y: -travel, opacity: 1, duration: dur, delay: del, repeat: -1, ease: 'none' })
        );
        // gentle sideways drift
        tweens.push(
          gsap.to(el, { x: `+=${(Math.random() - 0.5) * 30}`, duration: 3 + Math.random()*2, repeat: -1, yoyo: true, ease: 'sine.inOut' })
        );
      });
      return tweens;
    };

    const streamTweens = [
      ...animateStream(leftStreamRef.current),
      ...animateStream(rightStreamRef.current)
    ];

    return () => {
      animations.forEach(t => t.kill());
      streamTweens.forEach(t => t.kill());
    };
  }, []);

  const WaveStrip = ({
    color,
    opacity,
    height,
    refProp
  }: {
    color: string;
    opacity: number;
    height: string;
    refProp: React.RefObject<HTMLDivElement>;
  }) => (
    <div className="absolute left-0 right-0 overflow-hidden" style={{ bottom: 0, height }}>
      <div ref={refProp} className="flex" style={{ width: '200%', willChange: 'transform' }}>
        {/* Tile A */}
        <svg className="w-1/2 h-full" viewBox="0 0 1440 320" preserveAspectRatio="none" aria-hidden>
          <path
            d="M0,180 C160,165 320,205 480,195 C640,185 800,170 960,178 C1120,186 1280,205 1440,190 L1440,320 L0,320 Z"
            fill={color}
            fillOpacity={opacity}
          />
        </svg>
        {/* Tile B */}
        <svg className="w-1/2 h-full" viewBox="0 0 1440 320" preserveAspectRatio="none" aria-hidden>
          <path
            d="M0,180 C160,165 320,205 480,195 C640,185 800,170 960,178 C1120,186 1280,205 1440,190 L1440,320 L0,320 Z"
            fill={color}
            fillOpacity={opacity}
          />
        </svg>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[1] pointer-events-none">
      {/* Dark ocean gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-teal-950" />

      {/* Soft vignette to improve text contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent" />

      {/* Side bubble streams - keep center clear */}
      <div ref={leftStreamRef} className="absolute inset-y-0 left-0 w-24 md:w-32 overflow-hidden">
        {Array.from({ length: 32 }).map((_, i) => (
          <span
            key={`l-${i}`}
            className="side-bubble absolute rounded-full bg-cyan-200/34 border border-cyan-300/20 shadow-[0_0_12px_rgba(34,211,238,0.32)]"
            style={{ left: `${Math.random()*60}%`, width: 8 + Math.random()*12, height: 8 + Math.random()*12 }}
          />
        ))}
      </div>
      <div ref={rightStreamRef} className="absolute inset-y-0 right-0 w-24 md:w-32 overflow-hidden">
        {Array.from({ length: 32 }).map((_, i) => (
          <span
            key={`r-${i}`}
            className="side-bubble absolute rounded-full bg-cyan-200/34 border border-cyan-300/20 shadow-[0_0_12px_rgba(34,211,238,0.32)]"
            style={{ right: `${Math.random()*60}%`, width: 8 + Math.random()*12, height: 8 + Math.random()*12 }}
          />
        ))}
      </div>

      {/* Wave layers at bottom with subtle opacities */}
      <div className="absolute inset-x-0 bottom-0 h-[45vh] md:h-[50vh]">
        <div className="absolute inset-0">
          <WaveStrip color="#06b6d4" opacity={0.24} height="50%" refProp={waveBack} />
        </div>
        <div className="absolute inset-0">
          <WaveStrip color="#22d3ee" opacity={0.3} height="60%" refProp={waveMid} />
        </div>
        <div className="absolute inset-0">
          <WaveStrip color="#67e8f9" opacity={0.38} height="70%" refProp={waveFront} />
        </div>
        {/* Subtle gradient fade at the very bottom */}
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-slate-950/70 to-transparent" />
        {/* Top fade to blend waves into content */}
        <div className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-slate-900/40 to-transparent" />
      </div>
    </div>
  );
};

export default OceanBackground;
