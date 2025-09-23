import { useEffect, useRef, memo } from "react";
import { gsap } from "gsap";

const OceanBackground = ({ dim = false, showGradient = true, zIndex = 0 }: { dim?: boolean; showGradient?: boolean; zIndex?: number }) => {
  const waveBack = useRef<HTMLDivElement>(null);
  const waveMid = useRef<HTMLDivElement>(null);
  const waveFront = useRef<HTMLDivElement>(null);
  const leftStreamRef = useRef<HTMLDivElement>(null);
  const rightStreamRef = useRef<HTMLDivElement>(null);

  const tweensRef = useRef<gsap.core.Tween[]>([]);

  useEffect(() => {
    // Debug: confirm background waves mounted
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line no-console
      console.log('[OceanBackground] initializing wave animations');
    }
    const layers = [
      { ref: waveBack, duration: 50 },
      { ref: waveMid, duration: 30 },
      { ref: waveFront, duration: 18 }
    ];

    const animations: gsap.core.Tween[] = [];

    layers.forEach(({ ref, duration }, idx) => {
      if (!ref.current) return;
      // Two tiles create a seamless loop. Animate X from 0 to -50% and repeat.
      const tween = gsap.to(ref.current, {
        xPercent: -50,
        ease: "none",
        duration,
        repeat: -1,
        force3D: true,
        transformOrigin: "0 0"
      });
      animations.push(tween);

      // Subtle vertical bobbing per layer for a fluid effect
      animations.push(
        gsap.to(ref.current, {
          y: idx === 2 ? -6 : idx === 1 ? -4 : -2,
          duration: 3 + idx,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
          force3D: true
        })
      );
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
        gsap.set(el, { y: startY, opacity: 0, force3D: true });
        tweens.push(
          gsap.to(el, { y: -travel, opacity: 1, duration: dur, delay: del, repeat: -1, ease: 'none', force3D: true })
        );
        // gentle sideways drift
        tweens.push(
          gsap.to(el, { x: `+=${(Math.random() - 0.5) * 30}`, duration: 3 + Math.random()*2, repeat: -1, yoyo: true, ease: 'sine.inOut', force3D: true })
        );
      });
      return tweens;
    };

    const streamTweens = [
      ...animateStream(leftStreamRef.current),
      ...animateStream(rightStreamRef.current)
    ];

    // Keep a reference to all active tweens for resume handling
    tweensRef.current = [...animations, ...streamTweens];

    const resumeAll = () => {
      tweensRef.current.forEach(t => {
        if (t.paused()) t.resume();
        // Nudge playhead to ensure rendering continues
        if (!t.isActive()) t.play();
      });
    };

    const onVisibility = () => {
      if (document.visibilityState === 'visible') resumeAll();
    };
    const onFocus = () => resumeAll();

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', onVisibility);
      window.addEventListener('focus', onFocus);
    }

    return () => {
      animations.forEach(t => t.kill());
      streamTweens.forEach(t => t.kill());
      tweensRef.current = [];
      if (typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', onVisibility);
        window.removeEventListener('focus', onFocus);
      }
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
      <div ref={refProp} className="flex" style={{ width: '200%', willChange: 'transform', transform: 'translate3d(0,0,0)' }}>
        {/* Tile A - smooth, rounded wave */}
        <svg className="w-1/2 h-full" viewBox="0 0 1440 320" preserveAspectRatio="none" aria-hidden>
          <path
            d="M0,230 C180,210 360,250 540,230 C720,210 900,250 1080,230 C1260,210 1440,240 1440,240 L1440,320 L0,320 Z"
            fill={color}
            fillOpacity={opacity}
          />
        </svg>
        {/* Tile B - same shape for seamless tiling */}
        <svg className="w-1/2 h-full" viewBox="0 0 1440 320" preserveAspectRatio="none" aria-hidden>
          <path
            d="M0,230 C180,210 360,250 540,230 C720,210 900,250 1080,230 C1260,210 1440,240 1440,240 L1440,320 L0,320 Z"
            fill={color}
            fillOpacity={opacity}
          />
        </svg>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex }}>
      {/* Dark ocean gradient background */}
      {showGradient && (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-teal-950" style={{ opacity: dim ? 0.85 : 1 }} />
          {/* Soft vignette to improve text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent" style={{ opacity: dim ? 0.6 : 1 }} />
        </>
      )}

      {/* Side bubble streams - keep center clear */}
      <div ref={leftStreamRef} className="absolute inset-y-0 left-0 w-24 md:w-32 overflow-hidden" style={{ opacity: dim ? 0.15 : 1 }}>
        {Array.from({ length: 32 }).map((_, i) => (
          <span
            key={`l-${i}`}
            className="side-bubble absolute rounded-full"
            style={{ left: `${Math.random()*60}%`, width: 8 + Math.random()*12, height: 8 + Math.random()*12 }}
          />
        ))}
      </div>
      <div ref={rightStreamRef} className="absolute inset-y-0 right-0 w-24 md:w-32 overflow-hidden" style={{ opacity: dim ? 0.15 : 1 }}>
        {Array.from({ length: 32 }).map((_, i) => (
          <span
            key={`r-${i}`}
            className="side-bubble absolute rounded-full"
            style={{ right: `${Math.random()*60}%`, width: 8 + Math.random()*12, height: 8 + Math.random()*12 }}
          />
        ))}
      </div>

      {/* Wave layers at bottom (slightly higher) */}
      <div className="absolute inset-x-0 bottom-0 h-[52vh] md:h-[58vh]" style={{ opacity: dim ? 0.2 : 1 }}>
        <div className="absolute inset-0">
          <WaveStrip color="#38bdf8" opacity={dim ? 0.08 : 0.28} height="55%" refProp={waveBack} />
        </div>
        <div className="absolute inset-0">
          <WaveStrip color="#22d3ee" opacity={dim ? 0.10 : 0.34} height="62%" refProp={waveMid} />
        </div>
        <div className="absolute inset-0">
          <WaveStrip color="#67e8f9" opacity={dim ? 0.12 : 0.42} height="70%" refProp={waveFront} />
        </div>
        {/* Subtle gradient fade at the very bottom */}
        <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-slate-950/80 to-transparent" />
        {/* Top fade to blend waves into content */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-slate-900/45 to-transparent" />
      </div>
    </div>
  );
};

export default memo(OceanBackground);
