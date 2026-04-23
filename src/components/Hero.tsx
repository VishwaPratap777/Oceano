import { Button } from "@/components/ui/button";
import { ArrowRight, Volume2, VolumeX } from "lucide-react";
import TransitionLink from "./TransitionLink";
import { useRef, useState, lazy, Suspense, useCallback, memo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";

// Lazy load heavy/rarely-used components to reduce initial bundle
const AuthModal = lazy(() => import("@/components/auth/AuthModal"));

// Ocean background image constant removed; using video mask for text clipping

const Hero = () => {
  const location = useLocation();
  const isLanding = location.pathname === "/";
  const sectionRef = useRef<HTMLElement | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoCanPlay, setVideoCanPlay] = useState(false);
  const [fontsReady, setFontsReady] = useState(false);
  const [showContent, setShowContent] = useState(true);
  const [stairsDone, setStairsDone] = useState(false);
  const [startDrop, setStartDrop] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  // Ambient audio controls
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [volume, setVolume] = useState<number>(0.6);
  // Masked hero text: manage seamless loop via crossfade between two videos
  const v0Ref = useRef<HTMLVideoElement | null>(null);
  const v1Ref = useRef<HTMLVideoElement | null>(null);
  const v0DurRef = useRef<number>(0);
  const v1DurRef = useRef<number>(0);
  const cfTimerRef = useRef<number | null>(null);
  const [activeVid, setActiveVid] = useState<0 | 1>(0);
  const [vidOpacities, setVidOpacities] = useState<[number, number]>([1, 0]);
  // Slightly longer crossfade for seamless loop
  const crossfadeMs = 1200;

  // Pause background and masked videos when hero is offscreen
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let pausedByObserver = false;
    const pauseAll = () => {
      try { videoRef.current?.pause(); } catch { }
      try { v0Ref.current?.pause(); } catch { }
      try { v1Ref.current?.pause(); } catch { }
    };
    const playAll = () => {
      try { videoRef.current?.play().catch(() => { }); } catch { }
      try { v0Ref.current?.play().catch(() => { }); } catch { }
      try { v1Ref.current?.play().catch(() => { }); } catch { }
    };
    const io = new IntersectionObserver((entries) => {
      const e = entries[0];
      if (!e) return;
      if (e.isIntersecting && e.intersectionRatio > 0.1) {
        if (pausedByObserver) {
          playAll();
          pausedByObserver = false;
        }
      } else {
        pauseAll();
        pausedByObserver = true;
      }
    }, { threshold: [0, 0.1, 0.5, 1] });
    io.observe(section);
    // Also pause on hidden tab
    const onVis = () => {
      if (document.visibilityState === 'hidden') {
        pauseAll();
        pausedByObserver = true;
      } else if (pausedByObserver) {
        playAll();
        pausedByObserver = false;
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  // Ensure both masked videos are playing (muted + inline allows autoplay). This avoids stalls after one iteration.
  useEffect(() => {
    const v0 = v0Ref.current;
    const v1 = v1Ref.current;
    const playSafe = (v?: HTMLVideoElement | null) => {
      if (!v) return;
      try { v.play().catch(() => { }); } catch { }
    };
    playSafe(v0);
    playSafe(v1);
  }, []);


  const scheduleCrossfade = useCallback(() => {
    const a = activeVid === 0 ? v0Ref.current : v1Ref.current;
    const d = activeVid === 0 ? v0DurRef.current : v1DurRef.current;
    if (!a || !isFinite(d) || d <= 0) return;
    const needed = crossfadeMs / 1000 + 0.35; // safety margin
    const remaining = Math.max(0, d - a.currentTime);
    const fireInMs = Math.max(50, (remaining - needed) * 1000);
    if (cfTimerRef.current) window.clearTimeout(cfTimerRef.current);
    cfTimerRef.current = window.setTimeout(() => {
      // trigger startCrossfade via synthetic branch by nudging timeupdate handler logic
      try { a.currentTime = Math.min(a.duration - needed + 0.01, a.duration - 0.05); } catch { }
    }, fireInMs);
  }, [activeVid, crossfadeMs]);

  // Smoothly ramp volume to avoid pops on unmute
  const rampVolume = useCallback((target: number, durationMs = 1000) => {
    const a = audioRef.current;
    if (!a) return;
    const start = a.volume;
    const delta = target - start;
    if (Math.abs(delta) < 0.001) { a.volume = target; return; }
    const startTs = performance.now();
    const step = (ts: number) => {
      const p = Math.min(1, (ts - startTs) / durationMs);
      a.volume = Math.max(0, Math.min(1, start + delta * p));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, []);


  // Handlers memoized to avoid re-creating functions for children
  const openAuth = useCallback(() => setAuthOpen(true), []);
  const closeAuth = useCallback(() => setAuthOpen(false), []);

  // Handle video loading and content reveal
  const handleVideoLoad = useCallback(() => {
    setVideoLoaded(true);
  }, []);

  // Mark when video can play through to avoid initial flash
  const handleCanPlayThrough = useCallback(() => {
    setVideoCanPlay(true);
  }, []);

  // Wait for fonts to be ready to prevent layout shift
  useEffect(() => {
    let didCancel = false;
    const ready = async () => {
      try {
        // @ts-ignore - fonts may not exist in some environments
        if (document.fonts && document.fonts.ready) {
          await (document as any).fonts.ready;
        }
      } finally {
        if (!didCancel) setFontsReady(true);
      }
    };
    ready();
    return () => { didCancel = true; };
  }, []);

  // Listen for stairs completion to control when to start video
  useEffect(() => {
    const onStairsComplete = () => {
      setStairsDone(true);
      // Try to start video playback when stairs end
      if (videoRef.current) {
        try { videoRef.current.play(); } catch { }
      }
    };
    window.addEventListener('stairs:complete', onStairsComplete);
    return () => window.removeEventListener('stairs:complete', onStairsComplete);
  }, []);

  // Allow video to play under the transition; no pause gating

  // Small delay after stairs complete before triggering drop animations
  useEffect(() => {
    if (!stairsDone) return;
    const id = window.setTimeout(() => setStartDrop(true), 150);
    return () => window.clearTimeout(id);
  }, [stairsDone]);

  // Initialize audio settings from localStorage
  useEffect(() => {
    try {
      const savedMuted = localStorage.getItem('oceanAudioMuted');
      if (savedMuted !== null) setIsMuted(savedMuted === 'true');
      const savedVol = localStorage.getItem('oceanAudioVolume');
      if (savedVol !== null) {
        const v = parseFloat(savedVol);
        if (!Number.isNaN(v)) setVolume(Math.min(1, Math.max(0, v)));
      }
    } catch { }
  }, []);

  // Apply base audio settings to element (scroll ducking handled below after scrollYProgress is available)
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.muted = isMuted;
    a.volume = isMuted ? 0 : Math.max(0, Math.min(1, volume));
    try {
      // Attempt to play; will succeed if muted or after user gesture
      a.play().catch(() => { });
    } catch { }
  }, [isMuted, volume]);

  // Persist settings
  useEffect(() => {
    try { localStorage.setItem('oceanAudioMuted', String(isMuted)); } catch { }
  }, [isMuted]);
  useEffect(() => {
    try { localStorage.setItem('oceanAudioVolume', String(volume)); } catch { }
  }, [volume]);

  // On first user interaction, if user had unmuted previously, try to play
  useEffect(() => {
    const onFirstGesture = () => {
      const a = audioRef.current;
      if (!a) return;
      if (!isMuted) {
        try { a.play().catch(() => { }); } catch { }
      }
      window.removeEventListener('pointerdown', onFirstGesture);
      window.removeEventListener('keydown', onFirstGesture);
    };
    window.addEventListener('pointerdown', onFirstGesture, { once: true });
    window.addEventListener('keydown', onFirstGesture, { once: true });
    return () => {
      window.removeEventListener('pointerdown', onFirstGesture);
      window.removeEventListener('keydown', onFirstGesture);
    };
  }, [isMuted]);

  // Keep opacities in sync with which video is active
  useEffect(() => {
    setVidOpacities(activeVid === 0 ? [1, 0] : [0, 1]);
  }, [activeVid]);

  // Crossfade near the end of the active video with priming to avoid any black frame
  useEffect(() => {
    const a = activeVid === 0 ? v0Ref.current : v1Ref.current;
    const b = activeVid === 0 ? v1Ref.current : v0Ref.current;
    if (!a || !b) return;

    let isFading = false;
    let started = false;
    const startCrossfade = () => {
      if (isFading) return;
      isFading = true;
      try {
        if (!started) {
          b.currentTime = 0.01;
          b.play().catch(() => { });
          started = true;
        }
      } catch { }
      // swap opacities to reveal next video
      setVidOpacities(activeVid === 0 ? [0, 1] : [1, 0]);
      window.setTimeout(() => {
        setActiveVid(activeVid === 0 ? 1 : 0);
      }, crossfadeMs);
    };

    const onTimeUpdate = () => {
      const d = a.duration;
      if (!isFinite(d) || d <= 0) return;
      const t = a.currentTime;
      const remaining = d - t;
      const needed = crossfadeMs / 1000 + 0.35; // slightly larger safety margin
      if (!isFading && remaining <= needed) {
        // Prime next video and only crossfade when it has data ready
        try {
          b.currentTime = 0.01;
        } catch { }
        if (b.readyState >= 3 /* HAVE_FUTURE_DATA */) {
          startCrossfade();
        } else {
          const onCanPlay = () => {
            b.removeEventListener('canplay', onCanPlay);
            startCrossfade();
          };
          b.addEventListener('canplay', onCanPlay, { once: true });
        }
      }
    };

    // Fallback: if the active video ends without timeupdate threshold triggering
    const onEnded = () => {
      if (isFading) return;
      // Ensure the other video is ready, then crossfade immediately
      try { b.currentTime = 0.01; } catch { }
      if (b.readyState >= 3) {
        startCrossfade();
      } else {
        const onCanPlay = () => {
          b.removeEventListener('canplay', onCanPlay);
          startCrossfade();
        };
        b.addEventListener('canplay', onCanPlay, { once: true });
      }
    };

    a.addEventListener('timeupdate', onTimeUpdate);
    scheduleCrossfade();
    a.addEventListener('ended', onEnded);
    return () => {
      a.removeEventListener('timeupdate', onTimeUpdate);
      a.removeEventListener('ended', onEnded);
      if (cfTimerRef.current) { window.clearTimeout(cfTimerRef.current); cfTimerRef.current = null; }
    };
  }, [activeVid, crossfadeMs, scheduleCrossfade]);

  // Scroll progress for parallax effects
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Parallax transforms for different elements
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -30]);
  // Snap parallax to integers to avoid subpixel seams on masked edges
  const roundedTitleY = useTransform(titleY, (v) => Math.round(v));

  // Live scroll-based audio ducking: top loudest, bottom minimal
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    // Handler to apply volume based on scroll position
    const apply = (p: number) => {
      if (!audioRef.current) return;
      if (isMuted) return; // don't change while muted
      const clamped = Math.max(0, Math.min(1, Number(p) || 0));
      const fac = 1 - 0.9 * clamped; // 1 at top -> 0.1 at bottom
      audioRef.current.volume = Math.max(0, Math.min(1, volume * fac));
    };
    // Initial apply
    try {
      const p = (scrollYProgress as any)?.get ? (scrollYProgress as any).get() : 0;
      apply(p);
    } catch { }
    // Subscribe to changes
    const unsub = (scrollYProgress as any)?.on ? (scrollYProgress as any).on("change", apply) : undefined;
    return () => { if (unsub) unsub(); };
  }, [scrollYProgress, isMuted, volume]);

  return (
    <>
      <section
        ref={sectionRef}
        className="fixed top-0 left-0 w-full overflow-hidden z-10"
        style={{
          height: '100vh',
          width: '100vw',
          minHeight: '100vh',
          maxHeight: '100vh',
          display: 'block',
          position: 'fixed'
        }}
      >

        {/* Video Background */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onLoadedData={handleVideoLoad}
          onCanPlayThrough={handleCanPlayThrough}
          style={{
            objectPosition: 'center center',
            objectFit: 'cover',
            height: '100vh',
            width: '100vw',
            display: 'block',
            zIndex: 0,
            opacity: 1,
            transition: 'opacity 300ms ease',
            willChange: 'opacity',
            transform: 'translate3d(0,0,0)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden'
          }}
        >
          <source src="/seav.mp4" type="video/mp4" />
        </video>

        {/* Poster overlay (frame1.jpg) above the video to prevent any flash before ready */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/frame1.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: videoCanPlay ? 0 : 1,
            transition: 'opacity 400ms ease',
            zIndex: 5,
            pointerEvents: 'none'
          }}
        />

        {/* Dark Overlay above video */}
        <div className="absolute inset-0 bg-black/40" style={{ zIndex: 10 }} />

        {/* Subtle animated grain overlay (SVG noise), low opacity */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 15, mixBlendMode: 'overlay', opacity: 0.08 }}>
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <filter id="grainNoise">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" seed="2">
                <animate attributeName="baseFrequency" dur="6s" values="0.85;0.95;0.85" repeatCount="indefinite" />
              </feTurbulence>
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#grainNoise)" />
          </svg>
        </div>

        {/* Navigation above overlays and particles */}
        <div className="absolute top-0 left-0 right-0 p-8" style={{ zIndex: 30 }}>
          <div className="flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-2xl font-bold text-white"
            >
              Ocean<span className="text-blue-300">Data</span>
            </motion.div>

            {isLanding && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {/* Use default variant (ripple) to avoid invalid value while keeping same UI */}
                <TransitionLink to="/login">
                  <Button
                    variant="ocean"
                    size="sm"
                    className="group hover:text-white"
                  >
                    Sign In
                  </Button>
                </TransitionLink>
              </motion.div>
            )}
          </div>
        </div>

        {/* Main Content Overlay - only show after video loads */}
        {showContent && (
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 max-w-6xl mx-auto"
            style={{ height: '100vh', width: '100vw', zIndex: 30 }}
          >
            {/* Main Heading with Ocean Background Clipped Text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 4, ease: 'easeOut', delay: 0.6 }}
              className="mb-4 text-center mt-6"
              style={{ marginTop: '50px' }}
            >
              <motion.h1
                style={{ y: roundedTitleY }}
                className="text-[5.2rem] sm:text-[8.5rem] md:text-[14.2rem] lg:text-[23.8rem] font-black leading-none text-center"
              >
                {/* Video-clipped text using SVG mask. The hidden span sizes the box to the text,
                  and an absolutely positioned SVG masks a video to the text shape. */}
                <span className="relative inline-block align-middle" style={{ lineHeight: 1, paddingLeft: '0.08em', paddingRight: '0.08em', overflow: 'hidden' }}>
                  {/* Sizing ghost: matches text sizing without visual output */}
                  <span
                    aria-hidden="true"
                    className="invisible select-none pointer-events-none block"
                    style={{
                      whiteSpace: 'nowrap',
                      lineHeight: 1,
                    }}
                  >
                    DIVE DEEPER
                  </span>
                  {/* Masked video overlay */}
                  <svg
                    className="absolute block"
                    viewBox="0 0 1400 420"
                    preserveAspectRatio="xMidYMid slice"
                    style={{ top: '-4px', left: '-4px', position: 'absolute', width: 'calc(100% + 8px)', height: 'calc(100% + 8px)', willChange: 'transform', transform: 'translateZ(0)', shapeRendering: 'geometricPrecision' }}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      {/* Water ripple filter for subtle refraction effect */}
                      <filter id="waterRipple" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox">
                        <feTurbulence type="fractalNoise" baseFrequency="0.003 0.008" numOctaves="2" seed="3" result="noise" />
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G">
                          {/* Ramp up once, then gently ramp down and stop (no looping) */}
                          <animate attributeName="scale" dur="1.2s" values="0;8" fill="freeze" />
                          <animate attributeName="scale" dur="5s" values="8;0" begin="1.2s" fill="freeze" />
                        </feDisplacementMap>
                      </filter>
                      <mask id="oceanTextMask" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse">
                        {/* Black background hides everything by default. Overscan increased to avoid edge seams */}
                        <rect x="-20" y="-20" width="1440" height="460" fill="black" />
                        {/* White text reveals the video where the glyphs are */}
                        <text
                          x="700"
                          y="210"
                          fill="white"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fontWeight="900"
                          style={{
                            fontFamily: 'inherit',
                            fontSize: '120px',
                            letterSpacing: '0em',
                          }}
                        >
                          DIVE DEEPER
                        </text>
                      </mask>
                    </defs>
                    {/* Use foreignObject to place HTML video and mask it with the text. Overscan to match mask */}
                    <g filter="url(#waterRipple)">
                      <foreignObject x="-20" y="-20" width="1440" height="460" mask="url(#oceanTextMask)">
                        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                          {/* Video A */}
                          <video
                            ref={v0Ref as any}
                            src="/seav3.mp4"
                            autoPlay
                            muted
                            playsInline
                            preload="metadata"
                            loop
                            onLoadedMetadata={(e) => {
                              v0DurRef.current = e.currentTarget.duration || 0;
                              if (activeVid === 0) {
                                try { e.currentTarget.play().catch(() => { }); } catch { }
                              }
                            }}
                            onCanPlay={() => {
                              if (activeVid === 0) {
                                try { v0Ref.current?.play().catch(() => { }); } catch { }
                              }
                            }}
                            style={{
                              position: 'absolute',
                              inset: 0,
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              display: 'block',
                              opacity: vidOpacities[0],
                              transition: `opacity ${crossfadeMs}ms ease`,
                              willChange: 'opacity',
                              transform: 'translate3d(0,0,0)',
                              backfaceVisibility: 'hidden'
                            }}
                          />
                          {/* Video B */}
                          <video
                            ref={v1Ref as any}
                            src="/seav2.mp4"
                            autoPlay
                            muted
                            playsInline
                            preload="metadata"
                            loop
                            onLoadedMetadata={(e) => {
                              v1DurRef.current = e.currentTarget.duration || 0;
                              if (activeVid === 1) {
                                try { e.currentTarget.play().catch(() => { }); } catch { }
                              }
                            }}
                            onCanPlay={() => {
                              if (activeVid === 1) {
                                try { v1Ref.current?.play().catch(() => { }); } catch { }
                              }
                            }}
                            style={{
                              position: 'absolute',
                              inset: 0,
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              display: 'block',
                              opacity: vidOpacities[1],
                              transition: `opacity ${crossfadeMs}ms ease`,
                              willChange: 'opacity',
                              transform: 'translate3d(0,0,0)',
                              backfaceVisibility: 'hidden'
                            }}
                          />
                        </div>
                      </foreignObject>
                    </g>
                  </svg>
                </span>
              </motion.h1>
            </motion.div>

            {/* Subtitle removed as requested */}

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 1, y: 50 }}
              animate={{ opacity: 1, y: startDrop ? 0 : 50 }}
              transition={{ type: 'spring', stiffness: 185, damping: 20, mass: 1.0, delay: 0.12 }}
              className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-4 md:mb-6"
            >
              {/* Disable overlay to match previous 'none' behavior without using an invalid variant */}
              <TransitionLink to="/chat" noOverlay>
                <Button
                  variant="ocean"
                  size="lg"
                  className="group hover:text-white"
                >
                  Wave Us
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </TransitionLink>

              <TransitionLink to="/learn" noOverlay>
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-card/50 backdrop-blur-sm hover:bg-card/80 border-primary/20 hover:border-primary/40"
                >
                  Learn More
                </Button>
              </TransitionLink>
            </motion.div>

            {/* Scroll arrow removed as requested */}
          </motion.div>
        )}

        {/* Ambient audio element (hidden) */}
        <audio
          ref={audioRef}
          loop={false}
          preload="auto"
          muted={isMuted}
          onLoadedData={() => {
            const a = audioRef.current; if (!a) return;
            try {
              // Skip first ~2 seconds
              a.currentTime = Math.min(a.duration - 0.05, 2);
              a.play().catch(() => { });
            } catch { }
          }}
          onEnded={() => {
            const a = audioRef.current; if (!a) return;
            try {
              a.currentTime = Math.min(a.duration - 0.05, 2);
              a.play().catch(() => { });
            } catch { }
          }}
          onError={(e) => {
            // eslint-disable-next-line no-console
            console.warn('Ambient audio failed to load/play', e);
          }}
          style={{ display: 'none' }}
        >
          <source src="/waves-ambience.ogg" type="audio/ogg" />
          <source src="/waves-ambience.mp3" type="audio/mpeg" />
        </audio>

        {/* Mute/Unmute control bottom-right */}
        <div
          className="absolute bottom-4 right-4"
          style={{ zIndex: 40 }}
        >
          <button
            type="button"
            onClick={() => {
              setIsMuted((m) => {
                const next = !m;
                if (!next) {
                  const a = audioRef.current;
                  if (a) {
                    try {
                      a.muted = false;
                      a.volume = 0;
                      a.play().catch(() => { });
                      const p = (scrollYProgress as any)?.get ? (scrollYProgress as any).get() : 0;
                      const clamped = Math.max(0, Math.min(1, Number(p) || 0));
                      const fac = 1 - 0.9 * clamped;
                      rampVolume(Math.max(0, Math.min(1, volume * fac)), 600);
                    } catch { }
                  }
                }
                return next;
              });
            }}
            className="inline-flex items-center justify-center rounded-full bg-black/40 backdrop-blur text-white border border-white/20 hover:bg-black/60 transition-colors"
            style={{ width: 44, height: 44 }}
            aria-label={isMuted ? 'Unmute ambient audio' : 'Mute ambient audio'}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>

        {/* Loading State Overlay */}
        {!showContent && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center" style={{ height: '100vh', width: '100vw' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="w-16 h-16 border-4 border-blue-300/30 border-t-blue-300 rounded-full animate-spin mb-4 mx-auto"></div>
              <p className="text-blue-200 text-lg">Loading Ocean Data...</p>
            </motion.div>
          </div>
        )}

        <Suspense fallback={null}>
          {authOpen ? <AuthModal open={authOpen} onClose={closeAuth} /> : null}
        </Suspense>
      </section>

      {/* Spacer div to push about section below the fixed hero */}
      <div style={{ height: '100vh', width: '100%' }} />
    </>
  );
};

export default memo(Hero);