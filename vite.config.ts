import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      output: {
        // chunkFileNames: 'js/[name]-[hash].js',
        chunkFileNames: 'js/[hash].js',
        // entryFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[hash].js',

        assetFileNames: ({ name }) => {
          if (/\.(gif|jpe?g|png|svg)$/.test(name ?? '')) {
            // return 'img/[name]-[hash][extname]'
            return 'img/[hash][extname]'
          }

          if (/\.css$/.test(name ?? '')) {
            // return 'css/[name]-[hash][extname]'
            return 'css/[hash][extname]'
          }

          if (/\.(ttf|woff|woff2)$/.test(name ?? '')) {
            // return 'fonts/[name]-[hash][extname]'
            return 'fonts/[hash][extname]'
          }

          // default value
          // ref: https://rollupjs.org/guide/en/#outputassetfilenames
          // return 'assets/[name]-[hash][extname]'
          return 'assets/[hash][extname]'
        }
      }
    }
  }
})
