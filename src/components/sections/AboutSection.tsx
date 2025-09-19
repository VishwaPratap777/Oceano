import { motion } from "framer-motion";

const AboutSection = () => {
  return (
    <section id="about" className="relative w-full py-16 md:py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 md:mb-10">
          <h2 className="text-3xl md:text-4xl font-semibold text-slate-100 tracking-tight">
            About OceanData
          </h2>
          <p className="text-slate-400 mt-3 max-w-3xl">
            We democratize access to the world\'s ocean intelligence — bringing together observations, models, and analytics into a single, clean interface. From Argo floats to sea surface temperatures, explore the ocean with fast, elegant tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[{label:'Datasets',value:'120+'},{label:'Profiles',value:'3.2M+'},{label:'Daily Updates',value:'~50k'}].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="rounded-2xl border border-slate-700/40 bg-slate-800/40 backdrop-blur-md p-6"
            >
              <p className="text-slate-400 text-sm">{s.label}</p>
              <p className="text-2xl font-semibold text-slate-100 mt-2">{s.value}</p>
              <div className="mt-4 h-1.5 rounded bg-gradient-to-r from-cyan-500/40 to-blue-500/40" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* soft divider */}
      <div className="absolute inset-x-0 -bottom-2 h-16 bg-gradient-to-t from-blue-900/20 to-transparent" />
    </section>
  );
};

export default AboutSection;
