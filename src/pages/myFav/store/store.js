import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

const state = {
    isManage:false,
    checkedAll:false,
}

const getters = {
    getManage(state){
        return state.isManage
    },
    getCheckedAll(state){
        return state.checkedAll
    },
}

const mutations = {
    changeManage(state){
        state.isManage = !state.isManage;
    },
    changeChecked(state,val){
        if(val){ // val 存在的时候 清除全选状态
            state.checkedAll = false
        }else{
            state.checkedAll = !state.checkedAll;
        }
    },
}
const actions = {
    manage(context){
        context.commit('changeManage')
    },
    checkedAll(context,val){
        context.commit('changeChecked',val)
    },
}

const store = new Vuex.Store({
    state,
    getters,
    mutations,
    actions
})
export default store;