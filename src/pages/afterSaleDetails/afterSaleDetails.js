 import common from '@/js/common.js';
 import dataService from '@/js/dataService.js';
 import Vue from 'vue';
 import paySuccess from './afterSaleDetails.vue';
 Vue.prototype.common = common;
 Vue.prototype.dataService = dataService;
 Vue.prototype.$eventBus = new Vue();

 common.setPxRem();
 Vue.config.productionTip = false;
 new Vue({
   el: '#app',
   components: { paySuccess },
   template: '<paySuccess/>'
 })
