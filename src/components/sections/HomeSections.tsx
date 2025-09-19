import { motion, cubicBezier } from "framer-motion";
import TransitionLink from "@/components/TransitionLink";
import { ArrowRight, Activity, Globe2, Waves, Satellite } from "lucide-react";

const easeStandard = cubicBezier(0.25, 0.46, 0.45, 0.94);

const cardVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { delay: 0.12 * i, duration: 0.5, ease: easeStandard }
  })
};

const SectionShell = ({
  title,
  subtitle,
  children,
  id
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  id?: string;
}) => (
  <section id={id} className="relative w-full py-14 md:py-20 px-4">
    {/* ocean layer highlights */}
    <motion.div
      className="water-layer rounded-3xl"
      style={{
        background: 'radial-gradient(1200px 400px at 10% 20%, rgba(34,211,238,0.12), transparent 60%)'
      }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 0.18 }}
      viewport={{ once: false, amount: 0.4 }}
      transition={{ duration: 1.2, ease: easeStandard }}
    />
    <motion.div
      className="water-layer rounded-3xl"
      style={{
        background: 'radial-gradient(1000px 400px at 80% 50%, rgba(59,130,246,0.12), transparent 60%)'
      }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 0.16 }}
      viewport={{ once: false, amount: 0.4 }}
      transition={{ duration: 1.4, delay: 0.15, ease: easeStandard }}
    />
    <motion.div
      className="water-layer rounded-3xl"
      style={{
        background: 'radial-gradient(900px 420px at 50% 90%, rgba(15,23,42,0.25), transparent 70%)'
      }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 0.2 }}
      viewport={{ once: false, amount: 0.4 }}
      transition={{ duration: 1.6, delay: 0.3, ease: easeStandard }}
    />
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 md:mb-12">
        <h2 className="text-2xl md:text-3xl font-semibold text-slate-100 tracking-tight">
          {title}
        </h2>
        <p className="text-slate-400 mt-2 max-w-2xl">
          {subtitle}
        </p>
      </div>
      {children}
    </div>

    {/* subtle gradient edge glow */}
    <div className="pointer-events-none absolute inset-x-0 -bottom-2 h-16 bg-gradient-to-t from-blue-900/20 to-transparent" />
  </section>
);

