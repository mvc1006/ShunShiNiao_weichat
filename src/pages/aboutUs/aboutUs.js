import Vue from 'vue'
import App from './aboutUs.vue'
import common from '@/js/common.js'

// js 计算rem
common.setPxRem();
Vue.config.productionTip = false

new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})

