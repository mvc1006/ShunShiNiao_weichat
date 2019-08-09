import Vue from 'vue'
import App from './beginnerGuide.vue'
import common from '@/js/common.js'
import dataService from '@/js/dataService.js'
// js 计算rem
common.setPxRem();
// login();
Vue.prototype.common = common;
Vue.prototype.dataService = dataService;
Vue.config.productionTip = false
Vue.prototype.bus = new Vue();
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})

