import Vue from 'vue'
import common from '@/js/common.js'
import dataService from '@/js/dataService.js'
import App from './shopClosing.vue'
Vue.prototype.common = common;
Vue.prototype.dataService = dataService;
Vue.config.productionTip = false;
Vue.prototype.$eventBus = new Vue(); 
common.setPxRem();

new Vue({
    el:'#app',
    components:{App},
    template:'<App/>'
})
