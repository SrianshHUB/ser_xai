/**
 * FILE: vite.config.ts
 * DESCRIPTION: Configuration file for the Vite build tool.
 * CONTRIBUTION: 
 * 1. Configures the React SWC plugin for fast compilation and Hot Module Replacement (HMR).
 * 2. Defines path aliases (e.g., '@' as 'src') to allow for cleaner imports throughout the project.
 * 3. Sets up the development server settings like port and host.
 * 4. Generates the optimized 'dist' folder that the Flask backend serves.
 */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
