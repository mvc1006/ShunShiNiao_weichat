import Vue from 'vue'
import common from '@/js/common'
import dataService from '@/js/dataService'
import orderSearch from './orderSearch.vue'

common.setPxRem();
Vue.prototype.common = common;
Vue.prototype.dataService = dataService;
Vue.prototype.$eventBus = new Vue();

new Vue({
    el:'#app',
    components: { orderSearch },
    template: '<orderSearch/>'
})