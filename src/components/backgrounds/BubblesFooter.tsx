import { useMemo } from "react";
import { motion } from "framer-motion";

const BubblesFooter = () => {
  const bubbles = useMemo(() => (
    Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100, // percentage
      size: 6 + Math.random() * 10, // px
      delay: Math.random() * 4,
      duration: 6 + Math.random() * 6,
      drift: (Math.random() - 0.5) * 20 // px
    }))
  ), []);

  return (
    <div className="relative w-full h-40 md:h-56 lg:h-64 mt-10">
      {/* dark gradient to simulate ocean floor */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent" />
      <div className="absolute inset-0 overflow-hidden">
        {bubbles.map(b => (
          <motion.span
            key={b.id}
            className="absolute rounded-full bg-cyan-200/15 border border-cyan-300/10 shadow-[0_0_8px_rgba(34,211,238,0.15)]"
            style={{ left: `${b.left}%`, bottom: -20, width: b.size, height: b.size }}
            initial={{ y: 0, opacity: 0, x: 0 }}
            whileInView={{}}
            animate={{ y: -200, opacity: [0, 0.8, 0], x: b.drift }}
            transition={{ duration: b.duration, delay: b.delay, repeat: Infinity, ease: "easeOut" }}
          />
        ))}
      </div>
    </div>
  );
};

export default BubblesFooter;
