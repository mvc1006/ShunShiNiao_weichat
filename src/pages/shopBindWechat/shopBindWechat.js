import Vue from 'vue'
import App from './shopBindWechat.vue'
import common from '@/js/common'
import dataService from '@/js/dataService'
Vue.prototype.common = common;
Vue.prototype.dataService = dataService;
Vue.prototype.$eventBus = new Vue();
Vue.config.productionTip = false;
common.setPxRem();
new Vue({
    el:'#app',
    components:{App},
    template: '<App/>'
})
