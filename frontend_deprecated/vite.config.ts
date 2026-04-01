/**
 * FILE: vite.config.ts
 * DESCRIPTION: Configuration file for the Vite build tool.
 * CONTRIBUTION: 
 * 1. Configures the standard React plugin for fast compilation and Hot Module Replacement (HMR).
 * 2. Defines path aliases (e.g., '@' as 'src') to allow for cleaner imports throughout the project.
 * 3. Sets up the development server settings like port and host.
 * 4. Generates the optimized 'dist' folder that the Flask backend serves.
 */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    minify: false,
  }
}));
