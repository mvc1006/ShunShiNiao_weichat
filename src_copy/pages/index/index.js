 import common from '@/js/common.js';
 import Vue from 'vue';
 import VueRouter from 'vue-router';
 import index from './index.vue';
 import dataService from '@/js/dataService';
 import store from './indexData';
//  import historyBack from '@/js/historyBack'
// historyBack();
 Vue.prototype.dataService = dataService;
 Vue.prototype.common = common;
 Vue.prototype.$eventBus = new Vue();
 common.setPxRem();
 Vue.config.productionTip = false;
 Vue.use(VueRouter);
 const routes = [
   {path:'/' ,redirect: '/main'},
   {path: '/main',template:''},
   {path: '/give',template:''}
 ]
 const router = new VueRouter({
   routes
 })
 new Vue({
   el: '#app',
   store,
   router,
   components: { index },
   template: '<index/>'
 })
