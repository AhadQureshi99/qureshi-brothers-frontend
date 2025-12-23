import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: (() => {
      // allow configuration of the dev proxy via environment variable BACKEND_PROXY
      // default to localhost:3001 for local development so /api routes forward to the local backend
      const target = process.env.BACKEND_PROXY || "http://localhost:3001";
      return {
        // Proxy /api requests to backend
        "/api": {
          target,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, "/api"),
        },
      };
    })(),
  },
});
