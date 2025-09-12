import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // Dynamic base path configuration
  let base = '/'
  
  if (command === 'build') {
    if (mode === 'production') {
      // GitHub Pages deployment
      base = '/vellum-b2b-demo/'
    } else if (mode === 'netlify') {
      // Netlify deployment uses root path
      base = '/'
    }
  }

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