const StatsPill = ({ label, value, tone = "cyan" }: { label: string; value: string; tone?: "cyan" | "blue" | "emerald" }) => {
  const toneMap: Record<string, string> = {
    cyan: "from-cyan-600/20 to-blue-600/20 text-cyan-200 border-cyan-500/30",
    blue: "from-blue-600/20 to-indigo-600/20 text-blue-200 border-blue-500/30",
    emerald: "from-emerald-600/20 to-teal-600/20 text-emerald-200 border-emerald-500/30"
  };
  return (
    <div className={`rounded-xl px-4 py-2 border ${toneMap[tone]} bg-gradient-to-r backdrop-blur-sm flex items-center gap-2`}> 
      <span className="text-xs uppercase tracking-wide opacity-80">{label}</span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
};

const MiniSpark = () => (
  <div className="relative h-12 w-full overflow-hidden">
    <div className="absolute inset-0 rounded-md bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-transparent" />
    <motion.div
      className="absolute top-2 left-0 h-1 rounded-full bg-cyan-400/70"
      initial={{ x: "-10%", width: "12%" }}
      animate={{ x: ["-10%", "60%", "110%"], width: ["12%", "18%", "10%"] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute bottom-2 left-0 h-1 rounded-full bg-blue-400/70"
      initial={{ x: "-20%", width: "10%" }}
      animate={{ x: ["-20%", "50%", "120%"], width: ["10%", "16%", "8%"] }}
      transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
    />
  </div>
);

// Tiny mock charts: bar and line
const MiniBarChart = ({ values = [8, 12, 6, 10, 14, 9, 5] }: { values?: number[] }) => {
  const max = Math.max(...values, 1);
  return (
    <div className="flex items-end gap-1.5 h-16 w-full">
      {values.map((v, i) => (
        <motion.div
          key={i}
          initial={{ height: 0, opacity: 0.6 }}
          whileInView={{ height: `${(v / max) * 100}%`, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: i * 0.05, ease: easeStandard }}
          className="flex-1 rounded-t bg-gradient-to-t from-blue-500/30 to-cyan-400/40 border border-cyan-400/20"
        />
      ))}
    </div>
  );
};

const MiniLineChart = ({ points = [2, 4, 3, 5, 6, 4, 7, 6] }: { points?: number[] }) => {
  const max = Math.max(...points, 1);
  const step = 100 / (points.length - 1);
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${i * step}, ${100 - (p / max) * 100}`).join(' ');
  return (
    <div className="w-full h-16">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
        <defs>
          <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={path} fill="none" stroke="#67e8f9" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        <motion.path
          d={path}
          fill="url(#lg)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: easeStandard }}
        />
      </svg>
    </div>
  );
};

const HomeSections = () => {
  return (
    <div className="bg-gradient-to-b from-transparent via-slate-900/10 to-slate-900/20">
      {/* Section 1: Global Ocean Data Review */}
      <SectionShell
        id="data"
        title="Global Ocean Data Review"
        subtitle="A concise snapshot of the ocean's pulse — temperature, salinity, sea level, and currents — unified for rapid situational awareness."
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[0,1,2].map((i) => (
            <motion.div
              key={i}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="rounded-2xl border border-slate-700/40 bg-slate-800/40 backdrop-blur-md p-6 hover:border-cyan-500/30 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-slate-200">
                  {i === 0 && <Globe2 className="w-4 h-4 text-cyan-400" />}
                  {i === 1 && <Waves className="w-4 h-4 text-blue-400" />}
                  {i === 2 && <Activity className="w-4 h-4 text-emerald-400" />}
                  <span className="text-sm font-medium">
                    {i === 0 ? "Sea Surface Temp" : i === 1 ? "Sea Level / Currents" : "Salinity Patterns"}
                  </span>
                </div>
                <StatsPill label="Update" value="~3h" tone={i === 2 ? "emerald" : i === 1 ? "blue" : "cyan"} />
              </div>

              <MiniSpark />

              <div className="mt-5 flex items-center justify-between">
                <div className="text-slate-300 text-sm">
                  {i === 0 && "Global SST anomaly trending mild +0.2°C"}
                  {i === 1 && "Mean sea level steady • Kuroshio current active"}
                  {i === 2 && "Surface salinity stable • regional variance low"}
                </div>
                <TransitionLink to="/chat" variant="ripple">
                  <button className="text-cyan-300 hover:text-cyan-200 text-sm inline-flex items-center gap-1">
                    Explore <ArrowRight className="w-4 h-4" />
                  </button>
                </TransitionLink>
              </div>
            </motion.div>
          ))}
        </div>
      </SectionShell>

      {/* Section 2: Global Argo Float Realtime Analytics */}
      <SectionShell
        id="visualization"
        title="Global Argo Float Realtime Analytics"
        subtitle="Live telemetry from the Argo array — profiles, positions, and coverage, distilled into quick insights."
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <motion.div
            custom={0}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="md:col-span-7 rounded-2xl border border-slate-700/40 bg-slate-800/40 backdrop-blur-md p-6 hover:border-cyan-500/30 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-slate-200">
                <Satellite className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-medium">Realtime Coverage</span>
              </div>
              <StatsPill label="Active" value="~3,800" tone="cyan" />
            </div>
            <div className="aspect-[16/9] rounded-xl border border-slate-700/40 bg-gradient-to-br from-slate-900/60 to-blue-900/40 relative overflow-hidden">
              {/* animated dots to suggest positions */}
              {[...Array(30)].map((_, idx) => {
                const duration = 5 + ((idx % 7) * 0.4);
                const delay = (idx % 10) * 0.12;
                return (
                  <motion.span
                    key={idx}
                    className="absolute w-1.5 h-1.5 rounded-full bg-cyan-300/80 will-change-transform"
                    style={{ left: `${(idx * 29) % 95}%`, top: `${(idx * 17) % 85}%` }}
                    initial={{ opacity: 0.3, y: 0 }}
                    animate={{ opacity: [0.3, 1, 0.3], y: [0, -12, 0] }}
                    transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
                  />
                );
              })}
              <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-slate-900/60 to-transparent" />
            </div>
            {/* tiny line chart under map mock */}
            <div className="mt-4">
              <MiniLineChart points={[2,3,2,4,6,5,7,6,8,7]} />
            </div>
          </motion.div>

          <motion.div
            custom={1}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="md:col-span-5 rounded-2xl border border-slate-700/40 bg-slate-800/40 backdrop-blur-md p-6 hover:border-cyan-500/30 transition-colors"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-700/40 bg-slate-900/40 p-4">
                <p className="text-xs text-slate-400 mb-2">New Profiles (24h)</p>
                <p className="text-2xl font-semibold text-slate-100">~2,150</p>
                <MiniSpark />
              </div>
              <div className="rounded-xl border border-slate-700/40 bg-slate-900/40 p-4">
                <p className="text-xs text-slate-400 mb-2">Avg. Profile Depth</p>
                <p className="text-2xl font-semibold text-slate-100">1,980 m</p>
                <MiniSpark />
              </div>
              <div className="rounded-xl border border-slate-700/40 bg-slate-900/40 p-4 col-span-2">
                <p className="text-xs text-slate-400 mb-2">Telemetry Health</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-sm text-slate-300">Nominal</span>
                </div>
                <div className="mt-3">
                  <StatsPill label="Latency" value="~12 min" tone="emerald" />
                </div>
              </div>
              {/* mock bar chart */}
              <div className="rounded-xl border border-slate-700/40 bg-slate-900/40 p-4 col-span-2">
                <p className="text-xs text-slate-400 mb-2">Profiles per Basin (mock)</p>
                <MiniBarChart values={[8,12,6,14,10,7,11,9]} />
              </div>
            </div>
          </motion.div>
        </div>
      </SectionShell>
    </div>
  );
};

export default HomeSections;
