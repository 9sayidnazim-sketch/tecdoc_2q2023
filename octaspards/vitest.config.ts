import { defineConfig } from "vitest/config";
import path from "node:path";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    include: ["tests/**/*.test.ts"],
    testTimeout: 15000,
    env: {
      DATABASE_URL:
        process.env.DATABASE_URL ||
        "postgresql://octaspards:octaspards@localhost:5433/octaspards?schema=public",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
