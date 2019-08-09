<template>
  <div class="viewport">
    <!-- 头部返回 -->
    <div class="header">
      <span class="go-back" @click="goBack"></span>
      <div>数据分析</div>
    </div>
  </div>
</template>
<script>
  export default {
      name:'storeDataStatistics',
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
        // 店铺功能
        storeActions(type){
          window.location.href = './'+type+'.html';
        }
      },
      components:{}
  }
</script>
<style lang="less">
  @import "storeDataStatistics.less";
</style>
