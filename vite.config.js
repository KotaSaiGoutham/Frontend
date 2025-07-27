import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['exceljs'],
  },
  build: {
        outDir: 'dist',  // This is the default, make sure 'dist' is the output folder

    commonjsOptions: {
      include: [/exceljs/, /node_modules/],
    },
  },
})
