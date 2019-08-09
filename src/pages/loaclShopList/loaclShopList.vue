<template>
  <div class="viewport">
    <!-- 头部返回 -->
    <div class="header">
      <span class="go-back" @click="goBack"></span>
      <div>订单管理</div>
    </div>
    <localShopList></localShopList>
  </div>
</template>
<script>
  import localShopList from '../../components/localShopList.vue';
  export default {
      name:'index',
      data(){
          return {

          }
      },
      mounted(){

      },
      methods:{
        // 返回
        goBack(){
          history.back(-1);
        },
      },
      components:{
        localShopList
      }
  }
</script>
<style lang="less">
  @import "loaclShopList.less";
</style>
