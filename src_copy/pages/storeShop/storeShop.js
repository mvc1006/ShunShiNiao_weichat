 import common from '@/js/common.js';
 import Vue from 'vue';
 import storeShop from './storeShop.vue';
 import dataService from '@/js/dataService';
 Vue.prototype.dataService = dataService;
 Vue.prototype.$eventBus = new Vue();
 common.setPxRem();
 Vue.config.productionTip = false;
 new Vue({
   el: '#app',
   components: { storeShop },
   template: '<storeShop/>'
 })
