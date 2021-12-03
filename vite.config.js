import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from "path" 

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src")
    }
  },
  css: {
    //css 预处理
    preprocessorOptions: {
      scss: {
        additionalData: '@import "./src/styles/global.scss"'
      }
    }
  },
  base: './', //设置打包路径
})
