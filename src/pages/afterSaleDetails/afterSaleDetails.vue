<template>
    <div class="container">
        <div class="header-top">
            <div class="back" @click="goBack">
                <div class="go-back"></div>
            </div>
            <div class="title">{{reason[type]}}详情</div>
        </div>
        <div class="detais-cont">
            <div class="status">
                <template v-if="proData.refund_status == 1">
                    <img src="../../assets/waiting.png" alt="">
                    <p class="text">{{proData.refund_status_desc}}</p>
                </template>
                <template v-else-if="proData.refund_status == 2 || proData.refund_status == 3">
                    <img src="../../assets/pass.png" alt="">
                    <p class="text">{{proData.refund_status_desc}}</p>
                </template>
                <template v-else-if="proData.refund_status == 10 || proData.refund_status == 11 || proData.refund_status == 0">
                    <img src="../../assets/close.png" alt="">
                    <p class="text">{{proData.refund_status_desc}}</p>
                </template>
            </div>
            <template v-if="proData.refund_status == 1">
                <div class="description">
                    <template v-if="type == 3">
                        商家同意您的换货申请前，无法预留商品库存，请联系商家尽快处理
                    </template>
                    <template v-else-if="type == 2">
                        您已成功发起退货申请，请耐心等待商家处理
                    </template>
                    <template v-else>
                        您已成功发起退款申请，请耐心等待商家处理
                    </template>
                </div>
                <ul class="tips-list">
                    <!-- 换货 -->
                    <template v-if="type == 3">
                        <li class="tips-item">若商家同意：换货申请达成，请您及时退货</li>
                        <li class="tips-item">若商家拒绝：换货申请将关闭，您可以联系商家协助处理</li>
                    </template>
                    <!-- 退货 -->
                    <template v-else-if="type == 2">
                        <li class="tips-item">若商家同意：退款申请达成，请您及时退货</li>
                        <li class="tips-item">若商家拒绝：换货申请将关闭，您可以联系商家协助处理</li>
                    </template>
                    <!-- 退款 -->
                    <template v-else>
                        <li class="tips-item">若商家同意：系统将退款给你</li>
                        <li class="tips-item">若商家拒绝：退款申请将关闭，您可以联系商家协助处理</li>
                    </template>
                </ul>
                <div class="ctrl-btns">
                    <div class="cancel-order" @click="cancelBtn">撤销申请</div>
                </div>
            </template>

        </div>
        <div class="pro-info">
            <h2>{{reason[type]}}信息</h2>
            <after-sale-pro :data="proData"></after-sale-pro>
            <ul class="order-time-list">
                <li class="orter-time-item"><span class="name">{{reason[type]}}原因</span><span class="numer">{{proData.refund_reason}}</span></li>
                <li class="orter-time-item"><span class="name">{{reason[type]}}数量</span><span class="numer">{{proData.goods_num}}</span></li>
                <li class="orter-time-item"><span class="name">申请时间</span><span class="numer">{{proData.refund_time}}</span></li>
                <li class="orter-time-item"><span class="name">{{reason[type]}}编号</span><span class="numer">{{proData.order_refund_no}}</span></li>
            </ul>
        </div>
        <a class="tel" href="tel:4000870687">
            <span class="telephone-ico"></span>
            <span class="text">拨打电话</span>
        </a>

        <pop-up
        v-if="pop.show"
        :type="pop.type"
        :content="pop.content"
        :cancel="pop.cancel"
        :confirm="pop.confirm"
        @popupconfirm="confirm"
        @popupcancel="cancel"></pop-up>
    </div>
