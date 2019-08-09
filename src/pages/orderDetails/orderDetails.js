import Vue from 'vue'
import App from './orderDetails.vue'
import common from '@/js/common.js'
import dataService from '@/js/dataService.js'

// js 计算rem
common.setPxRem();
Vue.config.productionTip = false
Vue.prototype.common = common;
Vue.prototype.dataService = dataService;
Vue.prototype.$eventBus = new Vue();

new Vue({
  el: '#app',
  components: { App },
  bus:new Vue({}),
  template: '<App/>'
})
