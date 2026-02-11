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
import { ArrowLeft, RotateCcw } from "lucide-react";

interface EmotionResultProps {
  emotion: string;
  explanation: string;
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

const EmotionResult = ({ emotion, explanation, onReset }: EmotionResultProps) => {
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

      <div className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto w-full">
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
            <p className="text-muted-foreground leading-relaxed text-base">
              {explanation}
            </p>
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
