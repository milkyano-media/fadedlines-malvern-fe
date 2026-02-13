import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { VitePluginRadar, } from 'vite-plugin-radar'

export default defineConfig({
  plugins: [react(),
  VitePluginRadar({
    enableDev: true,
    gtm: [
      {
        id: 'GTM-W94TJ64',
      }
    ],
  }),
  ],
  build: {
    chunkSizeWarningLimit: 1600
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
