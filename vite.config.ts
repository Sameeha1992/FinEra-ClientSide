import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths"; // Add this

export default defineConfig({
  plugins: [react(), tsconfigPaths()], // Add tsconfigPaths plugin
});
