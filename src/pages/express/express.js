import Vue from 'vue'
import App from './express.vue'
import common from '@/js/common.js'
import dataService from '@/js/dataService.js';
Vue.prototype.common = common;
Vue.prototype.dataService = dataService;
Vue.config.productionTip = false;
common.setPxRem();
new Vue({
    el:'#app',
    components:{App},
    template: '<App/>'
})