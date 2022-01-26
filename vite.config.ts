import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {resolve} from 'path'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'
import ElementPlus from 'unplugin-element-plus/vite'
// @ts-ignore
import vueJsx from '@vitejs/plugin-vue-jsx'
// https://www.kkkk1000.com/js/bump.js
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx({
      // options are passed on to @vue/babel-plugin-jsx
    }),
    ElementPlus({
      useSource: true,
    }),
    Components({
      resolvers: [ElementPlusResolver(
        {
        }
      )],
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      "~/": `${resolve(__dirname, "src")}/`,
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "@/styles/variable.scss" as *;
         `
      }
    }
  },
  server: {
    host:'0.0.0.0',
    port: 3232,
    open: true,
    cors: true,
    proxy: {}
  }
})
