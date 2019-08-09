import Vue from 'vue'
import App from './cityConcat.vue'
import common from '@/js/common.js'
import dataService from '@/js/dataService.js'
Vue.prototype.$eventBus = new Vue();
// js 计算rem
common.setPxRem();
Vue.config.productionTip = false
Vue.prototype.dataService = dataService;
Vue.prototype.common = common;
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})

