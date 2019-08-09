import common from '@/js/common.js';
import Vue from 'vue';
import VueRouter from 'vue-router';
import index from './shareMark.vue';
import dataService from '@/js/dataService';
import store from './shareMarkData';
// import historyBack from '@/js/historyBack'
// historyBack();
Vue.prototype.dataService = dataService;
Vue.prototype.common = common;
Vue.prototype.$eventBus = new Vue();
common.setPxRem();
Vue.config.productionTip = false;
Vue.use(VueRouter);
const routes = [
    {path:'/' ,redirect: '/all'},
    {path: '/all',template:''},
    {path: '/noReceive',template:''},
    {path: '/toReceive',template:''},
    {path: '/alreadyReceive',template:''},
    {path: '/loseEfficacy',template:''},
]
const router = new VueRouter({
  routes
})
new Vue({
    el: '#app',
    router,
    store,
    components: { index },
    template: '<index/>'
})
