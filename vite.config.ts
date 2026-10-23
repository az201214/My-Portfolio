import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/My-Portfolio/",
  plugins: [react()],
  resolve: { alias: [{ find: /^three$/, replacement: "three/src/Three.js" }] },
  build: {
    rolldownOptions: {
      output: {
        strictExecutionOrder: true,
        codeSplitting: {
          groups: [
            {
              name: "three-vendor",
              test: /node_modules\/(three|three-stdlib|fflate)\//,
              maxSize: 250_000,
              includeDependenciesRecursively: false,
            },
          ],
        },
      },
    },
  },
});
