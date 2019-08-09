<template>
  <div class="viewport">
    <!-- 头部返回 -->
    <div class="header">
      <span class="go-back" @click="goBack"></span>
      <div>核对信息</div>
    </div>
    <!-- 商品信息 -->
    <div class="shop-item">
      <div class="shop-img">
        <img :src="checkShopData.goods_pic" alt="">

      </div>
      <div class="shop-data">
        <div class="shop-name">{{checkShopData.goods_name}}</div>
        <div class="shop-time">支付时间：{{checkShopData.pay_time}}</div>
        <div class="shop-price">
          <span>销售价：<span class="num">￥{{checkShopData.goods_price}}</span></span>
          <span class="shop-num">X{{checkShopData.goods_num}}</span>
        </div>
      </div>
    </div>
    <!-- 联系人 -->
    <div class="linkman">
      <span>联系人：{{checkShopData.consignee}}</span>
      <span>{{checkShopData.telephone}}</span>
    </div>
    <!-- 订单信息 -->
    <div class="order-title">订单信息</div>
    <div class="order-list">
      <div class="order-item"><span>订单号码</span><span>{{checkShopData.order_no}}</span></div>
      <div class="order-item"><span>下单时间</span><span>{{checkShopData.create_time}}</span></div>
      <div class="order-item"><span>支付方式</span><span>在线支付</span></div>
      <div class="order-item"><span>核销次数</span><span>{{checkShopData.check_time}}</span></div>
    </div>
    <div class="confirm" @click="confirm">确认核销</div>
    <!-- 页面弹窗提示 -->
    <popUp v-if="isPopUp" :type="1" :time="popupTime" :content="popupContent"></popUp>
  </div>
</template>
<script>
  import common from '@/js/common';
  import popUp from '../../components/popUp.vue';
  export default {
      name:'index',
      data(){
          return {
            checkShopData: {},
            order_goods_id: '', // 子订单编号
            isPopUp: false,
            popupTime: 3000,
            popupContent:'',
          }
      },
      mounted(){
        this.order_goods_id = common.getUrlParam('result');
        this.request();
      },
      methods:{
        request(){
          var that = this;
            this.dataService.checkOrderInfo({
            order_goods_id: this.order_goods_id
          }).then(function(resp) {
            that.dataService.handleResponse({
              data: resp,
              callback: function(data){
                that.checkShopData = data;
              },
              callback1001:function(data){
                that.isPopUp = true;
                that.popupContent = data;
                setTimeout(function(){
                  that.goBack();
                },that.popupTime)
              }
            })
          });
        },
        // 返回
        goBack(){
          history.back(-1);
        },
        // 确认核销
        confirm(){
          var that = this;
          this.dataService.doCheckOrderCode({
            order_goods_id: this.order_goods_id
          }).then(function(resp) {
            if(resp.data.code==1000){
              that.isPopUp = true;
              that.popupContent = '核销成功';
              setTimeout(function(){
                that.goBack();
              },that.popupTime)
            }
          });
        }
      },
      components:{
        popUp
      }
  }
</script>
<style lang="less">
  @import "checkShopData.less";
</style>
