import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/portfolio/',
  plugins: [vue()],
  optimizeDeps: {
    // ★exclude と dedupe を optimizeDeps の中に統合
    exclude: [
      '@codemirror/autocomplete',
      '@codemirror/commands',
      '@codemirror/language',
      '@codemirror/lint',
      '@codemirror/search',
      '@codemirror/state',
      '@codemirror/view',
      '@codemirror/buildhelper',
      'codemirror', // ★ codemirror パッケージ
    ],
   
    dedupe: [
      '@codemirror/state',
      '@codemirror/view',
      'codemirror', // ★ codemirror
    ]
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@shared': path.resolve(__dirname, './src/components/shared'),
      '@views': path.resolve(__dirname, 'src/views'),
    },
  },
})