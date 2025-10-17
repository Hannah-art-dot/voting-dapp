import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      // ensure Vite uses the CommonJS PostCSS config when package.json sets "type": "module"
      config: './postcss.config.cjs'
    }
  },
})
