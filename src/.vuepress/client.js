import { defineClientConfig } from 'vuepress/client'
import CryptoTools from './CryptoTools.vue'

export default defineClientConfig({
  enhance({ app }) {
    app.component('CryptoTools', CryptoTools)
  },
})