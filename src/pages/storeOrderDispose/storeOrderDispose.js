 import common from '@/js/common.js';
 import Vue from 'vue';
 import storeOrderDispose from './storeOrderDispose.vue';
 import dataService from '@/js/dataService';
import gallery from '@/components/img-vuer/gallery.js'
 Vue.prototype.dataService = dataService;
 Vue.prototype.$eventBus = new Vue();
 common.setPxRem();
 Vue.config.productionTip = false;
 Vue.use(gallery);
 new Vue({
   el: '#app',
   components: { storeOrderDispose },
   template: '<storeOrderDispose/>'
 })
