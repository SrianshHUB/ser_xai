/**
 * FILE: EmotionResult.tsx
 * DESCRIPTION: A reusable UI component that displays the outcome of the emotion analysis.
 * CONTRIBUTION: 
 * 1. Maps predicted emotion categories (e.g., 'happy', 'sad') to specific colors, labels, and emojis.
 * 2. Presents the XAI (SHAP) explanation in a readable manner to help the user understand the AI's reasoning.
 * 3. Provides navigation options to return home or retry the analysis.
 */
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Zap,
  Activity,
  Timer,
  Music,
  Wind,
  Waves,
  Volume2,
  Info,
  RefreshCw,
  Flame,
  Droplet,
  AudioWaveform,
  Mic2,
  ArrowLeft,
  RotateCcw
} from "lucide-react";

interface EmotionResultProps {
  emotion: string;
  explanation: string;
  traits?: {
    energy: number;
    pitch: number;
    tempo: number;
    sharpness: number;
    brightness: number;
    pureness: number;
    depth: number;
  };
  onReset?: () => void;
}

const emotionConfig: Record<string, { emoji: string; label: string; color: string }> = {
  happy: { emoji: "😊", label: "Happy", color: "from-amber-400 to-orange-500" },
  sad: { emoji: "😢", label: "Sad", color: "from-blue-400 to-indigo-500" },
  angry: { emoji: "😠", label: "Angry", color: "from-red-400 to-rose-500" },
  fear: { emoji: "😨", label: "Fear", color: "from-purple-400 to-violet-500" },
  surprise: { emoji: "😲", label: "Surprise", color: "from-cyan-400 to-teal-500" },
  disgust: { emoji: "🤢", label: "Disgust", color: "from-green-400 to-emerald-500" },
  neutral: { emoji: "😐", label: "Neutral", color: "from-gray-400 to-slate-500" },
};

const EmotionResult = ({ emotion, explanation, traits, onReset }: EmotionResultProps) => {
  const navigate = useNavigate();
  const config = emotionConfig[emotion.toLowerCase()] || emotionConfig.neutral;

  return (
    <div className="min-h-screen flex flex-col p-6 md:p-12">
      {/* Back button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="text-muted-foreground hover:text-white -ml-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Home
        </Button>
      </motion.div>

      <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full text-center"
        >
          {/* Emotion emoji */}
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
            className="text-8xl md:text-9xl mb-8"
          >
            {config.emoji}
          </motion.div>

          {/* Result card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="card-elevated p-8 md:p-10"
          >
            {/* Label */}
            <div className="mb-2">
              <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Detected Emotion
              </span>
            </div>

            {/* Emotion name */}
            <h2 className={`text-4xl md:text-5xl font-semibold mb-6 bg-gradient-to-r ${config.color} bg-clip-text text-transparent`}>
              {config.label}
            </h2>

            {/* Divider */}
            <div className="w-12 h-px bg-white/10 mx-auto mb-6" />

            {/* Explanation */}
            <p className="text-muted-foreground leading-relaxed text-base mb-8">
              {explanation}
            </p>

            {/* Acoustic Traits */}
            {traits && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-white/10 pt-8 mt-4 text-left">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">Energy</span>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, traits.energy * 1000)}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-amber-400"
                    />
                  </div>
                  <span className="text-xs font-mono text-white/50">{traits.energy.toFixed(3)}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">Pitch</span>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, traits.pitch / 40)}%` }}
                      transition={{ duration: 1, delay: 0.6 }}
                      className="h-full bg-blue-400"
                    />
                  </div>
                  <span className="text-xs font-mono text-white/50">{Math.round(traits.pitch)} Hz</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">Tempo</span>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (traits.tempo - 60) / 1.2)}%` }}
                      transition={{ duration: 1, delay: 0.7 }}
                      className="h-full bg-green-400"
                    />
                  </div>
                  <span className="text-xs font-mono text-white/50">{Math.round(traits.tempo)} BPM</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">Pureness</span>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, traits.pureness * 2000)}%` }}
                      transition={{ duration: 1, delay: 0.8 }}
                      className="h-full bg-rose-400"
                    />
                  </div>
                  <span className="text-xs font-mono text-white/50">Tonal</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">Sharpness</span>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, traits.sharpness * 400)}%` }}
                      transition={{ duration: 1, delay: 0.9 }}
                      className="h-full bg-purple-400"
                    />
                  </div>
                  <span className="text-xs font-mono text-white/50">{traits.sharpness.toFixed(3)}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">Brightness</span>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, traits.brightness / 40)}%` }}
                      transition={{ duration: 1, delay: 1.0 }}
                      className="h-full bg-cyan-400"
                    />
                  </div>
                  <span className="text-xs font-mono text-white/50">{Math.round(traits.brightness)}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">Sound Depth</span>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, traits.depth / 80)}%` }}
                      transition={{ duration: 1, delay: 1.1 }}
                      className="h-full bg-indigo-400"
                    />
                  </div>
                  <span className="text-xs font-mono text-white/50">{Math.round(traits.depth)} Hz</span>
                </div>
              </div>
            )}
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex gap-3 justify-center mt-8"
          >
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/")}
              className="h-12"
            >
              <ArrowLeft className="w-4 h-4" />
              Home
            </Button>
            {onReset && (
              <Button
                variant="default"
                size="lg"
                onClick={onReset}
                className="h-12"
              >
                <RotateCcw className="w-4 h-4" />
                Try Again
              </Button>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default EmotionResult;
