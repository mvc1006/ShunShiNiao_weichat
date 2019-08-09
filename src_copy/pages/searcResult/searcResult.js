import common from '@/js/common';
import Vue from 'vue';
import VueRouter from 'vue-router';
import searcResult from './searcResult.vue';
import dataService from '@/js/dataService';
import store from './searcResultData'
Vue.prototype.dataService = dataService;
Vue.prototype.$eventBus = new Vue();
common.setPxRem();
Vue.config.productionTip = false;
Vue.use(VueRouter);
const routes = [
	{path:'/' ,redirect: '/twoShop'},
	{path: '/oneShop',template:'',},
	{path: '/twoShop',template:'',}
]
const router = new VueRouter({
routes
})
new Vue({
el: '#app',
store,
router,
components: { searcResult },
bus:new Vue({}),
template: '<searcResult/>'
})
