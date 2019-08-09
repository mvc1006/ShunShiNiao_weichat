 import common from '@/js/common.js';
 import Vue from 'vue';
 import storeOrder from './storeOrder.vue';
 import dataService from '@/js/dataService';
 import VueRouter from 'vue-router';
 Vue.prototype.dataService = dataService;
 Vue.prototype.$eventBus = new Vue();
 common.setPxRem();
 Vue.config.productionTip = false;
 Vue.use(VueRouter);
 const routes = [
   {path:'/' ,redirect: '/menu1'},
   {path: '/menu1',template:''},
   {path: '/menu2',template:''},
   {path: '/menu3',template:''},
   {path: '/menu4',template:''},
   {path: '/menu5',template:''}
 ]
 const router = new VueRouter({
   routes
 })
 new Vue({
   el: '#app',
   router,
   components: { storeOrder },
   template: '<storeOrder/>'
 })
