import common from '@/js/common.js';
import Vue from 'vue';
import VueRouter from 'vue-router';
import selectShop from './selectShop.vue';
import dataService from '@/js/dataService';
import store from './selectShopData';
Vue.prototype.dataService = dataService;
Vue.prototype.$eventBus = new Vue();
common.setPxRem();
Vue.config.productionTip = false;
Vue.use(VueRouter);
Vue.directive('preventReClick', {
	inserted (el, binding) {
		el.addEventListener('click', () => {
			if (!el.disabled) {
				el.disabled = true
				setTimeout(() => {
					el.disabled = false
				}, binding.value || 1000)
			}
		})
	}
})
const routes = [
	{path:'/' ,redirect: '/source'},
	{
		path: '/source',template:'',
		children: [
			{path: '/source/isOneLive', template: ''}
		]
	},
	{path: '/locality',template:'',}
]
const router = new VueRouter({
routes
})
new Vue({
el: '#app',
store,
router,
components: { selectShop },
template: '<selectShop/>'
})
