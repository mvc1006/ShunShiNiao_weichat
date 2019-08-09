import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

const state = {
  commonData: {
    // 商品组相关
    ssn_shopGroup: {  // 商品组数据
      mainShop:{},
      presentList:[],
    },
    isGroup: false, // 是否打开商品组
    isUpper: false, // 赠品数量是否已达上限
    isMain: false, // 是否选择了主商品
    isEmptyShopGroup: true, // 是否清空商品组
    // 规格相关
    shopData: {}, // 弹窗规格的商品信息
    isSpe: false, // 是否打开规格选项
    isPromptlyBuy: false, // 是否立即购买
    isGotoPresent: true,// 是否去选择赠品
    // 弹窗相关
    isPopUp: false, // 是否打开弹窗提示
    popupType: 1 ,// 弹窗类型
    popupTime: 3000, // 弹窗时间
    popupContent: '', // 弹窗内容
  }

}
const mutations = {
  // 商品组相关
  ssn_shopGroup(state,params){
    state.commonData.ssn_shopGroup = Object.assign({},state.ssn_shopGroup,params);
  },
  isGroup(state,params){
    state.commonData.isGroup = params;
  },
  isUpper(state,params){
    state.commonData.isUpper = params;
  },
  isMain(state,params){
    state.commonData.isMain = params;
  },
  isEmptyShopGroup(state,params){
    state.commonData.isEmptyShopGroup = params;
  },
  // 规格相关
  shopData(state,params){
    state.commonData.shopData = params;
  },
  isSpe(state,params){
    state.commonData.isSpe = params;
  },
  // 弹窗相关
}
const getters = {};
const actions = {};
const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
export default store;
