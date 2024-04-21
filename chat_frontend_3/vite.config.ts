import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import "vitest/config";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/setupTests.ts"], // This is optional for global test setups
  },
});
