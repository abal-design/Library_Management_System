import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwinndcss from  '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwinndcss()],
})
