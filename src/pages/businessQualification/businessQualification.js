 import common from '@/js/common';
 import Vue from 'vue';
 import businessQualification from './businessQualification.vue';
 import dataService from '@/js/dataService';
import gallery from '@/components/img-vuer/gallery.js'
 Vue.prototype.dataService = dataService;
 Vue.prototype.$eventBus = new Vue();
 common.setPxRem();
 Vue.config.productionTip = false;
 Vue.use(gallery);
 new Vue({
   el: '#app',
   components: { businessQualification },
   bus:new Vue({}),
   template: '<businessQualification/>'
 })
