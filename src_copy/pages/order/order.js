import Vue from 'vue'
import vueRouter from 'vue-router'
import App from './order.vue'
import common from '@/js/common.js'
import dataService from '@/js/dataService.js';
import line from '@/components/myOrder/line.vue'
import local from '@/components/myOrder/local.vue'

// line 模板
import lineAll from '@/components/myOrder/line/all.vue'
import linePay from '@/components/myOrder/line/pay.vue'
import lineAppraise from '@/components/myOrder/line/appraise.vue'
import linePayed from '@/components/myOrder/line/payed.vue'
import lineReceiving from '@/components/myOrder/line/receiving.vue'

// local 模板

import localAll from '@/components/myOrder/local/all.vue'
import localPay from '@/components/myOrder/local/pay.vue'
import localAppraise from '@/components/myOrder/local/appraise.vue'
import localPayed from '@/components/myOrder/local/payed.vue'

// js 计算rem
common.setPxRem();
Vue.prototype.$eventBus = new Vue();
Vue.prototype.common = common;
Vue.prototype.dataService = dataService;
Vue.config.productionTip = false;
Vue.use(vueRouter);
const routes = [
    {path:'/' ,redirect: '/local'},
    {   path: '/line', 
        component: line,
        children:[
            {path:'/line',redirect:'/line/all'},
            {path:'all',component:lineAll},
            {path:'pay',component:linePay},
            {path:'appraise',component:lineAppraise},
            {path:'payed',component:linePayed},
            {path:'receiving',component:lineReceiving},
        ],
    },
    { 
        path: '/local', 
        component: local,
        children:[
            {path:'/local',redirect:'/local/all'},
            {path:'all',component:localAll},
            {path:'pay',component:localPay},
            {path:'appraise',component:localAppraise},
            {path:'payed',component:localPayed},
        ],
    }
]
const router = new vueRouter({
    linkActiveClass:'active',
    routes
})
new Vue({
  el: '#app',
  router,
  components: { App },
  bus:new Vue({}),
  template: '<App/>'
})
