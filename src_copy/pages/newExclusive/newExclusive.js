import common from '@/js/common.js';
import Vue from 'vue';
import newExclusive from './newExclusive.vue';
import dataService from '@/js/dataService';
import store from './newExclusiveData';
Vue.prototype.dataService = dataService;
Vue.prototype.common = common;
Vue.prototype.$eventBus = new Vue();
common.setPxRem();
Vue.config.productionTip = false;
new Vue({
	el: '#app',
	store,
	components: { newExclusive },
	template: '<newExclusive/>'
})
