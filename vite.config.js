import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {

  const env = loadEnv(mode, process.cwd());
  
  const config = {
    plugins: [react()],
  };
  
  if (mode === 'development') {
    config.server = {
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
          secure: false
        }
      }
    };
  }
  
  // Add build options for production
  if (mode === 'production') {
    config.build = {
      outDir: 'dist',
      sourcemap: false
    };
  }
  
  return config;
})