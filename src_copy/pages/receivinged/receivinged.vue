<template>
  <div class="viewport">
    <!-- 头部返回 -->
    <div class="header">
      <span class="go-back" @click="goBack"></span>
      <span class="title">确认收货成功</span>
    </div>
    <!-- 支付成功内容 -->
    <div class="paySuccess">
      <img class="img" src="../../assets/duihao.png" alt="">
      <div class="title">收货成功</div>
    </div>
    <!-- 按钮 -->
    <div class="btn">
      <div class="look-order" @click="breakHome">返回首页</div>
      <div class="break-home" @click="appraise">立即评价</div>
    </div>
  </div>
</template>
<script>
export default {
    name:'appraised',
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
      // 立即评价
      appraise(){
        let id = this.common.getUrlParam('id');
        location.href = './appraise.html?id='+id
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
  @import "receivinged.less";
</style>
