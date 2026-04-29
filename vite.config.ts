import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Deployed at https://bhavsarp25.github.io/greensummerco/, so all built
// assets must be served from that subpath. Override with VITE_BASE for
// other hosts (e.g. Vercel/Netlify root deploys: VITE_BASE=/).
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE ?? '/greensummerco/',
});
