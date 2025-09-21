import { useEffect, useRef } from "react";
import { gsap } from "gsap";

// Simple, hardcoded waves section that sits at the very bottom of the page flow
// Not fixed to the viewport. Appears only when the user reaches the bottom area.
const BottomWaves = ({ height = '48vh' }: { height?: string }) => {
  const waveBack = useRef<HTMLDivElement>(null);
  const waveMid = useRef<HTMLDivElement>(null);
  const waveFront = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layers = [
      { ref: waveBack, duration: 50 },
      { ref: waveMid, duration: 30 },
      { ref: waveFront, duration: 18 },
    ];

    const animations: gsap.core.Tween[] = [];

    layers.forEach(({ ref, duration }, idx) => {
      if (!ref.current) return;
      const el = ref.current;
      gsap.set(el, { xPercent: 0, y: 0, willChange: 'transform' });
      animations.push(
        gsap.to(el, { xPercent: -50, duration, ease: 'none', repeat: -1 })
      );
      // Subtle vertical bob
      animations.push(
        gsap.to(el, {
          y: idx === 2 ? -6 : idx === 1 ? -4 : -2,
          duration: 3 + idx,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut'
        })
      );
    });

    return () => {
      animations.forEach(t => t.kill());
    };
  }, []);

  const WaveStrip = ({ color, opacity, height, refProp }: { color: string; opacity: number; height: string; refProp: React.RefObject<HTMLDivElement>; }) => (
    <div className="absolute left-0 right-0 overflow-hidden" style={{ bottom: 0, height }}>
      <div ref={refProp} className="flex" style={{ width: '200%', willChange: 'transform' }}>
        {/* Tile A */}
        <svg className="w-1/2 h-full" viewBox="0 0 1440 320" preserveAspectRatio="none" aria-hidden>
          <path d="M0,230 C180,210 360,250 540,230 C720,210 900,250 1080,230 C1260,210 1440,240 1440,240 L1440,320 L0,320 Z" fill={color} fillOpacity={opacity} />
        </svg>
        {/* Tile B */}
        <svg className="w-1/2 h-full" viewBox="0 0 1440 320" preserveAspectRatio="none" aria-hidden>
          <path d="M0,230 C180,210 360,250 540,230 C720,210 900,250 1080,230 C1260,210 1440,240 1440,240 L1440,320 L0,320 Z" fill={color} fillOpacity={opacity} />
        </svg>
      </div>
    </div>
  );

  return (
    <section className="relative w-full" style={{ height }}>
      {/* Backdrop (soft gradient) */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sky-900/10 to-slate-950" />
      {/* Layers */}
      <div className="absolute inset-x-0 bottom-0 h-full">
        <div className="absolute inset-0">
          <WaveStrip color="#38bdf8" opacity={0.28} height="55%" refProp={waveBack} />
        </div>
        <div className="absolute inset-0">
          <WaveStrip color="#22d3ee" opacity={0.34} height="62%" refProp={waveMid} />
        </div>
        <div className="absolute inset-0">
          <WaveStrip color="#67e8f9" opacity={0.46} height="72%" refProp={waveFront} />
        </div>
      </div>
      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
    </section>
  );
};

export default BottomWaves;
