<template>
<div class="mian-goods">
    <shop-title :data="data" :rightInfo="true"></shop-title>
    <div class="goods-info" @click="openOrderDetails(data)">
        <div class="goods-info-left">
            <img class="pro-img" :src="data.goods_pic" alt="">
            <template v-if="data.order_status == 1">
                <img v-if="data.goods_type == 1" class="small-tag" src="../../assets/orderMainSource.png" alt="">
                <img v-else-if="data.goods_type == 2" class="small-tag" src="../../assets/orderMainLocal.png" alt="">
            </template>
           <template v-else>
                <img class="small-tag-main" v-if="data.is_main == 1" src="../../assets/orderMain.png" alt="">
                <img class="small-tag-give" v-else-if="data.is_main == 2" src="../../assets/corner_marker_present.png" alt="">
           </template>
        </div>
        <div class="goods-info-right">
            <p class="goods-name">{{data.goods_name}}</p>
            <div class="goods-classify">{{data.spec_key_name}}</div>
            <div class="goods-price" v-if="data.is_main == 1">
                <span class="goods-now-price">￥{{data.goods_price}}</span>
                <span class="goods-main-payed" v-if="[2,3,4].includes(data.order_status) && data.give_list" >[已付款]</span>
                <span class="goods-cost-price" v-else-if="data.goods_type != 3 && Number(data.shop_price) < Number(data.market_price)">￥{{data.market_price}}</span>
                <span class="goods-num">×{{data.goods_num}}</span>
            </div>
            <div class="goods-detail" v-else>
                <span class="give-cost-price">￥{{data.goods_price}}</span>
                <span class="give-now-price">￥0.00</span>
                <span class="goods-num">×{{data.goods_num}}</span>
            </div>
        </div>
    </div>
    <div class="express-way">
        <span class="express-title">配送方式</span>
        <template v-if="data.goods_type == 1">
            <span class="express-name">快递</span>
            <span class="express-price">{{countExpress(data.express_fee)}}</span>
        </template>
        <template v-else>
            <span class="express-name">线下消费</span>
        </template>
    </div>
    <!-- 1 特价 3 尖叫卡 不能选择赠品 -->
    <div class="give-goods" v-if="showGive(data)">
        <div class="give-goods-title" v-if="data.order_status == 1 || data.give_count <= 0">
            <span class="shop-present-big-img"></span>
            <span class="give-text">已选赠品</span>
            <template v-if="data.give_count<=0&&(data.order_status == 1||data.order_status == 2||data.order_status == 3)" >
                <audioFront :isPlay='isPlay'></audioFront>
                <div class="give-add" @click="goAddGive(data)"><img src="../../assets/select_give.gif" alt=""></div>
            </template>
        </div>
        <ul class="give-list" v-if="data.give_count>0">
            <li class="give-item"
            v-for="(item,index) in data.give_list"
            :key="index">
                <div class="left-give-classify local-pro-ico" :class="{'line':item.goods_type == 2}"></div>
                <div class="right-give-info">
                    <shop-title :data="item"></shop-title>
                    <div class="give-goods-info" @click="openOrderDetails(item)">
                        <div class="give-goods-info-left">
                            <img :src="item.goods_pic" alt="">
                        </div>
                        <div class="give-goods-info-right">
                            <p class="goods-name">{{item.goods_name}}</p>
                            <p class="goods-detail">
                                <span class="give-cost-price">￥{{item.goods_price}}</span>
                                <span class="give-now-price">￥0.00</span>
                                <span class="give-goods-color">{{item.spec_key_name}}</span>
                            </p>
                        </div>
                    </div>
                     <div class="express-way">
                        <span class="express-title">配送方式</span>
                        <template v-if="item.goods_type == 1">
                            <span class="express-name">快递</span>
                            <span class="express-price">{{countExpress(item.express_fee)}}</span>
                        </template>
                        <template v-else>
                            <span class="express-name">线下消费</span>
                        </template>
                    </div>
                </div>
            </li>
        </ul>
        <div class="no-give-list" v-if="data.order_status != 6 && data.order_status != 4 && data.give_count <= 0">
           <img src="../../assets/present.png" alt="">
			<div>还有超多赠品可以选择哟~赶紧去看看</div>
        </div>
    </div>
    <div class="goods-total present">
        共<span v-text="data.total_goods_num|| (data.goods_num + (data.give_list?data.give_list.length:0))"></span>件商品
        <span class="give_totle_price" v-if="data.order_status == 1">
            (赠品价值: <span class="money">¥{{data.total_give_price||'0.00'}}</span>)
        </span>
        
    </div>
    <div class="goods-total">
        <span class="total-money">
            合计：<span class="money">￥{{parseFloat(data.need_pay_price) > 0 ? data.need_pay_price : data.total_price}}</span>
        </span>
        (含快递费{{postPrice(data)}}.00元)
    </div>

    <ul class="order-time-list" v-if="isDetails">
        <li class="orter-time-item remark" v-if="data.remark"><span class="name">订单备注</span><span class="number">{{data.remark}}</span></li>
        <li class="orter-time-item"><span class="name">商品组编号</span><span class="number">{{data.union_order_no}}</span></li>
        <li class="orter-time-item"><span class="name">订单编号</span><span class="number">{{data.order_no}}</span></li>
        <li class="orter-time-item"><span class="name">创建时间</span><span class="number">{{data.create_time}}</span></li>
        <template v-if="data.order_status >= 2 && !data.give_list">
                <li class="orter-time-item"><span class="name">付款时间</span><span class="number">{{data.pay_time}}</span></li>
        </template>
        <template v-if="data.order_status >= 3">
                <li class="orter-time-item"><span class="name">发货时间</span><span class="number">{{data.deliver_time}}</span></li>
        </template>
        <template v-if="data.order_status >= 4">
                <li class="orter-time-item"><span class="name">成交时间</span><span class="number">{{data.finish_time}}</span></li>
        </template>
    </ul>

    <!-- 待付款  状态为1 -->
    <div class="ctrl-btns" v-if="data.order_status == 1">
        <div class="cancel-order" @click="delOrder(data)">取消订单</div>
        <div class="canform-order" @click="goPay(data)">立即付款</div>
    </div>
    <!-- 待付款  状态为2  此时 主品付款  后又反选主品 -- 赠品需要付款 -->
    <div class="ctrl-btns" v-if="data.order_status == 2 && data.give_list">
        <div class="cancel-order" @click="delOrder(data)">取消订单</div>
        <div class="canform-order" @click="goPay(data)">立即付款</div>
    </div>
    <!-- 待发货 待使用-->
    <div class="ctrl-btns" v-else-if="data.order_status == 2 && data.goods_type != 3">
        <template v-if="[0,1,2].includes(data.activity_id) && isDetails">
            <div class="cancel-order" v-if="data.is_main == 1" @click="remind(data)">申请退款</div>
            <div class="cancel-order" v-if="data.is_main == 2" @click="replaceGood(data)">申请换货</div>
        </template>

        <div class="cancel-order" v-if="data.goods_type == 1" @click="noticeSend(data,$event)">提醒发货</div>
        <div class="canform-order" v-else @click="userChit(data)">扫码验券</div>
    </div>
    <!-- 已发货 -->
    <div class="ctrl-btns" v-else-if="data.order_status == 3">
        <template v-if="data.activity_id == 0 && isDetails">
            <div class="cancel-order" v-if="data.is_main == 1" @click="remind(data)">申请退换</div>
            <div class="cancel-order" v-if="data.is_main == 2" @click="replaceGood(data)">申请换货</div>
        </template>

        <div class="cancel-order" @click="findExpress(data)">查看物流</div>
        <div class="canform-order" @click="confirmOrder(data)">确认收货</div>
    </div>
    <!-- 待评价 -->
    <div class="ctrl-btns" v-else-if="data.order_status == 4">
        <template v-if="data.goods_type == 1 && data.activity_id == 0 && isDetails">
            <div class="cancel-order" v-if="data.is_main == 1" @click="remind(data)">申请退换</div>
            <div class="cancel-order" v-if="data.is_main == 2" @click="replaceGood(data)">申请换货</div>
            <div class="cancel-order" @click="findExpress(data)">查看物流</div>
        </template>
        <div class="canform-order" v-if="data.is_comment == 0" @click="goAppraise(data)">立即评价</div>
    </div>
    <!-- 待评价 -->
    <div class="ctrl-btns" v-else-if="data.order_status == 6">
        <div class="cancel-order" @click="delOrder(data)">删除订单</div>
    </div>
