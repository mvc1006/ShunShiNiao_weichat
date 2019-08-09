<template>
  <div class="viewport">
    <!-- 头部返回 -->
    <div class="header">
      <span class="go-back" @click="goBack"></span>
      <span class="title">支付成功</span>
    </div>
    <!-- 支付成功内容 -->
    <div class="paySuccess">
      <img class="img" src="../../assets/duihao.png" alt="">
      <div class="title">支付成功</div>
      <div class="content">快递员将会以最快的速度将快递送到您的手中请小主耐心等候哟～</div>
    </div>
    <!-- 按钮 -->
    <div class="btn">
      <div class="look-order" @click="lookOrder">查看订单</div>
      <div class="break-home" @click="breakHome">返回首页</div>
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
    computed:{
        goods_type:function(){
            return this.common.getUrlParam('goods_type')
        }
    },
    methods:{
      // 返回上一页
      goBack(){
        history.back(-1);
      },
      // 查看订单
      lookOrder(){
          let hash = this.goods_type == 1 ? '#/line' : '#/local'
        window.location.href = 'order.html' + hash;
      },
      // 返回首页
      breakHome(){
        window.location.href = './index.html'
      }
    },
    components:{
    }
}
</script>
<style lang="less">
  @import "paySuccess.less";
</style>
