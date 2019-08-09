<template>
  <div class="container">
    <!-- 支付成功内容 -->
    <div class="cont">
        <img src="../../assets/no-follow.png" alt="">
        <p>您还未关注公众号哦~</p>
        <p>关注后即可查看订单哦~</p>
    </div>
    <!-- 按钮 -->
    <div class="btn" @click="lookOrder">
        关注公众号
    </div>
  </div>
</template>
<script>
export default {
    name:'cityConcatFollow',
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
  .cont{
      text-align: center;
      .pxRem(padding-top,100);
      img{
          .pxRem(width,202);
          .pxRem(height,202);
          .pxRem(margin-bottom,30);
      }
      p{
          .pxRem(font-size,24);
          .pxRem(line-height,50);
          color: @gray-light-text;
          font-weight:bold;
      }
  }
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
