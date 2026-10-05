import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// BASE is set by the GitHub Pages workflow ("/<repo>/"); locally and on Vercel it is "/".
export default defineConfig({
  base: process.env.BASE ?? '/',
  plugins: [react()],
})