</template>
<script>
import afterSalePro from '@/components/afterSaleProSmall.vue';
import popUp from '@/components/popUp';
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
            proData:{},
            pop:{
                show:false,
                type:2,
                content:'本次申请撤销后，您将不能再次发出申请，请您确定是否撤销申请',
                cancel:'再想想',
                confirm:'确定',
            }
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
        goBack(){
            history.back();
        },
        getData(){
            this.dataService.returnDetails({
                order_refund_id:this.id
            }).then(resp=>{
                this.dataService.handleResponse({
                    data:resp,
                    callback:(data)=>{
              console.log(data)
                        this.proData = Object.assign({},data);
                    }
                })
            })
        },
        confirm(){
            this.popStatus();
            this.cancelReturn();
        },
        cancel(){
            this.popStatus();
        },
        popStatus(){
            this.$nextTick(()=>{
                this.pop.show = false
            })
        },
        cancelBtn(){
            this.pop.show = true;
        },
        cancelReturn(){
            this.dataService.cancelReturn({
                order_refund_id:this.id
            }).then(resp=>{
                this.dataService.handleResponse({
                    data:resp,
                    callback:(data)=>{
                       this.proData.refund_status = 0;
                    }
                })
            })
        }
    },
    created(){
        this.getData();
    },
    components:{
        afterSalePro,
        popUp
    }
}
</script>
<style lang="less">
@import url('../../less/header.less');
body{
    background: @background-color;
}
.tel{
    .flex();
    .alignItems();
    .justifyContent();
    .borderTop(2);
    background: @white-color;
    .text{
        .pxRem(font-size,24);
        .pxRem(line-height,96);
        color: @simple-gray-color;
        .pxRem(margin-left,20);
    }
}
.detais-cont{
    .pxRem(padding-top,30);

    background: @white-color;
    .status{
        text-align: center;
        img{
            .pxRem(width,48);
            .pxRem(height,48);
        }
        .text{
            color: @red-color;
            .pxRem(font-size,28);
            .pxRem(padding-top,30);
            .pxRem(padding-bottom,30);
        }
        .borderBottom(2);
    }
    .description{
        .pxRem(font-size,26);
        .pxRem(line-height,36);
        color: @gray-text;
        .pxRem(margin-left,16);
        .pxRem(margin-right,16);
        .pxRem(padding-top,30);
        .pxRem(padding-bottom,30);
        .borderBottom(2);
    }
    .tips-list{
        .pxRem(margin-left,16);
        .pxRem(margin-right,16);
        .pxRem(padding-top,20);
        .pxRem(padding-bottom,20);
        .tips-item{
            .pxRem(font-size,24);
            .pxRem(line-height,64);
            color: @gray-light-text;
            list-style: disc outside;
            .pxRem(margin-left,40);
        }
    }
}
.ctrl-btns{
    .flex();
    .alignItems(center);
    .justifyContent(flex-end);
    .pxRem(padding-left,16);
    .pxRem(padding-right,16);
    .cancel-order{
        .pxRem(width,160);
        .pxRem(height,64);
        .pxRem(line-height,64);
        text-align: center;
        .borderRadius(32);
        .pxRem(font-size,24);
        .border(2,@simple-gray-color);
        color:@simple-gray-color;
        .pxRem(margin-left,20);
        .pxRem(margin-bottom,30);
    }
}
.group-main-goods{
    .pxRem(padding-left,16);
    .pxRem(padding-right,16);
}
.pro-info{
    .pxRem(margin-top,16);
    background: @white-color;
    h2{
        .pxRem(font-size,28);
        color: @gray-text;
        .pxRem(line-height,96);
        .pxRem(padding-left,16);
        .pxRem(padding-right,16);
        .borderBottom(2);
    }
}

.order-time-list{
    .pxRem(margin-top,20);
    .pxRem(padding-top,20);
    .pxRem(padding-right,16);
    .pxRem(padding-bottom,30);
    .pxRem(padding-left,16);
    .borderTop(2,@border-color,dashed);
    .orter-time-item{
        .flex();
        .justifyContent(space-between);
        .alignItems();
    }

    .name{
        .pxRem(font-size,20);
        .pxRem(line-height,40);
        color: @simple-gray-color;
    }
    .number{
        .pxRem(font-size,20);
        .pxRem(line-height,40);
        color: @gray-text;
    }
}
</style>
