import { motion } from "framer-motion";

interface WaveAnimationProps {
  isAnimating?: boolean;
  color?: "primary" | "secondary" | "recording";
}

const WaveAnimation = ({ isAnimating = true, color = "primary" }: WaveAnimationProps) => {
  const bars = 12;
  
  const colorClasses = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    recording: "bg-recording",
  };

  return (
    <div className="flex items-center justify-center gap-1 h-16">
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          className={`w-1 rounded-full ${colorClasses[color]}`}
          animate={
            isAnimating
              ? {
                  height: [16, 40, 24, 48, 16],
                }
              : { height: 16 }
          }
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default WaveAnimation;
