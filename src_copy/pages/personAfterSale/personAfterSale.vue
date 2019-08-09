<template>
<div class="container">
    <div class="header-top">
        <div class="back" @click="goBack">
            <div class="go-back"></div>
        </div>
        <div class="title">退款/售后</div>
    </div>
    <scroll class="goods-list" :isEnd="isEnd" :upBack="upBack" :downBack="downBack" v-if="list.length>0">
        <div class="mian-goods" v-for="(data,index) in list" :key="index">
            <div class="goods-title" v-if="!data.is_overseas" @click="openStore(data)">
                <div class="title-ico store-ico"></div>
                <div class="title-store-name">{{data.shop_name}}</div>
                <div class="title-next-ico next-ico"></div>
            </div>
            <div class="goods-info" @click="openOrderDetails(data)">
                <div class="goods-info-left">
                    <img class="pro-img" :src="data.goods_pic" alt="">
                    <img v-if="data.is_main==2" class="small-tag" src="../../assets/corner_marker_present.png" alt="">
                    <img v-else-if="data.goods_type == 1" class="small-tag" src="../../assets/orderMainSource.png" alt="">
                    <img v-else-if="data.goods_type == 2" class="small-tag" src="../../assets/orderMainLocal.png" alt="">
                </div>
                <div class="goods-info-right">
                    <p class="goods-name">{{data.goods_name}}</p>
                    <div class="goods-classify">{{data.spec_key_name}}</div>
                    <div class="goods-price" v-if="data.is_main == 1">
                        <span class="goods-now-price">￥{{data.goods_price}}</span>
                        <span class="goods-cost-price">￥{{data.market_price}}</span>
                        <span class="goods-num">×{{data.goods_num}}</span>
                    </div>
                    <div class="goods-detail" v-else>
                        <span class="give-cost-price">￥{{data.goods_price}}</span>
                        <span class="give-now-price">￥0.00</span>
                        <span class="goods-num">×{{data.goods_num}}</span>
                    </div>
                </div>
            </div>
            <div class="status-now">
                <!-- 退款  refund_type 1 -->
                <img class="ico" src="../../assets/money-back.png" alt="" v-if="data.refund_type == 1">
                <!-- 退货  refund_type 2 -->
                <img class="ico" src="../../assets/replace-good.png" alt="" v-else-if="data.refund_type == 2">
                <!-- 换货  refund_type 3 -->
                <img class="ico" src="../../assets/return-money.png" alt="" v-else-if="data.refund_type == 3">
                <span class="   ">{{data.refund_status_desc}}</span>
            </div>
            <div class="give-goods" v-if="data.order_status == 1 || (data.order_status == 2 && data.give_list)">
                <div class="give-goods-title">
                    <span class="shop-present-big-img"></span>
                    <span class="give-text">已选赠品</span>
                </div>
                <ul class="give-list" v-if="data.give_list">
                    <li class="give-item"
                    v-for="(item,index) in data.give_list"
                    :key="index">
                        <div class="left-give-classify local-pro-ico" :class="{'line':item.goods_type == 2}"></div>
                        <div class="right-give-info">
                            <div class="goods-title" v-if="!data.is_overseas" @click="openStore(item)">
                                <div class="store-ico"></div>
                                <div class="title-store-name">{{item.shop_name}}</div>
                                <div class="title-next-ico next-ico"></div>
                            </div>
                            <div class="give-goods-info" @click="openOrderDetails(item)">
                                <div class="give-goods-info-left">
                                    <img :src="item.goods_pic" alt="">
                                </div>
                                <div class="give-goods-info-right">
                                    <p class="goods-name">{{item.goods_name}}</p>
                                    <p class="goods-detail">
                                        <span class="give-cost-price">￥{{item.market_price}}</span>
                                        <span class="give-now-price">￥0.00</span>
                                        <span class="give-goods-color">{{item.spec_key_name}}</span>
                                    </p>
                                </div>
                            </div>
                            <div class="status-now">
                                <!-- 退款  refund_type 1 -->
                                <img class="ico" src="../../assets/money-back.png" alt="" v-if="data.refund_type == 1">
                                <!-- 退货  refund_type 2 -->
                                <img class="ico" src="../../assets/replace-good.png" alt="" v-else-if="data.refund_type == 2">
                                <!-- 换货  refund_type 3 -->
                                <img class="ico" src="../../assets/return-money.png" alt="" v-else-if="data.refund_type == 3">
                                <span class="text">{{data.refund_status_desc}}</span>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </scroll>
    <no-data v-else></no-data>
</div>
</template>
<script>
import scroll from '@/components/scroll.vue'
import noData from '@/components/myFav/personalNoData'
import history from '@/js/history'
export default {
    name:'app',
    data(){
        return {
            page:1,
            list:[],
            isEnd:false,
            canLoading:false
        }
    },
    mounted(){
        history.init(this);
        this.common.goBack(this.goBack);
        let storage = history.getData();
        if(storage){
            this.historyBack(storage)
        }else{
            this.getList();
        }
    },
    methods:{
        historyBack({items,scrollY,maxScroll}){
            this.list = items.list;
            this.canLoading = true;
            this.page = items.page;
            this.isEnd = items.isEnd;
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
        goBack:function(){ // 返回
            history.clearData();
            location.href = './personCenter.html'
        },
        upBack(){
            if(this.canLoading){
                this.page++;
                this.getList(true)
            }
        },
        downBack(){
            if(this.canLoading){
                this.page = 1;
                this.getList();
                this.isEnd = false;
            }
        },
        getList(load){
            history.clearData();
            var that = this;
            this.canLoading = false;
            this.dataService.returnList({
                page:this.page
            }).then(function(resp){
                that.dataService.handleResponse({
                    data:resp,
                    callback:function(data){
                      if(load){
                        if(data.length>0){
                          that.list = that.list.concat(data);
                        }else{
                          that.isEnd = true;
                        }
                      }else{
                        that.list = [].concat(data);
                      }
                      that.$nextTick(function(){
                          if(that.$refs.scroll && that.$refs.scroll.scroll){
                              that.$refs.scroll.scroll.refresh();
                          }
                      });
                      that.canLoading = true;
                    },
                })
            })
        },
        openStore(data){
            this.$eventBus.$emit('goDetails')
            let local = data.goods_type == 1 ?true:false
            location.href = './storeMerchant.html?shop_id='+data.shop_id + '&local='
            + local + "&shop_name=" + encodeURIComponent(data.shop_name)
        },
        openOrderDetails(data){
          this.$eventBus.$emit('goDetails')
            location.href = './afterSaleDetails.html?id='+data.order_refund_id + '&type='+data.refund_type;
        }
    },
    components:{
        scroll,
        noData,
    }
}
</script>
<style lang="less">
    @import url('../../less/header.less');
    @import url('../../less/orderPro.less');
    body{
        background: @background-color;
    }
    .goods-title{
        .pxRem(margin-bottom,20);
    }
    .goods-list{
        .pxRem(margin-top,16);
        .pxRem(padding-left,16);
        .pxRem(padding-right,16);
        .flexGrow(1);
        overflow: auto;
    }
    .status-now{
        .flex();
        .alignItems();
        .ico{
            .pxRem(width,26);
            .pxRem(height,26);
            .pxRem(margin-right,16);
        }
        .text{
            .pxRem(font-size,24);
            color: @gray-text;
            .pxRem(line-height,80);
        }
    }

</style>

