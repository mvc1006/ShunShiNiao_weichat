 import common from '@/js/common';
 import Vue from 'vue';
 import gallery from '@/components/img-vuer/gallery.js'
 import particulars from './sourceShopDetailsShare.vue';
 import dataService from '@/js/dataService';
 Vue.prototype.dataService = dataService;
 Vue.prototype.$eventBus = new Vue();
 common.setPxRem();
 Vue.use(gallery);
 Vue.config.productionTip = false;
 new Vue({
   el: '#app',
   components: { particulars },
   bus:new Vue({}),
   template: '<particulars/>'
 })
