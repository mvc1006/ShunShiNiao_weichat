import Vue from 'vue';
import paySuccess from './appraise.vue';
import common from '@/js/common.js';
import dataService from '@/js/dataService.js';
 Vue.prototype.$eventBus = new Vue();
 Vue.prototype.dataService = dataService;
 Vue.prototype.common = common;
 common.setPxRem();
 Vue.config.productionTip = false;
 new Vue({
   el: '#app',
   components: { paySuccess },
   template: '<paySuccess/>'
 })
