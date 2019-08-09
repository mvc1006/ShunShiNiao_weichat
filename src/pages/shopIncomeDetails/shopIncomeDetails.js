import Vue from 'vue'
import vueRouter from 'vue-router'
import common from '@/js/common.js'
import dataService from '@/js/dataService.js'
import App from './shopIncomeDetails.vue'
import all from '@/components/incomeDetails/all'
import out from '@/components/incomeDetails/out'
import come from '@/components/incomeDetails/come'
Vue.prototype.common = common;
Vue.prototype.dataService = dataService;
Vue.config.productionTip = false;
Vue.prototype.$eventBus = new Vue();
common.setPxRem();
Vue.use(vueRouter)
const routes = [
    {path:'/' ,redirect: '/all'},
    { path: '/all', component: all },
    { path: '/come', component: come },
    { path: '/out', component: out },
]
const router = new vueRouter({
    linkActiveClass:'active',
    routes
})
new Vue({
    el:'#app',
    router,
    components:{App},
    template:'<App/>'
})
