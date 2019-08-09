import Vue from 'vue'
import App from './activityLocal.vue'
import common from '@/js/common.js'
import dataService from '@/js/dataService.js';
import store from './activityLocalData'
Vue.prototype.$eventBus = new Vue();
common.setPxRem();
Vue.prototype.common = common;
Vue.prototype.dataService = dataService;
Vue.config.productionTip = false;
new Vue({
  el: '#app',
  store,
  components: { App },
  template: '<App/>'
})

