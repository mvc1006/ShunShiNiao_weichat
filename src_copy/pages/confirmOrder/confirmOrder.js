 import common from '@/js/common';
 import Vue from 'vue';
 import confirmOrder from './confirmOrder.vue';
 import dataService from '@/js/dataService';
 import store from './confirmOrderData'
 Vue.prototype.dataService = dataService;
 Vue.prototype.$eventBus = new Vue();
 common.setPxRem();
 Vue.config.productionTip = false;
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
 new Vue({
   el: '#app',
   store,
   components: { confirmOrder },
   bus:new Vue({}),
   template: '<confirmOrder/>'
 })
