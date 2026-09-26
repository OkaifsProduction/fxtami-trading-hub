import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

const FUNCTIONS_PORT = 9999;

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    // `npm run dev:functions` serves the Netlify Functions on their own port;
    // forwarding them here means the forms and checkout work against the real
    // backend while developing, without the production Content-Security-Policy
    // (which blocks Vite's dev-only inline script) getting in the way.
    proxy: {
      "/.netlify/functions": {
        target: `http://localhost:${FUNCTIONS_PORT}`,
        changeOrigin: true,
      },
    },
  },
});
