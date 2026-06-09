import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      react: path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom'),
    }
  },
  server: {
    proxy: {
      '/products': 'http://localhost:5000',
      '/uploads': 'http://localhost:5000',
      '/auth': 'http://localhost:5000',
      '/users': { target: 'http://localhost:5000', changeOrigin: true },
      '/cart': 'http://localhost:5000',
      '/socket.io': { target: 'http://localhost:5000', ws: true },
    }
  }
})
