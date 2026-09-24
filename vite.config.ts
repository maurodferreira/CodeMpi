import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'codemirror-core',
              test: /node_modules[\\/]@codemirror[\\/]/,
              priority: 30,
            },
            {
              name: 'codemirror-parser',
              test: /node_modules[\\/]@lezer[\\/]/,
              priority: 25,
            },
            {
              name: 'codemirror-react',
              test: /node_modules[\\/]@uiw[\\/]/,
              priority: 20,
            },
          ],
        },
      },
    },
  },
})
