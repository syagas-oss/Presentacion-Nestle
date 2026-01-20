
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const isProd = command === 'build';
  
  return {
    plugins: [react()],
    // En desarrollo (npm run dev) usa la raíz '/'.
    // En producción (npm run build) usa el nombre del repo para GitHub Pages.
    base: isProd ? '/nestle-biolife/' : '/', 
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false
    }
  };
});
