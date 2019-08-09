import Vue from 'vue'
import App from './personCenter.vue'
import common from '@/js/common.js'
import dataService from '@/js/dataService.js'
import store from './personCenterData'
// import historyBack from '@/js/historyBack'
// historyBack();
// js 计算rem
common.setPxRem();
// login();
Vue.prototype.common = common;
Vue.prototype.dataService = dataService;
Vue.config.productionTip = false

Vue.prototype.$eventBus = new Vue();
new Vue({
  el: '#app',
  store,
  components: { App },
  template: '<App/>'
})

