import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import TransitionLink from "@/components/TransitionLink";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Mock delay to simulate auth
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    // TODO: Integrate with real auth
    alert(`Signed in as ${email || "demo"}`);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-slate-900/60 border border-slate-800/60 rounded-2xl p-6 md:p-8 shadow-xl backdrop-blur-md"
      >
        <div className="mb-6 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-100">Welcome back</h1>
          <p className="text-slate-400 text-sm mt-1">Sign in to continue your ocean journey</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full rounded-lg bg-slate-800/70 border border-slate-700 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 outline-none px-4 py-2.5 text-slate-100 placeholder:text-slate-500 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full rounded-lg bg-slate-800/70 border border-slate-700 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 outline-none px-4 py-2.5 text-slate-100 placeholder:text-slate-500 transition"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <TransitionLink to="/" variant="fade">
              <span className="text-xs text-slate-400 hover:text-slate-200">Back to home</span>
            </TransitionLink>
            <Button type="submit" variant="ocean" className="min-w-[120px]" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          By continuing, you agree to our terms and privacy policy.
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
