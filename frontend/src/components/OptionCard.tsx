import { motion } from "framer-motion";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface OptionCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  path: string;
  gradient: "primary" | "secondary";
  delay?: number;
}

const OptionCard = ({ title, description, icon, path, gradient, delay = 0 }: OptionCardProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(path)}
      className={`glass-card p-8 cursor-pointer group relative overflow-hidden ${
        gradient === "primary" ? "hover:glow-primary" : "hover:glow-secondary"
      }`}
    >
      {/* Gradient overlay on hover */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${
          gradient === "primary"
            ? "bg-gradient-to-br from-primary to-cyan-400"
            : "bg-gradient-to-br from-secondary to-purple-400"
        }`}
      />

      {/* Icon */}
      <motion.div
        className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 ${
          gradient === "primary"
            ? "bg-primary/10 text-primary"
            : "bg-secondary/10 text-secondary"
        }`}
        whileHover={{ rotate: [0, -5, 5, 0] }}
        transition={{ duration: 0.5 }}
      >
        {icon}
      </motion.div>

      {/* Content */}
      <h3
        className={`font-display text-2xl font-bold mb-3 ${
          gradient === "primary" ? "gradient-text" : "gradient-text-secondary"
        }`}
      >
        {title}
      </h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>

      {/* Arrow indicator */}
      <motion.div
        className={`absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity ${
          gradient === "primary" ? "text-primary" : "text-secondary"
        }`}
        initial={{ x: -10 }}
        whileHover={{ x: 0 }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </motion.div>
    </motion.div>
  );
};

export default OptionCard;
