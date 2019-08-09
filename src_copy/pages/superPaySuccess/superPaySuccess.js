import Vue from 'vue';
import paySuccess from './superPaySuccess.vue';
import common from '@/js/common.js';
import dataService from '@/js/dataService.js';
 Vue.prototype.$eventBus = new Vue();
 Vue.prototype.common = common;
 Vue.prototype.dataService = dataService;
 common.setPxRem();
 Vue.config.productionTip = false;
 new Vue({
   el: '#app',
   components: { paySuccess },
   template: '<paySuccess/>'
 })
