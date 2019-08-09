<template>
  <div style="height:100%">
    <!-- 头部返回 -->
    <div class="header">
      <span class="go-back" @click="goBack"></span>
      <div>订单管理</div>
    </div>
    <scroll ref="scroll" :upBack="upBack" :downBack="downBack" :isEnd="isEnd">
      <div class="viewport">
        <!-- 搜索区域 -->
        <div class="search-area" v-if="!isSearch">
          <span class="header-logo"></span>
          <div class="search" @click="search">
            <span class="store-search"></span>
            <span>商品</span>
            <span>手机号</span>
            <span>姓名</span>
          </div>
        </div>
        <div class="search-area" v-if="isSearch">
          <input class="search searchInput" v-focus='isFocus' @keydown.enter="inputCarriage" v-model="keywords" type="text">
          <img class="delete" @click="deleteInput" src="../../assets/delete.png" v-if="keywords!=''">
          <span class="search-name" @click="searchClick">{{keywords?'搜索': '取消'}}</span>
        </div>
        <!-- 切换菜单本地 -->
        <div v-if="isLocal" class="cutMenu">
          <div :class="orderState==1?'active':''" @click="cutMenu(1)">
            <p>{{wait_order_sum}}</p>
            <p>待核销</p>
          </div>
          <div :class="orderState==2?'active':''" @click="cutMenu(2)">
            <p>{{ok_order_sum}}</p>
            <p>已完成</p>
          </div>
          <div :class="orderState==3?'active':''" @click="cutMenu(3)">
            <p>{{refund_order_sum}}</p>
            <p>退款/售后</p>
          </div>
          <div :class="orderState==4?'active':''" @click="cutMenu(4)">
            <p>{{close_order_sum}}</p>
            <p>已关闭</p>
          </div>
        </div>
        <!-- 切换菜单源头 -->
        <div class="cutMenu" v-if="!isLocal">
          <div :class="orderState==1?'active':''" @click="cutMenu(1)">
            <p>{{wait_order_sum}}</p>
            <p>待发货</p>
          </div>
          <div :class="orderState=='2'?'active':''" @click="cutMenu('2')">
            <p>{{ship_order_sum}}</p>
            <p>已发货</p>
          </div>
          <div :class="orderState==3?'active':''" @click="cutMenu(3)">
            <p>{{ok_order_sum}}</p>
            <p>已完成</p>
          </div>
          <div :class="orderState==4?'active':''" @click="cutMenu(4)">
            <p>{{refund_order_sum}}</p>
            <p>退款/售后</p>
          </div>
          <div :class="orderState==5?'active':''" @click="cutMenu(5)">
            <p>{{close_order_sum}}</p>
            <p>已关闭</p>
          </div>
        </div>
        <!-- 商品列表 -->
        <div class="store-shop-item" v-for="(good,index) in shopDataList" :key="index" @click="goToDetails(index)">
          <div class="shop-img">
            <img :src="good.gimg" alt="">
            <img class="corner-mark main" v-if="good.is_main==1" src="../../assets/orderMain.png" alt="">
            <img class="corner-mark present" v-if="good.is_main==2" src="../../assets/corner_marker_present.png" alt="">
          </div>
          <div class="shop-data">
            <div class="shop-name">
              <span>{{good.gname}}</span>
              <div v-if="isLocal">
                <span v-if="orderState==1">待核销</span>
                <span v-if="orderState==2">已完成</span>
                <span v-if="orderState=='3'&&good.restatus==1">待商家处理</span>
                <span v-if="orderState=='3'&&good.restatus==10">商家拒绝</span>
                <span v-if="orderState=='3'&&good.restatus==11">平台拒绝</span>
                <span v-if="orderState==4">已关闭</span>
              </div>
              <div v-if="!isLocal">
                <span v-if="orderState==1">待发货</span>
                <span v-if="orderState==2">已发货</span>
                <span v-if="orderState==3">已完成</span>
                <span v-if="orderState==4&&good.restatus==1">待商家处理</span>
                <span v-if="orderState==4&&good.restatus==10">商家拒绝</span>
                <span v-if="orderState==4&&good.restatus==11">平台拒绝</span>
                <span v-if="orderState==5">已关闭</span>
              </div>
            </div>
            <div class="shop-time">支付时间：{{good.paytime}}</div>
            <div class="shop-price" v-if="isLocal">
              <div><p>销售价：<span>￥{{good.sprice}}</span></p><p>成本价：<span>￥{{good.cprice}}</span></p></div>
              <div v-if="orderState==1" class="verify" @click.stop="checkRatify">核销</div>
              <div v-if="orderState=='3'" class="verify" @click.stop="contactBuyer(index)">联系买家</div>
              <!--<div v-if="orderState=='4'" class="verify">同意退款</div>-->
            </div>
            <div class="shop-price" v-if="!isLocal">
              <div><p>销售价：<span>￥{{good.sprice}}</span></p><p>成本价：<span>￥{{good.cprice}}</span></p></div>
              <div v-if="orderState==1" class="verify" @click.stop="shipments(index)">发货</div>
              <div v-if="orderState==2" class="verify" @click.stop="lookLogistics(index)">查看物流</div>
              <div v-if="orderState==4" class="verify" @click.stop="contactBuyer(index)">联系买家</div>
              <!--<div v-if="orderState==5" class="verify">同意退款</div>-->
            </div>
          </div>
        </div>
        <!-- 没有订单 -->
        <div class="not-available" v-if="shopDataList.length == 0">
          <img src="../../assets/no_shopkeeper.png" alt="">
          <div class="text">暂无订单数据</div>
        </div>
      </div>
    </scroll>
    <popUp v-if="isPopup" :type="2" :content="popContent" :confirm="'呼叫'" @popupconfirm="consentRefund" @popupcancel="isPopup = false"></popUp>
  </div>
