<template>
    <div class="container">
        <div class="header-top">
            <div class="back">
                <div class="go-back" @click="goBack"></div>
            </div>
            <div class="title">订单详情</div>
            <div class="goodGroup" v-if="showGroup" @click="groupShowHide">商品组</div>
        </div>
        <div class="order-info-cont">
            <template v-if="address">
                <div class="site">
                    <img class="site-img" src="../../assets/site-img.png" alt>
                    <div class="site-data">
                        <!-- 收货人 -->
                        <div class="consignee">
                            <div class="consignee-title">收货人:</div>
                            <div class="consignee-data">
                                <span>{{address.consignee}}</span>
                                <span>{{address.telephone}}</span>
                            </div>
                        </div>
                        <div class="consignee consignee-site">
                            <div class="consignee-title">收货地址:</div>
                            <div class="consignee-data">
                                <span>{{address.province}}{{address.city}}{{address.county}}{{address.address}}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <img class="colouredRibbon" src="../../assets/colouredRibbon.png" alt="">
            </template>
            <div class="goods-info">
                <order-pro :data="detailsData" :isDetails="true"></order-pro>
            </div>
             <!-- 商家信息 -->
            <div class="merchant" v-if="local && detailsData.order_status != 1">
                <div class="merchant-title">商家信息</div>
                <div class="merchant-area">
                <div class="merchant-data">
                    <div class="merchant-name"><img :src="shop_info.logo" alt=""><span>{{shop_info.shop_name}}</span></div>
                    <div class="merchant-particular">{{shop_info.addr}}</div>
                    <div class="merchant-site"><img src="../../assets/serve_unselected.png" alt=""><span>{{shop_info.distance}}</span></div>
                </div>
                <a class="telephone-box" @click="callTel(detailsData)"><img src="../../assets/telephone.png" alt=""></a>
                </div>
            </div>
            <div class="group" :style="{top:top + 'px'}" v-show="groupBtn" @click="hideGroup">
                <div class="group-list">
                    <div class="group-main-goods" @click="openDetails.stop(groupData)">
                        <div class="group-left-img">
                            <img :src="groupData.goods_pic" alt="">
                        </div>
                        <div class="group-right-info">
                            <p class="title">{{groupData.goods_name}}</p>
                            <p class="classify">{{groupData.spec_key_name}}</p>
                            <p class="bottom">
                                <span class="money">￥{{groupData.goods_price}}</span>
                                <span class="num">x{{groupData.goods_num}}</span>
                            </p>
                        </div>
                    </div>
                    <div class="group-give" v-if="groupData.give_count>0">
                        <div class="group-give-title">
                            <div class="left-ico shop-present-big-img"></div>
                            <div class="left-ico-text">已选赠品</div>
                        </div>
                        <ul class="group-give-list">
                            <li class="group-give-item"
                            v-for="(item,index) in groupData.give_list"
                            :key="index"
                             @click.stop="openDetails(item)">
                                <p class="img"><img :src="item.goods_pic" alt=""></p>
                                <p class="title">{{item.goods_name}}</p>
                                <p class="money">￥{{item.goods_price}}</p>
                            </li>
                        </ul>
                    </div>
                    <!-- 商品价值 -->
                    <div class="shop_group_price">
                        <div class="group-present-total">
                            (已选赠品价值：<span>¥{{groupData.total_give_price}}</span>)
                        </div>
                        <div class="total">
                            合计: <span>¥{{groupData.total_price}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <pop-up
        v-if="pop.show"
        :type="pop.type"
        :content="pop.content"
        :cancel="pop.cancel"
        :confirm="pop.confim"
        @popupcancel="popupcancel"
        @popupconfirm="popupconfirm">
        </pop-up>

        <!-- 扫码领券 -->
        <chat></chat>
    </div>
</template>
<script>
import orderPro from '@/components/myOrder/orderPro.vue';
import popUp from '@/components/popUp.vue';
import chat from '@/components/myOrder/chat.vue';
export default {
    name: "app",
    data() {
        return {
            detailsData:{},
            address:null,
            shop_info:{},
            groupData:{},
            pop:{
                show:false,
                type:2,
                content:'您确定要删除该订单吗？',
                cancel:'暂不',
                confirm:'确定'
            },
            top:0, // 商品组的定位
            groupBtn:false, // 商品组的展示
            isOpenMerchant: false,// 是否展开全部购买须知
            // 位置信息
            lng: '',
            lat: '',
            isShare: '',
        };
    },
    computed:{
        local:function(){
            let local = this.common.getUrlParam('local');
            let result = false;
            if(!local || local == '0'){
                result = false;
            }else{
                result = true;
            }
            return result;
        },
        showGroup:function(){
            let isShowGrop = this.common.getUrlParam('isShowGrop');
            let result = false;
            if(!isShowGrop || isShowGrop == '0' || this.isShare == 10 || this.isShare == 11){
                result = false;
            }else{
                result = true;
            }
            return result;
        }
    },
    methods: {
        goBack: function() {
            // 返回
            history.back();
        },
        hideGroup(){
            this.groupBtn = false;
            document.querySelector('.order-info-cont').style.overflow = 'auto';
        },
        callTel(data){
            this.dataService.userVtel({
                shop_id:data.shop_id,
                goods_type:data.goods_type
            });
        },
        groupShowHide(){
            let target = document.querySelector('.order-info-cont');
            this.groupBtn = !this.groupBtn;
            this.top = target.scrollTop;
            if(this.groupBtn){
                target.style.overflow = 'hidden';
            }else{
                target.style.overflow = 'auto';
            }
            if(!this.groupData.id){
                let params = {
                    order_goods_id:this.id,
                    get_all:1
                }
                this.dataService.orderDetails(params).then(resp=>{
                    this.dataService.handleResponse({
                        data:resp,
                        callback:(data)=>{
                            this.groupData = Object.assign({},data.order_info);
                        }
                    })
                })
            }
        },
        getData(){
            this.id = this.common.getUrlParam('id');
            let params = {
                order_goods_id:this.id
            }
            this.dataService.orderDetails(params).then(resp=>{
                this.dataService.handleResponse({
                    data:resp,
                    callback:(data)=>{
                        this.detailsData = Object.assign({},data.order_info);
                        if(data.user_address_info instanceof Array){
                            this.address = null;
                        }else{
                            this.address = Object.assign({},data.user_address_info);
                        }
                        this.shop_info = Object.assign({},data.shop_info);
                        this.isShare = data.order_info.union_goods_type;
                    }
                })
            })
        },
        popupconfirm(){
            this.delOrder();
        },
        popupcancel(){
            this.popStatus();
        },
        popStatus(){
            this.$nextTick(()=>{
                this.pop.show = false;
            })
        },
        popShow(){
            this.pop.show = true;
            this.pop.type = 2;
            this.pop.content = '您确定要删除该订单吗？';
        },
        delSucess(){
            this.pop.show = false;
            this.$nextTick(()=>{
                this.pop.show = true;
                this.pop.type = 1;
                this.pop.content = '取消订单成功';
                history.back();
            })
        },
        delOrder(data){
            this.dataService.delMyOrder({
                order_id:this.orderId
            }).then((resp)=>{
                this.dataService.handleResponse({
                    data:resp,
                    callback:(data)=>{
                        this.$eventBus.$emit('delOrderSuccess',this.orderId)
                        this.delSucess();
                    }
                })
            })
        },
        // 展开全部购买须知
        openMerchant(){
          this.isOpenMerchant = true
        },
        openDetails(data){
            const local = (data.goods_type == 1)?0:1;
            const isBuyPresent = (data.tab_type == 1)?true:false;
            location.href = './sourceShopDetails.html?id='+data.goods_id + '&local='+local+'&isBuyPresent='+isBuyPresent;
        }
    },
    mounted(){
        this.getData();
        this.$eventBus.$on('delOrderPop',(data)=>{
            this.orderId = data;
            this.popShow();
        })
    },
    components:{
        orderPro,
        popUp,
        chat
    }
};
</script>
<style lang="less">
@import url("../../less/header.less");
body {
    background: @background-color;
}
.container{
    .pxRem(font-size,24);
}
.goodGroup {
    .pxRem(font-size, 24);
    color: @gray-text;
}
.order-info-cont{
    .flexGrow(1);
    overflow: auto;
    position: relative;
}
.goods-info{
    .pxRem(margin-left,16);
    .pxRem(margin-right,16);
}
.mian-goods{
    width: 100%;
    margin-bottom: 0 !important;
}
// 收货地址
.site{
  .flex();
  justify-content: space-between;
  align-items: center;
  .pxRem(padding-left,20);
  .pxRem(padding-right,20);
  .pxRem(padding-top,32);
  .pxRem(padding-bottom,32);
  .pxRem(margin-top,20);
  .pxRem(min-height,120);
  background: @white-color;
  color: @gray-light-text;
}
.site>img{
  flex-shrink: 0;
}
.site-img{
  .pxRem(width,44);
  .pxRem(height,44);
}
.select-site{
  .pxRem(width,28);
  .pxRem(height,28)
}
// 收货地址信息
.consignee{
  line-height: 1;
  .flex();
  color: @gray-text;
  .pxRem(margin-bottom,10)
}
.consignee-data{
  .flex();
  justify-content: space-between;
  flex-grow: 1;
}
.site-data{
  flex-grow: 1;
  .pxRem(padding-left,16);
  .pxRem(padding-right,30)
}
.consignee-site{
  .pxRem(line-height,32);
  .pxRem(font-size,20);
  .consignee-title{
      .flexShrink(0)
  }
}
// 彩带
.colouredRibbon{
  display: block;
  width: 100%;
  .pxRem(height,8);
  .pxRem(margin-bottom,16);
}
// 商家信息
.merchant{
  .pxRem(padding,20);
//   .borderTop(20,#F3F3F3);
  background:@white-color;
  .pxRem(margin-top,20);
}
.merchant-title{
  color: @gray-light-text;
  font-weight: bold;
  border-bottom: 1px solid @background-color;
  .pxRem(padding-bottom,20);
}
.merchant-content{
  .pxRem(max-height,200);
  overflow: hidden;
}
// 商家信息内容
.merchant-area{
  .flex();
  .alignItems();
  .pxRem(padding-top,35);
  .pxRem(padding-bottom,12);
  .alignContent(stretch)
}
.merchant-data{
  .pxRem(width,558);
  .pxRem(font-size,22);
  color: @gray-light-text;
  .flexShrink(0);
  .borderRight(2);
}
.merchant-name{
  .flex();
  .alignItems();
  .pxRem(font-size,26);
  font-weight: bold;
}
.merchant-name>img{
  .pxRem(width,28);
  .pxRem(height,28);
  .pxRem(margin-right,16)
}
.merchant-particular{
  .pxRem(margin-top,20);
  .pxRem(margin-bottom,20);
}
.merchant-site{
  .flex();
  .alignItems();
}
.merchant-site>img{
  .pxRem(width,24);
  .pxRem(height,24);
  .pxRem(margin-right,16)
}
// 电话
.telephone-box{
  .flexGrow(1);
  .flex();
  .justifyContent();
  .alignItems();
}
.telephone-box>img{
  .pxRem(width,48);
  .pxRem(height,48);
}
// 购买须知
.purchase-notes{
  line-height: 1;
}
.purchase-notes-title{
  .pxRem(margin-top,25);
  .pxRem(margin-bottom,20);
  color: #FF9629;
}
.purchase-more{
  .flex();
  .alignItems();
  .justifyContent();
  .pxRem(line-height,64);
  color: @red-color;
  .pxRem(font-size,24);
}
.purchase-more>img{
  .pxRem(width,28);
  .pxRem(margin-left,16)
}

.group{
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    top: 0;
    left: 0;
    z-index: 10;
}

.group-list{
    .pxRem(padding-left,30);
    .pxRem(padding-right,30);
    background: @white-color;
    .pxRem(border-bottom-left-radius,8);
    .pxRem(border-bottom-right-radius,8);
}
.shop_group_price{
    .flex();
    .justifyContent(flex-end);
    .alignItems(center);
    .pxRem(line-height,48);
    width: 100%;
    background: @white-color;
    flex-shrink: 0;
    flex-grow: 0;
}
.group-present-total{
    .pxRem(font-size,20);
    .pxRem(margin-right,32);
    >span{
        color: @red-color;
    }
}
.total>span{
    color: @red-color;
}
.group-main-goods{
    .pxRem(padding-top,30);
    .pxRem(padding-bottom,30);
    .flex();
    .group-left-img{
        .flexGrow(0);
        .flexShrink(0);
        .pxRem(width,160);
        .pxRem(height,160);
        .borderRadius(8);
        overflow: hidden;
        .pxRem(margin-right,16);
    }
    .group-right-info{
        .flexGrow(1);
        .flex(column);
        .justifyContent(space-between);

        .title{
            .pxRem(font-size,24);
            .pxRem(line-height,36);
            color: @gray-text;
        }
        .classify{
            .pxRem(font-size,20);
            color: @gray-light-text;
            .pxRem(line-height,60);
        }
        .bottom{
            .flex();
        }
        .money{
            color: @red-color;
            .pxRem(font-size,26);
            .flexGrow(1);
        }
        .num{
            .pxRem(font-size,24);
            color: @gray-text;
        }
    }
}
.group-give{
    .pxRem(padding-top,30);
    .pxRem(padding-bottom,30);
    .borderTop(2,@border-color,dashed);
}
.group-give-title{
    .flex();
    .alignItems();
}
.left-ico-text{
    color: @red-color;
    .pxRem(font-size,28);
}
.group-give-list{
    .pxRem(margin-top,20);
    .flex();
}
.group-give-item{
    .pxRem(width,120);
    .pxRem(margin-right,14);
    // .pxRem(height,120);
    .img{
        width: 100%;
        .pxRem(height,120);
        .borderRadius(8);
        overflow: hidden;
        img{
            width: 100%;
            height: 100%;
        }
    }
    .title{
        .pxRem(font-size,20);
        color: @gray-text;
        .pxRem(line-height,34);
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .money{
        .pxRem(font-size,20);
        color: @red-color;
        text-decoration: line-through;
    }
}

</style>