</div>
</template>
<script>
import shopTitle from '@/components/shopTitle.vue';
import audioFront from '@/components/audioFront'
export default {
    props:{
        data:{
            type:Object,
            default:()=>{
                return {}
            }
        },
        // 是否为订单详情页
        isDetails:{
            type:Boolean,
            default:()=>{
                return false;
            }
        }
    },

    data(){
        return {
            sys:false,
            isPlay: true,
        }
    },
    mounted(){
        // this.$eventBus.$on('changeIsPlay',() => {
        //     alert(11111)
        //     this.isPlay = !this.isPlay;
        // })
    },
    methods:{
        showGive(data){
            return data.is_main == 1 && ![4, 6].includes(Number(data.order_status)) && data.give_limit != 0;
        },
        // 处理物流显示方式
        countExpress(val){
            if(val == 0){
                return '免邮';
            }else{
                return val + '元';
            }
        },
        // 计算物流价格
        postPrice(data){
            let price = Number(data.express_fee);
            if(data.order_status == 2 && data.give_list){
                price = 0;
            }
            if(data.give_list){
                for(let i=0;i<data.give_list.length;i++){
                    price += Number(data.give_list[i].express_fee);
                }
            }
            return price;
        },
        // 查看订单详情
        openOrderDetails(data){
            const local = (data.goods_type == 1)?0:1;
            if(this.isDetails){
                const isBuyPresent = (data.is_main == 1)?true:false;
                location.href = './sourceShopDetails.html?id='+data.goods_id + '&local='+local+'&isBuyPresent='+isBuyPresent;
            }else{
                let isShowGrop = 0;
                if(data.order_status == 1 || data.order_status == 6 || (data.order_status == 2 && data.give_list)){
                    isShowGrop = 0;
                }else{
                    isShowGrop = 1;
                }
                this.$eventBus.$emit('goDetails');
                location.href = './orderDetails.html?id='+data.id + '&local='+local+'&isShowGrop='+isShowGrop;
            }
        },
        // 删除订单
        delOrder(data){
            this.$eventBus.$emit('delOrderPop',data.order_id);
        },
        // 支付
        goPay(data){
            location.href = data.url;
        },
        // 确认收货
        confirmOrder(data){
            this.dataService.confirmOrder({
                order_goods_id:data.id
            }).then(resp=>{
                this.dataService.handleResponse({
                    data:resp,
                    callback:()=>{
                        location.href = './receivinged.html?id='+data.id;
                    }
                })
            })
        },
        // 去评价
        goAppraise(data){
            location.href = './appraise.html?id='+data.id;
        },
        // 查看物流
        findExpress(data){
            location.href = './express.html?id='+data.id;
        },
        // 提醒发货
        noticeSend(val,event){
            if(val.notice){
                alert('已提醒发货');
                return;
            }
            this.dataService.remindDelivery({
                order_goods_id:val.id
            }).then(resp=>{
                this.dataService.handleResponse({
                    data:resp,
                    callback:(data)=>{
                        val.notice = true;
                        event.target.innerHTML = '已提醒发货';
                        alert('提醒发货成功');
                    }
                })
            })
        },
        // 申请退换 -- 主商品
        remind(data){
            location.href = './afterSale.html?id='+data.id+'&type=1';
        },
        // 申请换货 -- 赠品
        replaceGood(data){
            location.href = './afterSale.html?id='+data.id+'&type=2';
        },
        // 使用代金券
        userChit(data){
            this.$eventBus.$emit('userChit',data.id)
        },
        goAddGive(data){
            var ssn_shopGroup = {  // 商品组数据
                mainShop: {
                    order_status: data.order_status,
                    goods_id:  data.goods_id,
                    goods_name:  data.goods_name,
                    thumb_img:  data.goods_pic,
                    store_count:  data.store_count,
                    actualSpe:  data.item_id,
                    actualPrice:  data.goods_price.split(',').join(""),
                    shopBuyNum:  data.goods_num,
                    selectedSpe:  data.spec_key_name,
                    activity_id: data.activity_id,
                    goods_type: data.goods_type,
                    give_count: data.give_count,
                },
                presentList:[],
            };
            localStorage.setItem("ssn_shopGroup",JSON.stringify(ssn_shopGroup));
            localStorage.setItem("order_id",JSON.stringify(data.order_id));
            localStorage.setItem("main_order_goods_id",JSON.stringify(data.id));
            location.href = './selectShop.html?id='+data.goods_id + '&buyPresent=false&laterSelect='+ data.order_id;
        }
    },
    components:{
        shopTitle,
        audioFront
    }
}
</script>
<style lang="less">
    @import url('../../less/common.less');
    .mian-goods{
        .pxRem(font-size,24);
    }
    @import url('../../less/orderPro.less');
    .audio-box{
        .pxRem(margin-right,30)
    }
</style>
