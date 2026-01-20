
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Usar rutas relativas permite que la app funcione en cualquier subdirectorio
  // o repositorio de GitHub Pages sin necesitar el nombre exacto del repo.
  base: './', 
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
});
