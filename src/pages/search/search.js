 import common from '@/js/common';
 import Vue from 'vue';
 import search from './search.vue';
 import dataService from '@/js/dataService';
 Vue.prototype.dataService = dataService;
 Vue.prototype.common = common;
 Vue.prototype.$eventBus = new Vue();
 common.setPxRem();
 Vue.config.productionTip = false;
 new Vue({
   el: '#app',
   components: { search },
   bus:new Vue({}),
   template: '<search/>'
 })
