import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// numi Arcade build config. Deploys cleanly on Vercel as a static Vite app.
export default defineConfig({
  plugins: [react()],
  base: "./",
});
