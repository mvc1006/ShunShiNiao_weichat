import Vue from 'vue';
import app from './jjk.vue';
import common from '@/js/common.js';
import dataService from '@/js/dataService.js';
import store from './jjkData'
 Vue.prototype.$eventBus = new Vue();
 Vue.prototype.common = common;
 Vue.prototype.dataService = dataService;
 common.setPxRem();
 Vue.config.productionTip = false;
 new Vue({
   el: '#app',
   store,
   components: { app },
   template: '<app/>'
 })