</template>
<script>
  import common from '@/js/common';
  import popUp from "@/components/popUp.vue";
  import wx from 'weixin-js-sdk';
  import scroll from '@/components/scroll';
  import history from '@/js/history'
  export default {
      name:'storeOrder',
      data(){
          return {
            canLoading:true, // 是否加载完成
            isEnd:false, // 分页加载是否结束
            pages: 1, // 分页加载
            isPopup: '', // 是否显示弹窗
            popContent: '',// 弹窗内容
            isLocal: '', // 是否为本地商家
            shop_id: 1,// 店铺id
            orderState: 1,// 订单状态
            wait_order_sum: '',// 待核销订单数
            ok_order_sum: '', // 已完成订单数
            refund_order_sum: '', // 退款/售后订单数
            close_order_sum: '',// 已完成订单数
            ship_order_sum: '', // 已发货订单数
            shopDataList: [],
            isLoading: false ,// 是否加载中
            keywords: '', // 搜索关键词
            isSearch: false, // 是否开始搜索
            isFocus: false, // 是否聚焦
          }
      },
      mounted(){
        history.init(this);
        let storage = history.getData();
        if(storage){
            this.historyBack(storage)
        }else{
            let type = this.$route.path.substr(5);
            this.isLocal = common.getUrlParam('isLocal')=='true'?true:false;
            this.cutMenu(type);
            if(type == this.orderState){
                this.request();
            }
        }
      },
      methods:{
        historyBack({items,scrollY,maxScroll}){
            this.canLoading = true;
            this.pages = items.pages;
            this.isEnd = items.isEnd;

            this.isLocal = items.isLocal;
            this.shop_id = items.shop_id;
            this.orderState = items.orderState;
            this.wait_order_sum = items.wait_order_sum;
            this.ok_order_sum = items.ok_order_sum;
            this.refund_order_sum = items.refund_order_sum;
            this.close_order_sum = items.close_order_sum;
            this.ship_order_sum = items.ship_order_sum;
            this.shopDataList = items.shopDataList;
            this.isLoading = items.isLoading;
            this.keywords = items.keywords;
            this.isSearch = items.isSearch;
            this.isFocus = items.isFocus;

            this.$nextTick(()=>{
                let time = setInterval(() => {
                    let scroll = this.$refs.scroll.scroll;
                    if(scroll){
                        scroll.refresh();
                        scroll.maxScrollY = maxScroll;
                        scroll.scrollTo(0,scrollY,0);
                        clearInterval(time);
                    }
                }, 100);
            })
        },
        request(){
            history.clearData();
          var that = this;
          if(this.isLocal){
            this.dataService.orderList({
              shop_id: this.shop_id,
              otype: this.orderState,
              page: this.pages,
              keywords: this.keywords,
            }).then(function(resp) {
              that.dataService.handleResponse({
                data: resp,
                callback: function(data){
                  that.disposeData(data)
                }
              })
            })
          }else{
            this.dataService.orderListSource({
              shop_id: this.shop_id,
              otype: this.orderState,
              page: this.pages,
              keywords: this.keywords,
            }).then(function(resp) {
              that.dataService.handleResponse({
                data: resp,
                callback: function(data){
                  that.disposeData(data)
                }
              })
            });
          }
        },
        // 处理数据
        disposeData(data){
          if(this.pages==1){
            this.shopDataList = [];
          }
          if(data.data.length==0){
            this.isEnd = true
          }
          this.shopDataList = this.shopDataList.concat(data.data);
          this.wait_order_sum = data.wait_order_sum;
          this.ok_order_sum = data.ok_order_sum;
          this.refund_order_sum = data.refund_order_sum;
          this.close_order_sum = data.close_order_sum;
          this.ship_order_sum = data.ship_order_sum;
          this.$nextTick(()=>{
            this.$refs.scroll.scroll.refresh();
          })
        },
        // 返回
        goBack(){
            history.clearData();
          window.location.href = './storeHome.html';
        },
        // 切换菜单
        cutMenu(type){
          if(this.orderState == type) return false;
          history.clearData();

          this.orderState = type;
          this.$router.push('menu'+type);
          this.shopDataList = [];
          this.isEnd = false;
          this.pages = 1;
          this.request();
        },
        // 跳转详情
        goToDetails(num){
            this.$eventBus.$emit('goDetails')
          if((this.isLocal&&this.orderState==3)||(!this.isLocal&&this.orderState==4)){
            window.location.href = './storeOrderDispose.html?order_no='+this.shopDataList[num].order_no+'&shop_id='+this.shop_id + '&order_goods_no=' + this.shopDataList[num].order_goods_no;
            return false;
          }
          window.location.href = './storeOrderDetails.html?order_no='+this.shopDataList[num].order_no+'&shop_id='+this.shop_id+'&isLocal='+this.isLocal+"&order_goods_no=" + this.shopDataList[num].order_goods_no;
        },
        // 搜索
        search(){
          this.isSearch = true;
          this.isFocus = true;
        },
        // 点击回车
        inputCarriage(){
          this.pages = 1;
          this.request();
        },
        // 清空input
        deleteInput(){
          this.keywords = '';
        },
        // 点击搜索
        searchClick(){
          if(this.keywords){
            document.getElementsByClassName("searchInput")[0].blur();
            this.request();
          }else{
            this.isSearch = false;
            this.isFocus = false;
            this.canLoading = true;
            this.request();
            
          }
        },
        // 联系买家
        contactBuyer(num){
          if(this.isLoading) return false;
          this.isLoading = true;
          this.dataService.userTel({
              order_no: this.shopDataList[num].order_no,
            }).then((resp) => {
              this.dataService.handleResponse({
                data: resp,
                callback: (data) => {
                  this.isPopup = true;
                  this.popContent = data.tel;
                  this.isLoading = false;
                }
              })
            });
        },
        // 呼叫
        consentRefund(){
          window.location.href = "tel:" + this.popContent;
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
        // 发货
        shipments(num){
          window.location.href = './storeShipments.html?order_no='+this.shopDataList[num].order_no+'&shop_id='+this.shop_id+'&order_goods_no='+this.shopDataList[num].order_goods_no;
        },
        // 查看物流
        lookLogistics(num){
          window.location.href = './express.html?id='+this.shopDataList[num].order_goods_id + '&order_no='+this.shopDataList[num].order_no + '&order_goods_no='+this.shopDataList[num].order_goods_no;
        },
        // 上拉刷新
        upBack(){
          if(this.canLoading){
            this.pages ++;
            this.request();
          }
        },
        // 下拉刷新
        downBack(){
          if(this.canLoading){
            this.pages = 1;
            this.shopDataList = [];
            this.isEnd = false;
            this.request();
          }
        }
      },
      directives: {
        focus: {
          inserted (el,{value}) {
            if(value){
                el.focus()
            }
          }
        }
      },
      components:{
        popUp,
        scroll
      }
  }
</script>
<style lang="less">
  @import "storeOrder.less";
  .mescroll{
    height:100%;
  }
</style>
