/**
 * FILE: Index.tsx
 * DESCRIPTION: The main entry point/home page of the React application.
 * CONTRIBUTION: 
 * 1. Serves as the landing page with a modern, high-premium design.
 * 2. Provides navigation links to the 'Upload Audio' and 'Record Live' features.
 * 3. Uses Framer Motion for smooth entry animations and interactive hover effects.
 */
import { motion } from "framer-motion";
import { Upload, Mic, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Subtle ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-white/[0.02] to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-3xl w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-20"
        >
          {/* Logo mark */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8 flex justify-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="currentColor" strokeWidth="1.5" fill="none" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="9" cy="10" r="1" fill="currentColor" />
                <circle cx="15" cy="10" r="1" fill="currentColor" />
              </svg>
            </div>
          </motion.div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight mb-4">
            <span className="text-white">Speech Emotion</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-normal max-w-md mx-auto leading-relaxed">
            Understand the emotions behind every voice with advanced AI analysis.
          </p>
        </motion.div>

        {/* Option Cards */}
        <div className="grid md:grid-cols-2 gap-4">
          <OptionCard
            title="Upload Audio"
            description="Analyze an existing recording"
            icon={<Upload className="w-6 h-6" />}
            onClick={() => navigate("/upload")}
            delay={0.2}
          />
          <OptionCard
            title="Record Live"
            description="Capture and analyze in real-time"
            icon={<Mic className="w-6 h-6" />}
            onClick={() => navigate("/live")}
            delay={0.3}
          />
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-muted-foreground/50 text-sm mt-16"
        >
          Powered by advanced neural networks
        </motion.p>
      </div>
    </div>
  );
};

interface OptionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  delay?: number;
}

const OptionCard = ({ title, description, icon, onClick, delay = 0 }: OptionCardProps) => {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
      onClick={onClick}
      className="group relative w-full text-left"
    >
      <div className="card-elevated p-8 hover-lift cursor-pointer">
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-white/80 group-hover:text-white group-hover:bg-white/10 transition-all duration-300">
          {icon}
        </div>

        {/* Content */}
        <div className="flex items-end justify-between">
          <div>
            <h3 className="text-xl font-semibold text-white mb-1">
              {title}
            </h3>
            <p className="text-muted-foreground text-sm">
              {description}
            </p>
          </div>

          {/* Arrow */}
          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
            <ArrowRight className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </motion.button>
  );
};

export default Index;
