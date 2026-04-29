import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Deployed at https://bhavsarp25.github.io/greensummerco/, so all built
// assets must be served from that subpath. Override with VITE_BASE for
// other hosts (e.g. Vercel/Netlify root deploys: VITE_BASE=/).
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/workspace/src',
    },
  },
  base: process.env.VITE_BASE ?? '/greensummerco/',
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    // Allow access from any host so cloud / tunneled previews work
    // (e.g. *.trycloudflare.com, *.cursor.sh, *.ngrok-free.app, etc.).
    allowedHosts: true,
    hmr: {
      // When tunneling, Vite needs to know the public URL the browser is
      // hitting so the HMR websocket connects back to the tunnel instead
      // of localhost. Set VITE_HMR_HOST=<public-host> when starting dev
      // behind a proxy/tunnel; otherwise HMR uses the request host.
      ...(process.env.VITE_HMR_HOST
        ? {
            host: process.env.VITE_HMR_HOST,
            protocol: 'wss',
            clientPort: 443,
          }
        : {}),
    },
  },
});
