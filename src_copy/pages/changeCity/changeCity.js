import Vue from 'vue'
import dataService from '@/js/dataService'
import App from './changeCity.vue'
import common from '@/js/common'
common.setPxRem();
Vue.prototype.dataService = dataService;
Vue.prototype.common = common;
Vue.prototype.$eventBus = new Vue();
new Vue({
    el: '#app',
    components: { App },
    template: '<App />'
})