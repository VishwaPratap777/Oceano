import { PropsWithChildren, useEffect, useRef } from "react";
import Lenis from "lenis";

export default function LenisProvider({ children }: PropsWithChildren) {
  const lenisRef = useRef<Lenis | null>(null);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    // Respect reduced motion users
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    lenisRef.current = lenis;

    const raf = (time: number) => {
      lenis.raf(time);
      rafIdRef.current = requestAnimationFrame(raf);
    };

    rafIdRef.current = requestAnimationFrame(raf);

    // Pause smooth scrolling while the stairs overlay is active
    const onStairsStart = () => {
      try { lenis.stop(); } catch {}
    };
    const onStairsComplete = () => {
      try { lenis.start(); } catch {}
    };
    window.addEventListener('stairs:start', onStairsStart);
    window.addEventListener('stairs:complete', onStairsComplete);

    // Save some cycles on hidden tabs
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') {
        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      } else if (!rafIdRef.current) {
        rafIdRef.current = requestAnimationFrame(raf);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.removeEventListener('stairs:start', onStairsStart);
      window.removeEventListener('stairs:complete', onStairsComplete);
      document.removeEventListener('visibilitychange', onVisibility);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return children as JSX.Element;
}
