import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base: "./" produces relative asset paths, which work on a GitHub Pages
// project site (https://USER.github.io/REPO/) without knowing the repo name.
// If you prefer absolute paths, set base: "/your-repo-name/".
export default defineConfig({
  plugins: [react()],
  base: "./",
});
