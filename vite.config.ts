import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig(({ command }) => ({
  plugins: [tsconfigPaths(), react(), tailwindcss()],
  base: command === "build" ? "/kuto-nanidasu/" : "/",
  resolve: {
    alias: { "@": "/src" },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setupTest.ts",
  },
}));
