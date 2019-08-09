<template>
  <div class="viewport">
    <!-- 头部返回 -->
    <div class="header">
      <span class="go-back" @click="goBack"></span>
      <span class="title">申请{{reason[type]}}成功</span>
    </div>
    <!-- 成功内容 -->
    <div class="paySuccess">
      <img class="img" src="../../assets/duihao.png" alt="">
      <div class="title">申请{{reason[type]}}成功</div>
      <div class="content">请耐心等待卖家处理~~</div>
    </div>
    <!-- 按钮 -->
    <div class="btn">
      <div class="look-order" @click="lookOrder">查看详情</div>
      <div class="break-home" @click="breakHome">返回首页</div>
    </div>
  </div>
</template>
<script>
export default {
    name:'paySuccess',
    data(){
        return {
            reason:[
                '',
                '退款',
                '退货',
                '换货',
            ],
        }
    },
    computed:{
        id:function(){
            return this.common.getUrlParam('id');
        },
        type:function(){
            return this.common.getUrlParam('type');
        }
    },
    methods:{
      // 返回上一页
      goBack(){
        history.back();
      },
      // 查看
      lookOrder(){
        location.href = './afterSaleDetails.html?id='+this.id+'&type='+this.type;
      },
      // 返回首页
      breakHome(){
        window.location.href = './index.html';
      }
    },
    components:{}
}
</script>
<style lang="less">
  @import "applyReturnSucess.less";
</style>
