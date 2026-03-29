import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: false,
  },
  preview: {
    port: 4173,
  },
  define: {
    // Ensure no dev-only WebSocket URLs leak into production
    ...(mode === 'production' ? { 'import.meta.hot': 'undefined' } : {}),
  },
  build: {
    target: 'es2020',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/') || id.includes('node_modules/react-router')) {
            return 'vendor';
          }
          if (id.includes('node_modules/@mui')) {
            return 'mui';
          }
        },
      },
    },
  },
}));
