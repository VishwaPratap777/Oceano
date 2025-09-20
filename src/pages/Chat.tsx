import { useState } from "react";
import { ArrowLeft, Send, Plus, Trash2, Clock, MessageSquare, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TransitionLink from "../components/TransitionLink";

interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  isActive: boolean;
}

const Chat = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "assistant",
      content: "Welcome to Ocean AI! 🌊 I'm here to help you explore the depths of marine knowledge. What would you like to know about the ocean?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [chatHistories] = useState<ChatHistory[]>([
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
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      type: "user" as const,
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue("");

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "The ocean covers about 71% of Earth's surface and contains 97% of the planet's water! 🌊",
        "Coral reefs are often called the 'rainforests of the sea' due to their incredible biodiversity.",
        "The Mariana Trench is the deepest part of the ocean, reaching depths of over 36,000 feet!",
        "Ocean currents play a crucial role in regulating Earth's climate by distributing heat around the globe.",
        "Did you know that we've explored less than 5% of the world's oceans? There's still so much to discover!"
      ];
      
      const aiResponse = {
        id: messages.length + 2,
        type: "assistant" as const,
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <motion.div 
      className="flex h-screen relative bg-transparent"
      initial={{ 
        opacity: 0,
        scale: 0.9,
        y: 50,
        filter: "blur(20px)"
      }}
      animate={{ 
        opacity: 1,
        scale: 1,
        y: 0,
        filter: "blur(0px)"
      }}
      exit={{ 
        opacity: 0,
        scale: 1.1,
        y: -50,
        filter: "blur(20px)"
      }}
      transition={{ 
        duration: 1.2,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        stiffness: 100,
        damping: 20
      }}
      style={{ willChange: 'transform, opacity, filter' }}
    >
      {/* Subtle animated surface glow */}
      <motion.div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: 'radial-gradient(800px 320px at 50% 0%, rgba(56,189,248,0.18), rgba(56,189,248,0.08) 50%, transparent 70%)'
        }}
        initial={{ opacity: 0.12, backgroundPositionX: '0%' }}
        animate={{ opacity: 0.16, backgroundPositionX: ['0%', '100%', '0%'] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden
      />
      {/* Removed floating sidebar toggle to improve UX */}

      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside 
            className="w-80 bg-slate-900/95 backdrop-blur-sm border-r border-slate-700/50 flex flex-col"
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
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
                <p className="text-xs text-slate-400">Always available</p>
              </div>
            </div>
          </div>
          {/* Removed colorful dots */}
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
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
                    <p className="text-sm leading-relaxed">{message.content}</p>
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
        </div>

        {/* Input Area */}
        <div className="border-t border-slate-700/50 p-6 bg-gradient-to-t from-slate-900/50 to-transparent backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me about the ocean... 🌊"
              className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/40 transition-all backdrop-blur-sm"
            />
            <motion.button
              type="submit"
              className="ripple px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-cyan-500/25 flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Send className="w-4 h-4" />
              Send
            </motion.button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Chat;
