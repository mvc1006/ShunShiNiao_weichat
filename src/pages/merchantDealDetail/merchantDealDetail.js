 import common from '@/js/common.js';
 import Vue from 'vue';
 import merchantDealDetail from './merchantDealDetail.vue';
 import dataService from '@/js/dataService';
 Vue.prototype.dataService = dataService;
 Vue.prototype.common = common;
 Vue.prototype.$eventBus = new Vue();
 common.setPxRem();
 Vue.config.productionTip = false;
 new Vue({
   el: '#app',
   components: { merchantDealDetail },
   template: '<merchantDealDetail/>'
 })
