import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, Github, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

const GlassCard: React.FC<{ children: React.ReactNode }>= ({ children }) => (
  <div className="relative w-full max-w-md mx-auto rounded-2xl border border-slate-700/40 bg-slate-900/40 backdrop-blur-xl shadow-xl overflow-hidden">
    {/* glow edges */}
    <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-transparent" />
    <div className="relative p-6 sm:p-8">{children}</div>
  </div>
);

const TabButton = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    onClick={onClick}
    className={`ripple px-4 py-2 rounded-xl text-sm font-medium transition-colors border ${
      active ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400/30' : 'bg-slate-800/40 text-slate-300 border-slate-700/40 hover:bg-slate-800/60'
    }`}
  >
    {children}
  </button>
);

const Input = ({ icon, type = 'text', placeholder }: { icon: React.ReactNode; type?: string; placeholder: string }) => (
  <div className="flex items-center gap-2 rounded-xl bg-slate-800/50 border border-slate-700/40 px-3 py-2 text-slate-200 focus-within:border-cyan-400/40">
    <div className="text-slate-400">{icon}</div>
    <input
      type={type}
      placeholder={placeholder}
      className="w-full bg-transparent outline-none placeholder-slate-500 text-sm"
    />
  </div>
);

const SocialButton = ({ provider, onClick }: { provider: 'google'|'facebook'|'twitter'; onClick?: () => void }) => {
  const map = {
    google: { label: 'Sign in with Google', color: 'from-rose-400/30 to-orange-400/30', icon: <span className="text-xl">🟢</span> },
    facebook: { label: 'Sign in with Facebook', color: 'from-blue-500/30 to-indigo-500/30', icon: <span className="text-xl">🟦</span> },
    twitter: { label: 'Sign in with Twitter', color: 'from-cyan-400/30 to-blue-400/30', icon: <Twitter className="w-4 h-4" /> },
  } as const;
  const cfg = map[provider];
  return (
    <button onClick={onClick} className={`ripple w-full text-sm rounded-xl border border-slate-700/40 bg-gradient-to-r ${cfg.color} px-4 py-2 text-slate-200 flex items-center justify-center gap-2 hover:border-cyan-400/30 transition`}>{cfg.icon}{cfg.label}</button>
  );
};

const AuthModal = ({ open, onClose }: AuthModalProps) => {
  const [tab, setTab] = useState<'login'|'register'>('login');

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* dark backdrop */}
          <motion.div
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* modal card */}
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-100">{tab === 'login' ? 'Welcome back' : 'Create an account'}</h3>
              <button onClick={onClose} className="ripple p-2 rounded-lg hover:bg-slate-800/40 text-slate-300"><X className="w-4 h-4" /></button>
            </div>

            <div className="flex items-center gap-2 mb-6">
              <TabButton active={tab==='login'} onClick={() => setTab('login')}>Login</TabButton>
              <TabButton active={tab==='register'} onClick={() => setTab('register')}>Register</TabButton>
            </div>

            <div className="space-y-3">
              {tab === 'register' && (
                <Input icon={<User className="w-4 h-4" />} placeholder="Full name" />
              )}
              <Input icon={<Mail className="w-4 h-4" />} type="email" placeholder="Email" />
              <Input icon={<Lock className="w-4 h-4" />} type="password" placeholder="Password" />
              {tab === 'register' && (
                <Input icon={<Lock className="w-4 h-4" />} type="password" placeholder="Confirm password" />
              )}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button variant="ocean" className="flex-1 ripple">{tab==='login' ? 'Login' : 'Register'}</Button>
              <Button variant="outline" className="flex-1 ripple" onClick={onClose}>Cancel</Button>
            </div>

            <div className="my-5 h-px bg-gradient-to-r from-transparent via-slate-600/40 to-transparent" />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <SocialButton provider="google" />
              <SocialButton provider="facebook" />
              <SocialButton provider="twitter" />
            </div>
            <p className="text-[11px] text-slate-500 mt-4">Social logins are placeholders. Hook up your auth provider to enable them.</p>
          </GlassCard>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
