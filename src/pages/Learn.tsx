import { motion } from "framer-motion";
import TransitionLink from "@/components/TransitionLink";
import { ArrowLeft } from "lucide-react";

const Section = ({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) => (
  <section id={id} className="relative py-12 md:py-16">
    <div className="sticky top-0 -mx-4 px-4 py-3 bg-gradient-to-r from-sky-900/10 via-cyan-900/10 to-transparent backdrop-blur-xl z-10">
      <h2 className="text-xl md:text-2xl font-semibold text-slate-100">{title}</h2>
    </div>
    <div className="prose prose-invert max-w-none px-4 md:px-0 prose-headings:text-slate-100 prose-p:text-slate-300 prose-strong:text-slate-100 prose-a:text-cyan-300/90">
      {children}
    </div>
  </section>
);

const Learn = () => {
  return (
    <main className="relative min-h-screen pt-24 md:pt-28 pb-16">
      <div className="absolute inset-0 bg-gradient-to-b from-sky-300/15 via-cyan-700/10 to-blue-950/80 -z-10" />
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <TransitionLink to="/" variant="fade">
            <button className="ripple inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/60 text-slate-200 hover:bg-slate-700/60 transition">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          </TransitionLink>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-5xl font-bold text-slate-100 tracking-tight mb-6"
        >
          OceanData: Democratizing ARGO and Oceanographic Insights
        </motion.h1>

        <p className="text-slate-300/95 text-lg leading-relaxed mb-10">
          Oceanographic data is vast, complex, and heterogeneous – ranging from satellite observations to in-situ measurements like CTD casts,
          Argo floats, and BGC sensors. The Argo program, which deploys autonomous profiling floats across the world’s oceans, generates an
          extensive dataset in NetCDF format containing temperature, salinity, and other essential ocean variables. Accessing, querying, and
          visualizing this data requires domain knowledge, technical skills, and familiarity with complex formats and tools. With the rise of AI and
          Large Language Models (LLMs), especially when combined with modern structured databases and interactive dashboards, it is now feasible
          to create intuitive, accessible systems that democratize access to ocean data.
        </p>

        <Section title="Description">
          <p>
            The current problem statement proposes the development of an AI-powered conversational system for ARGO float data that enables users
            to query, explore, and visualize oceanographic information using natural language.
          </p>
        </Section>

        <Section title="System Capabilities">
          <ul>
            <li>Ingest ARGO NetCDF files and convert them into structured formats (like SQL/Parquet).</li>
            <li>Use a vector database (like FAISS/Chroma) to store metadata and summaries for retrieval.</li>
            <li>
              Leverage Retrieval-Augmented Generation (RAG) pipelines powered by multimodal LLMs (such as GPT, QWEN, LLaMA, or Mistral) to interpret
              user queries and map them to database queries (SQL). <strong>(Use Model Context Protocol (MCP))</strong>
            </li>
            <li>
              Enable interactive dashboards (via Streamlit or Dash) for visualization of ARGO profiles, such as mapped trajectories, depth-time plots,
              and profile comparisons, etc.
            </li>
            <li>
              Provide a chatbot-style interface where users can ask questions like:
              <ul>
                <li>Show me salinity profiles near the equator in March 2023</li>
                <li>Compare BGC parameters in the Arabian Sea for the last 6 months</li>
                <li>What are the nearest ARGO floats to this location?</li>
              </ul>
            </li>
          </ul>
          <p>
            This tool will bridge the gap between domain experts, decision-makers, and raw data by allowing non-technical users to extract meaningful insights effortlessly.
          </p>
        </Section>

        <Section title="High-Level Architecture">
          <ol>
            <li><strong>Ingestion Layer</strong>: Batch pipeline to convert NetCDF → Parquet/SQL; extract metadata (spatiotemporal, platform IDs, variables).</li>
            <li><strong>Metadata Index</strong>: Vector store (FAISS/Chroma) for semantic retrieval; hybrid store (BM25 + embeddings) for robustness.</li>
            <li><strong>RAG + Orchestration</strong>: MCP-enabled toolset: SQL generator, unit conversions, geospatial utilities, and schema-aware templates.</li>
            <li><strong>Query Engine</strong>: SQL over Parquet/SQL warehouse; pushdowns for aggregates; geospatial filters.</li>
            <li><strong>Visualization</strong>: Streamlit/Dash frontends for maps, section plots, time-depth diagrams; react charts in the web app.</li>
            <li><strong>Chat UX</strong>: LLM-driven planner + clarifying questions; citations to data sources for trust.</li>
          </ol>
        </Section>

        <Section title="Data Model & Schema Notes">
          <ul>
            <li>Profiles keyed by (platform_id, cycle_number, time, lat, lon) with depth-resolved arrays for T/S/BGC.</li>
            <li>Flatten depth profiles to long form for analytics while retaining raw arrays for fidelity.</li>
            <li>Metadata tables: platform metadata, QC flags, mission status, region tags.</li>
            <li>Partitioning by time/region for efficient queries.</li>
          </ul>
        </Section>

        <Section title="MCP Tools & Agents">
          <ul>
            <li>sql.run: execute generated SQL safely with schema guards</li>
            <li>geo.nearby: nearest floats by lat/lon, geohash or H3 index</li>
            <li>units.convert: T/S/BGC unit conversions</li>
            <li>viz.make: compose standard plots (TS diagrams, Hovmöller, sections)</li>
          </ul>
        </Section>

        <Section title="Example User Journeys">
          <p><strong>Exploratory:</strong> “Show me floats crossing the equator in Q1 2023 and compare salinity anomalies.”</p>
          <p><strong>Operational:</strong> “Which floats with BGC sensors reported in the Arabian Sea in the last 6 months?”</p>
          <p><strong>Research:</strong> “Plot depth-time for potential temperature near 10°N, 60°E with QC flags applied.”</p>
        </Section>

        <Section title="Future Work & Extensions">
          <ul>
            <li>Texture/globe-backed visual analytics of trajectories</li>
            <li>On-device caching and offline packs</li>
            <li>Fine-tuned ocean-domain LLMs with toolformer-style supervision</li>
          </ul>
        </Section>

        <div className="mt-12 mb-20 text-sm text-slate-400">
          <p>Looking to collaborate or pilot this for your organization? Reach out via the footer contacts.</p>
        </div>
      </div>
    </main>
  );
};

export default Learn;
