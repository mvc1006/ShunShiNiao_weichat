 import common from '@/js/common.js';
 import Vue from 'vue';
 import VueRouter from  'vue-router';
 import storeMerchant from './storeMerchant.vue';
 import dataService from '@/js/dataService';
 import store from './storeMerchantData'
 Vue.prototype.dataService = dataService;
 Vue.prototype.$eventBus = new Vue();
 common.setPxRem();
 Vue.config.productionTip = false;
 Vue.use(VueRouter);
 const routes = [
   {path:'/' ,redirect: '/main'},
   {path: '/main',template:''},
   {path: '/give',template:''},
   {path: '/merchant',template:''}
 ]
 const router = new VueRouter({
   routes
 })
 new Vue({
   el: '#app',
   store,
   router,
   components: { storeMerchant },
   template: '<storeMerchant/>'
 })
