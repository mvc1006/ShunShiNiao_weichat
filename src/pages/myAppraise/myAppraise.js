import Vue from 'vue';
import common from '@/js/common.js';
import gallery from '@/components/img-vuer/gallery.js'
import dataService from '@/js/dataService.js';
import paySuccess from './myAppraise.vue';
common.setPxRem();
Vue.prototype.$eventBus = new Vue();
Vue.prototype.dataService = dataService;
Vue.config.productionTip = false;
Vue.use(gallery)
new Vue({
el: '#app',
components: { paySuccess },
template: '<paySuccess/>'
})
