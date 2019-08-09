import Vue from 'vue'
import common from '@/js/common.js'
import dataService from '@/js/dataService.js'
import App from './afterSale.vue'
import gallery from '@/components/img-vuer/gallery.js'
// js 计算rem
common.setPxRem();
Vue.config.productionTip = false
Vue.prototype.common = common;
Vue.prototype.dataService = dataService;
Vue.prototype.$eventBus = new Vue();
Vue.use(gallery);

new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})

