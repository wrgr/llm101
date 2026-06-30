import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  base: "/llm101/brain101/",
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
