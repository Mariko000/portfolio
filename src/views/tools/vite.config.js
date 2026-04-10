import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@shared': path.resolve(__dirname, '../../shared-components-lib'),
      '@taskAssets': path.resolve(__dirname, './Taskmanager/assets')
    }
  }
})
