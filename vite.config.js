import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  // GitHub Pages 배포를 위한 base 경로 설정
  base: process.env.VITE_BASE_PATH || "/",
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
    exclude: ["**/e2e/**", "**/*.e2e.spec.js", "**/node_modules/**"],
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
