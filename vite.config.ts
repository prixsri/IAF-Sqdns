import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    port: 5173,
    host: true
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/recharts/') || id.includes('/node_modules/d3-')) {
            return 'charts';
          }

          if (/\/node_modules\/(react|react-dom|scheduler)\//.test(id)) {
            return 'react-vendor';
          }
        }
      }
    }
  }
});
