import Vue from 'vue'
import common from '@/js/common.js'
import dataService from '@/js/dataService.js'
import App from './shopSetPsw.vue'
Vue.prototype.common = common;
Vue.prototype.dataService = dataService;
Vue.prototype.$eventBus = new Vue();
Vue.config.productionTip = false;
common.setPxRem();

new Vue({
    el:'#app',
    components:{App},
    template:'<App/>'
})