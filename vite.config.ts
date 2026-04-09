import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
      '@/features': '/src/features',
      '@/shared': '/src/shared',
      '@/app': '/src/app',
      '@/hooks': '/src/hooks',
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5174,
    strictPort: true,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@chakra-ui/react', '@emotion/react', '@emotion/styled'],
        },
      },
    },
  },
});
