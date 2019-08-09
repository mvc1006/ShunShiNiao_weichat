<template>
  <div>
    <div v-show="!isShopDetails" class="viewport">
      <!-- 搜索 -->
      <div class="header" @click="goBack">
        <span class="go-back"></span>
        <div class="header-input"><span class="search-img"></span> <span class="text">{{search_text}}</span></div>
      </div>
      <!-- 商品列表 -->
      <div class="shop-item" v-for="(good,index) in shopData" @click="gotoDetails(index)">
        <div class="shop-img">
          <img :src="good.gimg" alt="">
          <div class="shop-type" v-if="good.on_sale==1&&good.store==0||good.on_sale==2">
            <span v-if="good.on_sale==1&&good.store==0">已售完</span>
            <span v-if="good.on_sale==2">已下架</span>
          </div>
        </div>
        <div class="shop-data">
          <div class="shop-name">{{good.goods_name}}</div>
          <div class="shop-price">￥{{good.sprice}}</div>
          <div class="shop-other">
            <span class="shop-inventory">库存{{good.store}}</span>
            <span class="add-time">添加时间：{{good.create_time}}</span>
          </div>
        </div>
        <img class="look-details" src="../../assets/advance.png" alt="">
      </div>
    </div>
    <compileShop v-show="isShopDetails" ref="compileShop" :goods_id="goods_id" :mainMenu="mainMenu" :typeMenu="typeMenu"></compileShop>
  </div>
</template>
<script>
  import common from '../../js/common'
  import storeSearchShop from './storeSearchShop.vue';
  import compileShop from '../compileShop/compileShop.vue';
  export default {
      name:'index',
      data(){
          return {
            isShopDetails: false, // 是否为商品详情
            goods_id: '',
            mainMenu:'',
            typeMenu:'',
            shopData: [],
            search_text: '', // 搜索关键词
          }
      },
      mounted(){
        this.mainMenu = Number(common.getUrlParam('mainMenu'));
        this.search_text = decodeURIComponent(common.getUrlParam('search'));
        this.request();
        var that = this;
        this.$eventBus.$on('closeDetails', function (isBack) {
          that.isShopDetails = false;
          if(isBack) {
            this.request();
          }
        });
      },
      methods:{
        // 请求后台
        request(){
          var that = this;
          this.dataService.goodsSearch({
            shop_id: common.getUrlParam("shop_id"),
            keywords: this.search_text,
            is_main: this.mainMenu==0?1:2
          }).then(function(resp){
            that.dataService.handleResponse({
              data: resp,
              callback: function(data){
                that.shopData = data.data;
              }
            })
          })
        },
        // 返回上一页
        goBack(){
          window.history.go(-1);
        },
        // 跳转商品编辑
        gotoDetails(num){
          this.goods_id = this.shopData[num].goods_id;
          this.typeMenu = this.shopData[num].on_sale==1?1:0;
          this.isShopDetails = true;
          this.$refs.compileShop.request({
            goods_id: this.shopData[num].goods_id,
            is_main: this.mainMenu==0?1:2
          });
        }
      },
      components:{
        compileShop,
        storeSearchShop
      }
  }
</script>
<style lang="less">
  @import "../../less/common.less";
  @import "./storeSearchShop.less";
</style>
