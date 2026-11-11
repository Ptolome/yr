import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const REPO_NAME = '/yr/';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
   base: `${REPO_NAME}`,
 server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://api.favorit-parts.ru',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/proxy/, '/hs/hsprice/'),
      },
    },
  },
})
