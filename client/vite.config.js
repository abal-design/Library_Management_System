import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwinndcss from  '@tailwindcss/vite'

// https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(),tailwinndcss()],
// })


export default defineConfig({
  plugins: [react(),tailwinndcss()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",  // your backend server
        changeOrigin: true,
        secure: false,
      },
    },
  },
});