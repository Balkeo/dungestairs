import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// This project keeps JSX inside `.js` files (a Create React App habit). Vite's
// esbuild defaults to treating `.js` as plain JavaScript, so we point the jsx
// loader at the project's own `.js`/`.jsx` files (never node_modules) and tell
// the dependency optimizer to use the jsx loader for `.js` too.
export default defineConfig({
  plugins: [react()],
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: []
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: { '.js': 'jsx' }
    }
  },
  build: {
    outDir: 'dist'
  }
})
