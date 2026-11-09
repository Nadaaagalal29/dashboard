import { defineConfig } from "vite";
export default defineConfig({
  esbuild: { jsx: "automatic" },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          charts: ["recharts"],
          react: ["react", "react-dom", "react-router-dom"],
          drag: ["@dnd-kit/core"],
        },
      },
    },
  },
});
