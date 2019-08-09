import common from '@/js/common';
import Vue from 'vue';
import gallery from '@/components/img-vuer/gallery.js'
import particulars from './sourceShopDetails.vue';
import dataService from '@/js/dataService';
import store from './sourceShopDetailsData';
Vue.prototype.dataService = dataService;
Vue.prototype.$eventBus = new Vue();
common.setPxRem();
Vue.use(gallery);
Vue.config.productionTip = false;
new Vue({
	el: '#app',
	store,
	components: { particulars },
	bus:new Vue({}),
	template: '<particulars/>'
})
