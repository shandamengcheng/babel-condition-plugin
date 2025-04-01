import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react({
    babel: {
      plugins: [
        [path.resolve(__dirname, './plugin/js-condition/index.js')]
      ]
    }
  })],
})
