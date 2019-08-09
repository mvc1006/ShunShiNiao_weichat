import Vue from 'vue'
import vueRouter from 'vue-router'
import App from './localService.vue'
import common from '@/js/common.js'
import dataService from '@/js/dataService.js';
import main from '@/components/localService/localServiceMain.vue';
import goods from '@/components/localService/localServiceGoods.vue';
import store from './store/store'
// import historyBack from '@/js/historyBack'
// historyBack();
Vue.prototype.$eventBus = new Vue();
common.setPxRem();
Vue.prototype.common = common;
Vue.prototype.dataService = dataService;
Vue.config.productionTip = false;
Vue.use(vueRouter);
const routes = [
    {path:'/' ,redirect: '/main'},
    { path: '/main', component: main },
    { path: '/goods', component: goods }
]
const router = new vueRouter({
    linkActiveClass:'active',
    routes
})
// console.log(router)
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

