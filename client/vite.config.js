import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    // Output to root dist/ so Express can serve it on Render
    outDir: '../dist',
    emptyDirOnBuild: true,
    // Inline assets smaller than 4KB
    assetsInlineLimit: 4096,
    // Warn on large chunks
    chunkSizeWarningLimit: 300,
  },
})
