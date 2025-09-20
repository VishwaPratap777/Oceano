import gsap from 'gsap'
import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

interface StairsProps {
  children: React.ReactNode;
}

const Stairs = ({ children }: StairsProps) => {
  const currentPath = useLocation().pathname
  const SHOW_INTRO_LOADER = true;

  const stairParentRef = useRef<HTMLDivElement>(null)
  const pageRef = useRef<HTMLDivElement>(null)
  const loaderRef = useRef<HTMLDivElement>(null)
  const turbRef = useRef<SVGFETurbulenceElement>(null)
  const dispRef = useRef<SVGFEDisplacementMapElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const parent = stairParentRef.current
    const page = pageRef.current
    const loader = loaderRef.current
    const turb = turbRef.current
    const disp = dispRef.current
    const logo = logoRef.current
    if (!parent || !page) return

    const bars = Array.from(parent.querySelectorAll<HTMLElement>('.stair'))

    // Reset initial state
    gsap.set(parent, { display: 'none' })
    gsap.set(bars, { clearProps: 'all', yPercent: 0 })
    // Ensure page is visible behind the stairs so the overlay reveals actual content
    gsap.set(page, { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 })
    if (loader) gsap.set(loader, { display: 'none', opacity: 0 })

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    // 1) Intro overlay loader (~3s) BEFORE stairs — disabled to avoid blank/black screen
    const seenKey = 'hasSeenHomeLoader';
    const hasSeenHomeLoader = typeof window !== 'undefined' && sessionStorage.getItem(seenKey) === 'true';
    if (SHOW_INTRO_LOADER && loader && currentPath === '/' && !hasSeenHomeLoader) {
      tl.set(loader, { display: 'flex', opacity: 0 })
        .to(loader, { opacity: 1, duration: 0.35 }) // fade in
        .to({}, { duration: 2.3 }) // sustain effect visible
        // Begin fade-out and stairs at the same time for overlap
        .addLabel('loaderFadeOutStart')
        .to(loader, { opacity: 0, duration: 0.8 }, 'loaderFadeOutStart') // fade out loader (longer)
        .to(parent, { display: 'block', duration: 0 }, 'loaderFadeOutStart') // show stairs container under loader
        .add(() => { try { window.dispatchEvent(new Event('stairs:start')) } catch {} }, 'loaderFadeOutStart')
        .from(bars, {
          height: 0,
          duration: 0.45,
          ease: 'power4.out',
          stagger: { amount: -0.2 },
        }, 'loaderFadeOutStart+=0.00')
        .addLabel('stairsBarsOutStart')
        .to(bars, {
          yPercent: 100,
          duration: 0.7,
          ease: 'sine.out',
          stagger: { amount: -0.25 },
        }, 'stairsBarsOutStart')
        // Mid-way cue for content drop to begin under the overlay
        .add(() => { try { window.dispatchEvent(new Event('stairs:mid')) } catch {} }, 'stairsBarsOutStart+=0.35')
        // Fire completion slightly before fully done for a touch of overlap
        .add(() => { try { window.dispatchEvent(new Event('stairs:complete')) } catch {} }, '>-0.25')
        .set(loader, { display: 'none' })
        .to(parent, { display: 'none', duration: 0 })
        .set(bars, { yPercent: 0 });

      // Animate watery effect attributes during the loader
      if (turb) {
        gsap.fromTo(turb,
          { attr: { baseFrequency: 0.05 } },
          { attr: { baseFrequency: 0.02 }, duration: 3.0, ease: 'sine.inOut' }
        )
      }
      if (disp) {
        gsap.fromTo(disp,
          { attr: { scale: 10 } },
          { attr: { scale: 0 }, duration: 3.0, ease: 'power2.out' }
        )
      }
      if (logo) {
        gsap.fromTo(logo,
          { scale: 0.98, opacity: 0 },
          { scale: 1.05, opacity: 1, duration: 0.6, ease: 'power2.out' }
        )
        gsap.to(logo, { opacity: 0, duration: 0.5, ease: 'power2.inOut', delay: 2.5 })
      }

      // Mark as seen so subsequent navigations to HOME won't show the loader
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(seenKey, 'true');
      }
    }

    // 2) If loader didn't run (subsequent visits), still run stairs normally
    else {
      tl.add(() => {
          try { window.dispatchEvent(new Event('stairs:start')) } catch {}
        })
        .to(parent, { display: 'block', duration: 0 })
        .from(bars, {
          height: 0,
          duration: 0.45,
          ease: 'power4.out', // quick snap-in
          stagger: { amount: -0.2 },
        })
        .addLabel('stairsBarsOutStart')
        .to(bars, {
          yPercent: 100,
          duration: 0.7,
          ease: 'sine.out', // smooth glide out
          stagger: { amount: -0.25 },
        }, 'stairsBarsOutStart')
        // Mid-way cue for content drop to begin under the overlay
        .add(() => { try { window.dispatchEvent(new Event('stairs:mid')) } catch {} }, 'stairsBarsOutStart+=0.35')
        // Signal completion a bit earlier before the overlay fully hides (more overlap)
        .add(() => {
          try {
            window.dispatchEvent(new Event('stairs:complete'))
          } catch {}
        }, '>-0.25')
        .to(parent, { display: 'none', duration: 0 })
        .set(bars, { yPercent: 0 })
    }

    return () => {
      tl.kill()
      gsap.killTweensOf(bars)
      gsap.killTweensOf(page)
      if (loader) gsap.killTweensOf(loader)
    }
  }, [currentPath])

  return (
    <div>
      {/* Intro overlay loader BEFORE stairs */}
      <div
        ref={loaderRef}
        className='fixed inset-0 z-[10000] hidden items-center justify-center bg-slate-950'
      >
        {/* Inline SVG filter for watery effect */}
        <svg width="0" height="0" className='absolute'>
          <defs>
            <filter id="stairsWaterFilter">
              <feTurbulence ref={turbRef} type="fractalNoise" baseFrequency="0.04" numOctaves="1" seed="3" result="noise" />
              <feDisplacementMap ref={dispRef} in="SourceGraphic" in2="noise" scale="8" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
        </svg>

        <div className='relative flex items-center justify-center'>
          <div
            ref={logoRef}
            className='relative text-5xl md:text-4xl font-extrabold tracking-tight select-none will-change-transform'
            style={{ filter: 'url(#stairsWaterFilter)' }}
          >
            <span className='text-primary'>Ocean</span>
            <span className='text-primary-glow'>Data</span>
          </div>
        </div>
      </div>

      <div ref={stairParentRef} className='h-screen w-full fixed z-[9999] top-0 hidden'>
        <div className='h-full w-full flex'>
          <div className='stair h-full w-1/5 bg-gradient-to-b from-cyan-600 to-blue-800 will-change-transform'></div>
          <div className='stair h-full w-1/5 bg-gradient-to-b from-blue-600 to-slate-800 will-change-transform'></div>
          <div className='stair h-full w-1/5 bg-gradient-to-b from-slate-600 to-slate-900 will-change-transform'></div>
          <div className='stair h-full w-1/5 bg-gradient-to-b from-blue-600 to-slate-800 will-change-transform'></div>
          <div className='stair h-full w-1/5 bg-gradient-to-b from-cyan-600 to-blue-800 will-change-transform'></div>
        </div>
      </div>
      <div ref={pageRef}>
        {children}
      </div>
    </div>
  )
}

export default Stairs
