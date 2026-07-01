import { useState, useRef, useEffect, useMemo, memo } from "react";
import { ArrowLeft, Send, Plus, Trash2, Clock, MessageSquare, Menu, X, Loader2, MapPin, Compass } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TransitionLink from "../components/TransitionLink";
import { sendChatMessage } from "../services/chatApi";

interface ChatMessage {
  id: number;
  type: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  isActive: boolean;
}

const Chat = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      type: "assistant",
      content: "Welcome to Ocean AI! 🌊 I'm here to help you explore the depths of marine knowledge. Ask me about ocean temperatures, waves, currents, marine life, or anything ocean-related!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Context Location State
  const [location, setLocation] = useState<{ name: string; lat: number; lng: number } | null>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationQuery, setLocationQuery] = useState("");
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodeError, setGeocodeError] = useState<string | null>(null);

  const handleGeocode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationQuery.trim()) return;
    setIsGeocoding(true);
    setGeocodeError(null);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          locationQuery.trim()
        )}&format=json&limit=1`,
        {
          headers: {
            "User-Agent": "OceanData-App"
          }
        }
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const item = data[0];
        const displayName = item.display_name.split(',')[0];
        setLocation({
          name: displayName,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon)
        });
        setLocationQuery("");
        setShowLocationModal(false);
      } else {
        setGeocodeError("Location not found. Try a different query.");
      }
    } catch (err) {
      setGeocodeError("Failed to fetch coordinates. Please try again.");
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setGeocodeError("Geolocation is not supported by your browser.");
      return;
    }
    setIsGeocoding(true);
    setGeocodeError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          name: "Current Location",
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setShowLocationModal(false);
        setIsGeocoding(false);
      },
      (error) => {
        setGeocodeError("Permission denied or location lookup failed.");
        setIsGeocoding(false);
      }
    );
  };

  const handleResetLocation = () => {
    setLocation(null);
    setShowLocationModal(false);
  };

  const chatHistories = useMemo<ChatHistory[]>(() => [
    {
      id: "1",
      title: "Ocean Currents Discussion",
      lastMessage: "Tell me about the Gulf Stream...",
      timestamp: "2 min ago",
      isActive: true
    },
    {
      id: "2",
      title: "Marine Biology Q&A",
      lastMessage: "What are coral reefs made of?",
      timestamp: "1 hour ago",
      isActive: false
    },
    {
      id: "3",
      title: "Deep Sea Exploration",
      lastMessage: "How deep is the Mariana Trench?",
      timestamp: "3 hours ago",
      isActive: false
    },
    {
      id: "4",
      title: "Climate Change Impact",
      lastMessage: "How does ocean warming affect...",
      timestamp: "Yesterday",
      isActive: false
    },
    {
      id: "5",
      title: "Marine Conservation",
      lastMessage: "What can we do to protect...",
      timestamp: "2 days ago",
      isActive: false
    }
  ], []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      type: "user",
      content: inputValue.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setError(null);

    try {
      // Build history for context (exclude the welcome message)
      const history = messages
        .filter(m => m.id !== 1)
        .map(m => ({
          role: m.type === "user" ? "user" as const : "assistant" as const,
          content: m.content
        }));

      const response = await sendChatMessage(
        userMessage.content,
        history,
        location?.lat,
        location?.lng
      );

      const aiMessage: ChatMessage = {
        id: Date.now() + 1,
        type: "assistant",
        content: response.reply.replace(/\*/g, ""),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to get response";
      setError(errorMsg);

      // Add error message to chat
      const errorMessage: ChatMessage = {
        id: Date.now() + 1,
        type: "assistant",
        content: `⚠️ Sorry, I encountered an error: ${errorMsg}. Please try again.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      className="flex h-screen relative bg-transparent overflow-hidden"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ 
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1.0]
      }}
      style={{ willChange: 'transform, opacity' }}
    >
      {/* Subtle animated surface glow */}
      <div 
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: 'radial-gradient(800px 320px at 50% 0%, rgba(56,189,248,0.18), rgba(56,189,248,0.08) 50%, transparent 70%)',
          willChange: 'opacity, background-position',
          opacity: 0.14,
          animation: 'gradientShift 24s ease-in-out infinite',
        }}
        aria-hidden
      />
      <style>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 0%; }
          50% { background-position: 100% 0%; }
        }
        @keyframes typingPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `}</style>

      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside 
            className="w-80 bg-slate-900/95 backdrop-blur-sm border-r border-slate-700/50 flex flex-col fixed inset-y-0 left-0 z-20"
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ 
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            style={{ willChange: 'transform, opacity' }}
          >
        {/* Header */}
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-200 flex items-center gap-2 flex-1 pr-4">
              <MessageSquare className="w-5 h-5 text-cyan-400" />
              Chat History
            </h2>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 transition-all duration-200 hover:scale-105">
                <Plus className="w-4 h-4" />
              </button>
              <button 
                className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-slate-400 hover:text-slate-200 transition-all duration-200 hover:scale-105"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="text-sm text-slate-400">
            {chatHistories.length} conversations
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {chatHistories.map((chat) => (
            <motion.div
              key={chat.id}
              className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-200 hover:bg-slate-800/50 ${
                chat.isActive 
                  ? 'bg-cyan-600/20 border border-cyan-500/30' 
                  : 'hover:border-slate-600/50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-medium text-slate-200 truncate pr-2">
                  {chat.title}
                </h3>
                <button className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 text-red-400 transition-all duration-200">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
              <p className="text-xs text-slate-400 mb-2 line-clamp-2">
                {chat.lastMessage}
              </p>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Clock className="w-3 h-3" />
                {chat.timestamp}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700/50">
          <div className="text-xs text-slate-500 text-center">
            Ocean AI v1.0
          </div>
        </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <motion.div 
        className="flex-1 flex flex-col"
        animate={{ marginLeft: isSidebarOpen ? 0 : 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-slate-900/80 to-slate-800/70 border-b border-slate-700/50 backdrop-blur-sm px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TransitionLink to="/" noOverlay>
              <button className="ripple p-2 rounded-lg bg-slate-700/30 hover:bg-slate-600/40 text-slate-300 transition-all duration-200 hover:scale-105">
                <ArrowLeft className="w-4 h-4" />
              </button>
            </TransitionLink>
            {/* Header menu toggle to open sidebar when closed */}
            {!isSidebarOpen && (
              <button
                className="ripple p-2 rounded-lg bg-slate-600/20 hover:bg-slate-600/30 text-slate-400 transition-all duration-200 hover:scale-105"
                onClick={() => setIsSidebarOpen(true)}
                aria-label="Open chat history"
              >
                <Menu className="w-4 h-4" />
              </button>
            )}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-slate-900 font-bold text-sm">
                🌊
              </div>
              <div>
                <h1 className="text-lg font-semibold text-slate-200">Ocean AI</h1>
                <p className="text-xs text-slate-400">
                  {isLoading ? "Thinking..." : "Always available"}
                </p>
              </div>
            </div>
          </div>

          {/* Context Location Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLocationModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-850 border border-slate-700/60 hover:bg-slate-800 hover:border-cyan-500/30 text-slate-300 hover:text-white transition-all text-xs font-medium shadow-md shadow-slate-950/20"
            >
              <MapPin className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span className="max-w-[120px] md:max-w-[200px] truncate">
                {location ? location.name : "Mumbai Coast (Default)"}
              </span>
              {location && (
                <span className="text-[10px] text-slate-500 font-normal hidden sm:inline">
                  ({location.lat.toFixed(2)}°, {location.lng.toFixed(2)}°)
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index === messages.length - 1 ? 0.1 : 0 }}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 backdrop-blur-sm ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-900/20'
                    : 'bg-slate-800/50 text-slate-200 border border-slate-600/30 shadow-md shadow-slate-900/10'
                }`}
              >
                <div className="flex items-start gap-3">
                  {message.type === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-slate-900 font-bold text-sm flex-shrink-0">
                      🌊
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs opacity-70 mt-2">
                      {message.timestamp}
                    </p>
                  </div>
                  {message.type === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-slate-300 font-bold text-sm flex-shrink-0">
                      👤
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Typing indicator */}
          {isLoading && (
            <motion.div
              className="flex justify-start"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-slate-800/50 text-slate-200 border border-slate-600/30 rounded-2xl px-4 py-3 backdrop-blur-sm shadow-md shadow-slate-900/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-slate-900 font-bold text-sm flex-shrink-0">
                    🌊
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-cyan-400" style={{ animation: 'typingPulse 1.4s ease-in-out infinite' }} />
                    <div className="w-2 h-2 rounded-full bg-cyan-400" style={{ animation: 'typingPulse 1.4s ease-in-out 0.2s infinite' }} />
                    <div className="w-2 h-2 rounded-full bg-cyan-400" style={{ animation: 'typingPulse 1.4s ease-in-out 0.4s infinite' }} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Error banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="px-6 py-2 bg-red-500/10 border-t border-red-500/20 text-red-300 text-sm flex items-center justify-between"
            >
              <span>⚠️ {error}</span>
              <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300 text-xs ml-4">
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Area */}
        <div className="border-t border-slate-700/50 p-6 bg-gradient-to-t from-slate-900/50 to-transparent backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me about the ocean... 🌊"
              disabled={isLoading}
              className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/40 transition-all backdrop-blur-sm disabled:opacity-50"
            />
            <motion.button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="ripple px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-cyan-500/25 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: isLoading ? 1 : 1.05 }}
              whileTap={{ scale: isLoading ? 1 : 0.95 }}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {isLoading ? "..." : "Send"}
            </motion.button>
          </form>
        </div>
      </motion.div>

      {/* Location Search Modal */}
      <AnimatePresence>
        {showLocationModal && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Dark backdrop */}
            <motion.div
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLocationModal(false)}
            />

            {/* Glassmorphic card */}
            <motion.div
              className="relative w-full max-w-md mx-auto rounded-2xl border border-slate-700/40 bg-slate-900/95 backdrop-blur-xl shadow-xl overflow-hidden z-10"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", duration: 0.4 }}
            >
              {/* Glow edge */}
              <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-transparent" />
              
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-cyan-400" />
                    Set Ocean Context Location
                  </h3>
                  <button
                    onClick={() => setShowLocationModal(false)}
                    className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                  Provide a city, coastline, or region. We geocode it to coordinates to fetch live StormGlass metrics for Ocean AI.
                </p>

                <form onSubmit={handleGeocode} className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={locationQuery}
                      onChange={(e) => setLocationQuery(e.target.value)}
                      placeholder="e.g. Goa, Goa Coast, Chennai, Miami"
                      className="flex-1 rounded-xl bg-slate-800/50 border border-slate-700/50 focus:border-cyan-500/40 focus:ring-2 focus:ring-cyan-500/20 outline-none px-4 py-2.5 text-slate-200 placeholder:text-slate-500 text-sm transition"
                    />
                    <button
                      type="submit"
                      disabled={isGeocoding || !locationQuery.trim()}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[80px]"
                    >
                      {isGeocoding ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Search"
                      )}
                    </button>
                  </div>

                  {geocodeError && (
                    <p className="text-xs text-red-400 font-medium">⚠️ {geocodeError}</p>
                  )}

                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <button
                      type="button"
                      onClick={handleDetectLocation}
                      disabled={isGeocoding}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700/60 text-slate-200 text-sm font-medium transition"
                    >
                      <Compass className="w-4 h-4 text-cyan-400" />
                      Detect Location
                    </button>
                    {location && (
                      <button
                        type="button"
                        onClick={handleResetLocation}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700/60 text-slate-200 text-sm font-medium transition"
                      >
                        Reset to Default
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Chat;
