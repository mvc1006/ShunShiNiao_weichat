<template>
  <div class="container">
      <!-- <div class="header-top">
        <div class="back" @click="goBack">
            <div class="go-back"></div>
        </div>
        <div class="title">支付成功</div>
      </div> -->
    <!-- 支付成功内容 -->
    <div class="paySuccess">
      <img class="img" src="../../assets/duihao.png" alt="">
      <div class="title">支付成功</div>
    </div>
    <!-- 按钮 -->
    <div class="btn" @click="lookOrder">
        关注公众号，查看订单哦
    </div>
  </div>
</template>
<script>
export default {
    name:'paySuccess',
    data(){
        return {}
    },
    methods:{
        goBack(){
            history.back();
        },
        // 查看订单
        lookOrder(){
            let url = this.common.getUrlParam('jump_url');
            location.href = url;
        }
    }
}
</script>
<style lang="less">
  @import url('../../less/header.less');
  // 支付成功
.paySuccess{
  .pxRem(padding-top,120);
  text-align: center;
  .img{
    .pxRem(width,160);
    .pxRem(height,160);
    display: block;
    margin: 0 auto;
  }
  .title{
    font-weight: bold;
    .pxRem(margin-top,40);
    .pxRem(margin-bottom,40)
  }
  .content{
    .pxRem(font-size,24);
    .pxRem(padding-left,120);
    .pxRem(padding-right,120);
    .pxRem(line-height,36)
  }
}
  .btn{
    .borderRadius(8);
    .border(2,@red-color);
    .pxRem(line-height,78);
    .pxRem(font-size,24);
    text-align:center;
    color: @red-color;
    .pxRem(margin,128);
  }
</style>
