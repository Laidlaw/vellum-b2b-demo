import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // Use GitHub Pages base path only for production builds
  const base = command === 'build' && mode === 'production' 
    ? '/vellum-b2b-demo/' 
    : '/'

  return {
    plugins: [react()],
    base,
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
    },
    // Ensure MSW service worker is correctly handled
    publicDir: 'public',
  }
})
