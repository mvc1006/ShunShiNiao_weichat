<template>
  <div style="height: 100%">
    <!-- <storeShopPage ref="storeShopPage" :style="{display:(!isShopDetails?'block':'none')}"></storeShopPage>
    <compileShop ref="compileShop" :style="{display:(isShopDetails?'block':'none')}" :goods_id="goods_id" :mainMenu="mainMenu" :typeMenu="typeMenu"></compileShop> -->
    <storeShopPage ref="storeShopPage" v-show="!isShopDetails"></storeShopPage>
    <compileShop ref="compileShop" v-show="isShopDetails" :goods_id="goods_id" :mainMenu="mainMenu" :typeMenu="typeMenu"></compileShop>
  </div>
</template>
<script>
  import storeShopPage from './storeShopPage.vue'
  import compileShop from '../compileShop/compileShop.vue';
  export default {
      name:'index',
      data(){
          return {
            isShopDetails: false, // 是否为商品详情
            goods_id: '',
            mainMenu:'',
            typeMenu:'',
          }
      },
      mounted(){
        var that = this;
        this.$eventBus.$on('gotoDetails',function(params){
          that.isShopDetails = true;
          that.goods_id = params.goods_id;
          that.typeMenu = params.typeMenu;
          that.mainMenu = params.mainMenu;
          that.$refs.compileShop.request({
            goods_id: params.goods_id,
            is_main: params.mainMenu==0?1:2
          });
        });
        this.$eventBus.$on('closeDetails', function (isBack) {
          that.isShopDetails = false;
          if(isBack){
            that.$refs.storeShopPage.requestParam("break");
          }
        });
      },
      methods:{

      },
      components:{
        compileShop,
        storeShopPage
      }
  }
</script>
<style lang="less">
  @import "../../less/common.less";
  body{
    background: @background-color;
  }
</style>
