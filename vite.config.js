import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['chart.js', 'quill'], // Excluindo essas dependências da otimização
  },
});

