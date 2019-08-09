<template>
  <div class="viewport">
    <!-- 头部返回 -->
    <div class="header">
      <span class="go-back" @click="goBack"></span>
      <div>订单详情</div>
    </div>
    <!-- 标题 -->
    <div class="page-title">{{ostatus}}</div>
    <!-- 人员信息 -->
    <div class="person-data">
      <img class="location" src="../../assets/detailed_stie.png" alt="">
      <div class="person-con">
        <div class="consignee"><span>{{consignee.consignee}}</span><span>{{consignee.telephone}}</span></div>
        <div>{{consignee.caddress}}</div>
      </div>
    </div>
    <!-- 商品组 -->
    <div class="shop-group">
      <!-- 主商品 -->
      <div class="shop-main" v-for="(shop,index) in shop_goods" :key="index">
        <div class="shop-main-img">
          <img :src="shop.gimg" alt="">
          <span class="give" v-if="shop.is_main==2"></span>
          <span class="orderMainLocal" v-if="shop.is_main==1"></span>
        </div>
        <div class="shop-main-data">
          <div class="shop-main-name">{{shop.gname}}</div>
          <div class="shop-main-spe" v-if="shop.skmname">规格: {{shop.skname}}</div>
          <div class="shop-main-price">
            <div>销售价：<span class="num">￥{{shop.sprice}}</span><span class="line">|</span>成本价：<span class="num">￥{{shop.cprice}}</span> </div>
            <span class="shop-main-buyNum">x{{shop.gnum}}</span>
          </div>
        </div>
      </div>
      <!-- 赠品列表 -->
      <div class="present-list" v-if="group_goods.length > 0">
        <div class="present-title">
          <span>其他商品组</span>
          <img @click="moreGroup" src="../../assets/open_close.png" alt="" v-if="moreGroupNum == 0&&group_goods.length>1">
          <img @click="packMoreGroup" style="transform:rotate(0deg);" src="../../assets/open_close.png" alt="" v-if="moreGroupNum > 0">
        </div>
        <div class="present-item" v-for="(group,index) in group_goods" :key="index" v-if="index <= moreGroupNum">
          <div class="present-store"><span class="store-ico"></span>{{group.shop_name}}</div>
          <div class="present-area">
            <div class="present-img">
              <img :src="group.gimg" alt="">
              <span class="give" v-if="group.is_main==2"></span>
              <span class="orderMainLocal" v-if="group.is_main==1"></span>
            </div>
            <div class="present-data">
              <div class="present-name">{{group.gname}}</div>
              <div class="present-spe" v-if="group.skname">规格: {{group.skname}}</div>
              <div class="present-price">
                <div>销售价：<span class="num">￥{{group.sprice}}</span></div>
                <span class="line" v-if="!isOnlyPresent">|</span>
                <div v-if="!isOnlyPresent">成本价：<span class="num">￥{{group.cprice}}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 订单信息 -->
    <div class="order-data">
      <div><span>订单编号：</span><span>{{order_data.order_no}}</span></div>
      <div><span>支付方式：</span><span>{{order_data.payway}}</span></div>
      <div><span>下单账号：</span><span>{{order_data.user}}</span></div>
      <div><span>支付时间：</span><span>{{order_data.paytime}}</span></div>
    </div>
    <!-- 收入区域 -->
    <div class="income-area">
      <div class="income"><span>本单收入</span><span>¥{{order_data.order_shop_sum}}</span></div>
      <div class=""><span>运费</span><span>¥{{order_data.order_express_fee}}</span></div>
    </div>
  </div>
</template>
<script>
  import common from '@/js/common'
  export default {
      name:'index',
      data(){
          return {
            isLocal: '', // 是否为本地
            ostatus: '', // 订单状态
            consignee: {},// 收货人信息
            order_data :{}, // 订单信息
            shop_goods: [], // 本店铺的商品列表
            group_goods: [], // 其他店铺商品
            moreGroupNum: 0,// 其他店铺商品显示数量
            isOnlyPresent: true,
          }
      },
      mounted(){
        var stoken = localStorage.getItem('stoken');
        if(!stoken){
            window.location.href='./shopLogin.html';
            return false;
        }
        this.isLocal = common.getUrlParam('isLocal')=='true'?true:false;
        this.request();
      },
      methods:{
        request(){
          var that = this;
          if(this.isLocal){
            this.dataService.storeOrderDetail({
              order_no: common.getUrlParam('order_no'),
              order_goods_no: common.getUrlParam("order_goods_no"),
              shop_id: common.getUrlParam('shop_id'),
            }).then(function(resp) {
              that.dataService.handleResponse({
                data: resp,
                callback: function(data){
                  that.disposeData(data)
                }
              })
            })
          }else{
            this.dataService.orderDetailSource({
              order_no: common.getUrlParam('order_no'),
              order_goods_no: common.getUrlParam("order_goods_no"),
              shop_id: common.getUrlParam('shop_id'),
            }).then(function(resp) {
              that.dataService.handleResponse({
                data: resp,
                callback: function(data){
                  that.disposeData(data)
                }
              })
            })
          }

        },
        // 处理数据
        disposeData(data){
          console.log(data);
          this.ostatus = data.ostatus==2?'待发货':data.ostatus==3?'已发货':data.ostatus==4?'已完成':'已关闭';
          if(this.isLocal){
            this.ostatus = data.ostatus==2?'待核销':data.ostatus==4?'已完成':'';
          }
          this.consignee = {
            consignee: data.consignee,
            telephone: data.telephone,
            caddress: data.caddress,
          };
          this.order_data = {
            order_no: data.order_no,
            payway: data.payway,
            user: data.user,
            paytime: data.paytime,
            order_shop_sum: data.order_shop_sum,
            order_express_fee: data.order_express_fee
          };
          this.shop_goods = data.shop_goods;
          this.group_goods = data.group_goods;
          for(let i = 0; i < data.shop_goods.length; i ++){
            if(data.shop_goods[i].is_main == 1){
              this.isOnlyPresent = false;
            }
          }
        },
        // 返回
        goBack(){
          window.location.href = 'storeOrder.html?isLocal=' + this.isLocal
        },
        // 更多商品
        moreGroup(){
          this.moreGroupNum = this.group_goods.length;
        },
        // 收起赠品
        packMoreGroup(){
          this.moreGroupNum = 0;
        }
      },
      computed: {
        singleIncome(){
          var price = 0;
          if((!this.isOnlyPresent)&&this.group_goods.length == 0){
            for(let i = 0; i < this.shop_goods.length; i ++){
              if(this.shop_goods[i].is_main == 1){
                price += Number(this.shop_goods[i].sprice);
              }
            }
            return price.toFixed(2);
          }
          if(this.isOnlyPresent){
            for(let i = 0; i < this.shop_goods.length; i ++){
              price += Number(this.shop_goods[i].cprice) + Number(this.shop_goods[i].express_fee);
            }
            return price.toFixed(2);
          }
          for(let i = 0; i < this.shop_goods.length; i ++){
            if(this.shop_goods[i].is_main == 1){
              price += Number(this.shop_goods[i].sprice);
            }
          }
          for(let i = 0; i < this.group_goods.length; i ++){
            price -= Number(this.group_goods[i].cprice) + Number(this.group_goods[i].express_fee);
          }
          return price.toFixed(2);
        }
      },
      components:{}
  }
</script>
<style lang="less">
  @import "storeOrderDetails.less";
</style>
