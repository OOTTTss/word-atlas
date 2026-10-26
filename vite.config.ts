import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: process.env.ATLAS_BASE || "/",
  publicDir: ".local/child-public",
  plugins: [react()],
  server: { port: 5188, strictPort: true },
  preview: { port: 5188, strictPort: true },
  build: { chunkSizeWarningLimit: 600 },
});
