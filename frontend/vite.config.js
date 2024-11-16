
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy API requests to the backend server in development
      '/api': {
        target: 'http://localhost:3000', // Backend server URL
        changeOrigin: true,
        secure: false,
        // Optionally, rewrite the path if your backend doesn't use the /api prefix
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    outDir: 'dist', // Default output directory
    // Additional build configurations can go here
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Optional: alias for easier imports
    },
  },
});
