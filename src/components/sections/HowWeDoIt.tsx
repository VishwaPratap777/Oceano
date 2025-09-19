import { motion } from "framer-motion";

const steps = [
  {
    title: "Ingest",
    desc: "Aggregate public ocean datasets (SST, salinity, Argo, currents) with scheduled updates.",
  },
  {
    title: "Process",
    desc: "Normalize, tile, and index for fast querying and lightweight client delivery.",
  },
  {
    title: "Analyze",
    desc: "Compute summaries and anomalies for real-time situational awareness.",
  },
  {
    title: "Visualize",
    desc: "Render minimal, high-contrast UI with smooth motion and low distraction.",
  },
];

const HowWeDoIt = () => {
  return (
    <section id="how" className="relative w-full py-16 md:py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-slate-100 tracking-tight">How We Do It</h2>
          <p className="text-slate-400 mt-3 max-w-3xl">
            A high-level snapshot of the pipeline that powers OceanData.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.08, duration: 0.45 }}
              className="rounded-2xl border border-slate-700/40 bg-slate-800/40 backdrop-blur-md p-6"
            >
              <div className="text-cyan-300/90 text-sm font-medium mb-2">Step {i + 1}</div>
              <h3 className="text-lg font-semibold text-slate-100">{s.title}</h3>
              <p className="text-slate-400 mt-2 text-sm leading-relaxed">{s.desc}</p>
              <div className="mt-4 h-1.5 rounded bg-gradient-to-r from-cyan-500/40 to-blue-500/40" />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="absolute inset-x-0 -bottom-2 h-16 bg-gradient-to-t from-blue-900/20 to-transparent" />
    </section>
  );
};

export default HowWeDoIt;
