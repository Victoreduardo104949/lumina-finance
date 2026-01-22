
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
// Fix: Import process from node:process to ensure TypeScript recognizes Node.js global properties like cwd()
import process from 'node:process';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY || ''),
      'process.env.NODE_ENV': JSON.stringify(mode)
    },
    server: {
      host: true,
      port: 3000,
      strictPort: true
    },
    build: {
      target: 'esnext'
    }
  };
});
