import { defineConfig } from 'vite';


export default defineConfig({
  resolve: {
    alias: {
      '@': '/src' // Указать путь к директории, где находятся ваши ресурсы
    }
  },
  build: {
    chunkSizeWarningLimit: 1000, // Установите желаемый лимит в килобайтах
  },
});