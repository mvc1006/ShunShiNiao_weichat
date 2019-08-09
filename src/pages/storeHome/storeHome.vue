<template>
  <div class="viewport">
    <!-- 头部返回 -->
    <div class="header">
      <span class="go-back" @click="goBack"></span>
      <div v-text='isTrading?"圈主中心":"我的店铺"'></div>
      <span class="setting" v-if="!isTrading" @click="setting"></span>
    </div>
    <!-- 店铺信息 -->
    <div class="store-area">
      <img class="store-img" :src="logo" alt="">
      <div class="store-data">
        <div class="store-name" @click='isTrading?isSelectTrading = true:""'>{{shop_name}} <span v-if='isTrading'></span></div>
        <div class="store-time">注册时间  {{create_time}}</div>
        <div class='trading-area' v-if="!isTrading">已加入商圈： <span v-text="area_name?area_name:'无'">{{area_name}}</span></div>
        <div class='trading-area' v-if="!isTrading">店铺启用状态： <span>{{status==1?'开启':'关闭'}}</span></div>
      </div>
    </div>
    <!-- 店铺功能 -->
    <div class="store-actions">
      <!-- 商品 -->
      <div class="store-actions-item" v-if="!isTrading" @click="storeActions('storeShop')">
        <img src="../../assets/store_shop.png" alt="">
      </div>
      <!-- 订单管理 -->
      <div class="store-actions-item" v-if="!isTrading" @click="storeActions('storeOrder')">
        <img src="../../assets/order_income.png" alt="">
      </div>
      <!-- <div class="store-actions-item" @click="storeActions()">
        <img src="../../assets/evaluate_regulate.png" alt="">
      </div> -->
      <!-- 收入资产 -->
      <div class="store-actions-item" @click="storeActions('shopIncome')">
        <img src="../../assets/income_property.png" alt="">
      </div>
      <!-- 招商合作 -->
      <div class="store-actions-item" v-if="!isTrading" @click="storeActions('attractCoop')">
        <img src="../../assets/enter_merchant.png" alt="">
      </div>
      <!-- 我的商家 -->
      <div class="store-actions-item" v-if="isTrading" @click="storeActions('myMerchant')">
        <img src="../../assets/my_merchant.png" alt="">
      </div>
      <div class="store-actions-item" v-for='i in 2'></div>
    </div>
    <!-- 二维码按钮 -->
    <div class="foot-suspension" v-if="!isTrading">
      <div class="weChat-btn" @click="goWeChat" v-if="superShop&&isLocal">
          <img src="../../assets/weChat_receipt.png" alt="">
        <span>二维码收款</span>
      </div>
      <!-- 二维码按钮 -->
      <div class="weChat-btn" @click="checkRatify" v-if="isLocal">
        <img src="../../assets/verification_img.png" alt="">
        <span>核销订单</span>
      </div>
    </div>
    <!-- 选择商圈 -->
    <div class="select_trading_shade" v-if='isSelectTrading' @click='isSelectTrading = false'></div>
    <div class="select_trading" v-if='isSelectTrading'>
      <div class="select_trading_title">选择商圈</div>
      <div class="select_trading_item" v-for='(trading,index) in tradingList' :key="index" @click="cutTrading(index)">
        <div class="select_trading_neme">{{trading.name}}</div>
        <div class="select_trading_type" :class="trading.isSelect?'active':''">√</div>
      </div>
    </div>
  </div>
</template>
<script>
  import wx from 'weixin-js-sdk';
  export default {
      name:'index',
      data(){
          return {
            isLocal: false,// 是否为本地商家
            shop_name: '', // 商家名称
            logo: '', // 商家图标
            create_time: '', // 入住时间
            mobile: '', // 商家手机号
            issetpwd: '', // 是否设置了密码
            superShop:false,
            area_name: '', // 加入的商圈名
            status: '', // 店铺是否开启
            area_id: '', // 商圈id
            isSelectTrading: false, // 是否选择商圈
            tradingList: [], // 商圈列表
          }
      },
      mounted(){
        this.common.goBack(this.goBack);
        if(this.isTrading){
          this.requestTrading();
        }else{
          this.request();
        }
      },
      computed: {
        isTrading(){
          return localStorage.getItem('isTrading')=="true"?true:false;
        }
      },
      methods:{
        // 请求后台 商家
        request(){
          var that = this;
          this.dataService.getShopInfo({}).then(function(resp){
            that.dataService.handleResponse({
              data: resp,
              callback: function(data){
                that.isLocal = data.is_local==0?false:true;
                that.shop_name = data.shop_name;
                that.logo = data.logo;
                that.create_time = data.create_time;
                that.mobile = data.mobile;
                that.issetpwd = data.issetpwd;
                that.superShop = data.is_super_shop;
                that.area_name = data.area_name;
                that.status = data.status
              }
            })
          })
        },
        // 请求后台 商圈
        requestTrading(){
          var that = this;
          this.dataService.getUserInfo({}).then(function(resp){
            that.dataService.handleResponse({
              data: resp,
              callback: function(data){
                if(data.manage_area.length>0){
                  var cutTradingNum = 0;
                  for(let i = 0;i<data.manage_area.length;i++){
                    if(i==0){
                      data.manage_area[i].isSelect = true;
                      continue;
                    }
                    data.manage_area[i].isSelect = false;
                    if(localStorage.getItem("area_id")==data.manage_area[i].area_id){
                      cutTradingNum = i;
                    }
                  }
                  that.tradingList = data.manage_area;
                  that.cutTrading(cutTradingNum)
                }
              }
            })
          })
        },
        // 返回
        goBack(){
        //   history.back(-1);
            location.href = './personCenter.html';
        },
        // 跳转设置
        setting(){
          window.location.href = './shopSet.html?issetpwd=' + this.issetpwd;
        },
        // 选择商圈
        cutTrading(num){
          let tradingList = this.tradingList;
          for(let i = 0; i<tradingList.length; i++){
            if(i == num){
              this.logo = tradingList[num].logo;
              this.shop_name = tradingList[num].name;
              this.create_time = tradingList[num].register_time;
              this.area_id = tradingList[num].area_id;
              this.tradingList[num].isSelect = true;
              localStorage.setItem("area_id",tradingList[num].area_id);
              continue;
            }
            this.tradingList[i].isSelect = false;
          }
          this.isSelectTrading = false;
        },
        // 店铺功能
        storeActions(type){
            window.location.href = './'+type+'.html?isLocal=' + this.isLocal;
        },
        goWeChat(){
            location.href = './superShopChat.html';
        },
        // 核销
        checkRatify(){
          var url = window.location.href.replace("http://192.168.0.134:8079",'https://dev.shunshiniao.net');
          var that = this;
          this.dataService.get_wxconfig({
            url: url
          }).then(function(resp) {
            that.dataService.handleResponse({
              data: resp,
              callback: function(data){
                wx.config({
                  debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                  appId: data.appId, // 必填，公众号的唯一标识
                  timestamp: data.timestamp, // 必填，生成签名的时间戳
                  nonceStr: data.nonceStr, // 必填，生成签名的随机串
                  signature: data.signature,// 必填，签名
                  jsApiList: ['scanQRCode','getLocation'] // 必填，需要使用的JS接口列表
                });
                wx.scanQRCode({
                  needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                  scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                  success: function (res) {
                    var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                    window.location.href = './checkShopData.html?result='+result
                  }
                });
              }
            })
          });
        },
      },
      components:{}
  }
</script>
<style lang="less">
  @import "storeHome.less";
</style>
