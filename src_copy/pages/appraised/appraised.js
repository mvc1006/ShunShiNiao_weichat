 import common from '@/js/common.js';
 import Vue from 'vue';
 import paySuccess from './appraised.vue';
 Vue.prototype.$eventBus = new Vue();
 Vue.prototype.common = common;
 common.setPxRem();
 Vue.config.productionTip = false;
 new Vue({
   el: '#app',
   components: { paySuccess },
   template: '<paySuccess/>'
 })