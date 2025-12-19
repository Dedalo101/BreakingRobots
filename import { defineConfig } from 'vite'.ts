import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/', // ensure assets load from site root (breakingrobots.com)
  plugins: [react()],
})
