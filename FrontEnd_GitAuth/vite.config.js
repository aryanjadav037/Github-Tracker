import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,  // Enables global test functions like describe, test
    environment: "jsdom", // Simulates a browser environment for React
},
});