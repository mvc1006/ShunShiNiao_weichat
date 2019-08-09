<template>
  <div class="viewport">
    <!-- 头部返回 -->
    <div class="header">
      <span class="go-back" @click="goBack"></span>
      <span class="title">评价成功</span>
    </div>
    <div class="paySuccess">
      <img class="img" src="../../assets/duihao.png" alt="">
      <div class="title">评价成功</div>
    </div>
    <div class="btn">
      <div class="look-order" @click="breakHome">返回首页</div>
      <div class="break-home" @click="appraiseDetails">查看评价</div>
    </div>
  </div>
</template>
<script>
export default {
    name:'paySuccess',
    data(){
        return {

        }
    },
    mounted(){

    },
    methods:{
      // 返回上一页
      goBack(){
        history.back(-1);
      },
      // 查看评价
      appraiseDetails(){
        let id = this.common.getUrlParam('id');
        location.href = './myAppraise.html';
      },
      // 返回首页
      breakHome(){
        window.location.href = './index.html'
      }
    },
    components:{}
}
</script>
<style lang="less">
  @import "appraised.less";
</style>
