import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    open: true,
    allowedHosts: [".loca.lt", ".trycloudflare.com", ".ngrok-free.app"],
  },
});
