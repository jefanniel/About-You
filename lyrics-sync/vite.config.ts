import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,      // Biar bisa diakses dari HP lewat IP WiFi
    port: 5173,      // Optional: tentukan port manual
  },
});
