import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: './',
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: true
  },
  plugins: [{
    name: 'watch-external',
    async buildStart() {
      this.addWatchFile(resolve(__dirname, 'package.json'))
    }
  }],
  server: {
    port: 3000,
    cors: true
  }
})
