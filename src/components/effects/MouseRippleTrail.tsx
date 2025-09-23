import { useEffect, useRef, memo } from "react";

// Minimal watery ripple mouse trail using a lightweight canvas overlay.
// - Pointer-events: none; does not block UI
// - Runs only on non-touch devices
// - Very subtle cyan/blue radial ripples with decay
const MouseRippleTrail = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const rafRef = useRef<number | null>(null);
  const pointsRef = useRef<Array<{ x: number; y: number; t: number; life: number }>>([]);
  const lastMoveRef = useRef(0);

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return; // skip on touch devices

    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.inset = '0';
    canvas.style.zIndex = '50';
    canvas.style.pointerEvents = 'none';
    canvas.style.mixBlendMode = 'screen';
    canvas.style.opacity = '0.35';
    // Attach to body to cover entire app
    document.body.appendChild(canvas);
    canvasRef.current = canvas;

    const ctx = canvas.getContext('2d');
    if (!ctx) return () => {};
    ctxRef.current = ctx;

    const setSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;
    };
    setSize();

    const addPoint = (x: number, y: number) => {
      const now = performance.now();
      pointsRef.current.push({ x, y, t: now, life: 800 }); // life in ms
      // Cap number of points to keep perf
      if (pointsRef.current.length > 60) pointsRef.current.shift();
    };

    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastMoveRef.current < 32) return; // throttle to ~30fps for better performance
      lastMoveRef.current = now;
      addPoint(e.clientX, e.clientY);
    };

    const animate = () => {
      const ctx = ctxRef.current!;
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);

      // Fade previous frame slightly to create trail
      ctx.clearRect(0, 0, w, h);

      const now = performance.now();
      pointsRef.current = pointsRef.current.filter(p => now - p.t < p.life);

      for (const p of pointsRef.current) {
        const age = now - p.t;
        const k = Math.min(1, Math.max(0, age / p.life));
        const radius = 6 + k * 42; // grows over time
        const alpha = (1 - k) * 0.25; // fade out

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
        grad.addColorStop(0, `rgba(56,189,248,${alpha})`); // cyan-400
        grad.addColorStop(0.6, `rgba(59,130,246,${alpha * 0.5})`); // blue-500
        grad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(animate);
    };
    animate();

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('resize', setSize);

    const onVisibility = () => {
      if (document.hidden) {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      } else if (!rafRef.current) {
        animate();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.removeEventListener('mousemove', onMove as any);
      window.removeEventListener('resize', setSize as any);
      document.removeEventListener('visibilitychange', onVisibility as any);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (canvasRef.current && canvasRef.current.parentElement) {
        canvasRef.current.parentElement.removeChild(canvasRef.current);
      }
      // nothing else to clean up
    };
  }, []);

  // No JSX; we draw directly to a fixed canvas attached to body
  return null;
};

export default memo(MouseRippleTrail);
