import Vue from 'vue'
import vueRouter from 'vue-router'
import App from './myFav.vue'
import common from '@/js/common.js'
import dataService from '@/js/dataService'
import myGoods from '@/components/myFav/myFavGoods.vue'
import myStore from '@/components/myFav/myFavStore.vue'
import store from './store/store';
// js 计算rem
common.setPxRem();
Vue.prototype.common = common;
Vue.prototype.dataService = dataService;
Vue.prototype.$eventBus = new Vue();
Vue.config.productionTip = false
Vue.use(vueRouter);
const routes = [
    {path:'/' ,redirect: '/goods'},
    { path: '/goods', component: myGoods },
    { path: '/store', component: myStore }
]
const router = new vueRouter({
    linkActiveClass:'active',
    routes
})
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  bus:new Vue({}),
  template: '<App/>'
})

