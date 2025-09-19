import gsap from 'gsap'
import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

interface StairsProps {
  children: React.ReactNode;
}

const Stairs = ({ children }: StairsProps) => {
  const currentPath = useLocation().pathname

  const stairParentRef = useRef<HTMLDivElement>(null)
  const pageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const parent = stairParentRef.current
    const page = pageRef.current
    if (!parent || !page) return

    const bars = Array.from(parent.querySelectorAll<HTMLElement>('.stair'))

    // Reset initial state
    gsap.set(parent, { display: 'none' })
    gsap.set(bars, { clearProps: 'all', yPercent: 0 })

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    tl.to(parent, { display: 'block', duration: 0 })
      .from(bars, {
        height: 0,
        duration: 0.5,
        stagger: { amount: -0.2 },
      })
      .to(bars, {
        yPercent: 100,
        duration: 0.6,
        stagger: { amount: -0.25 },
      })
      .to(parent, { display: 'none', duration: 0 })
      .set(bars, { yPercent: 0 })

    gsap.from(page, {
      opacity: 0,
      delay: 1.2,
      scale: 1.06,
      duration: 0.6,
      ease: 'power2.out',
      clearProps: 'transform,opacity'
    })

    return () => {
      tl.kill()
      gsap.killTweensOf(bars)
      gsap.killTweensOf(page)
    }
  }, [currentPath])

  return (
    <div>
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
