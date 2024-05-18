import { defineConfig } from "vite";
import path from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "#api": path.resolve(__dirname, "./src/api/"),
    },
  },
});
