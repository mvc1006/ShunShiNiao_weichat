<template>
    <div class="container">
        <div class="header-top">
            <div class="title">付款</div>
        </div>
        <div class="pay-cont">
            <div class="pay-title">
                <div class="left">
                    <p class="title">付款给商家</p>
                    <p class="name">{{shopInfo.shop_name}}</p>
                </div>
                <div class="right">
                    <img :src="shopInfo.shop_logo" alt="">
                </div>
            </div>
            <div class="pay-write">
                <p class="write-title">金额</p>
                <p class="white-cont">
                    <span class="money-ico">￥</span>
                    <input type="number" class="number" placeholder="请输入金额" v-model="money">
                </p>
                <div class="confim-btn" @click="confim" :class="{'disabled':!money}">付款</div>
            </div>
        </div>
        <popUp v-if="isPopUp" :type="1" :content="popContent"></popUp>
    </div>
</template>
<script>
  import popUp from '@/components/popUp.vue'
export default {
    name:'pay',
    data(){
        return {
            isPopUp: false,
            popContent: '',
            money:'',
            regSpace:/\s+/g,
            shopInfo:{}
        }
    },
    computed:{
        shopId:function(){
            return this.common.getUrlParam('shop_id');
        },
        goodsType:function(){
            return this.common.getUrlParam('goods_type');
        }
    },
    mounted(){
        this.getShoInfo();
        this.$eventBus.$on('closePopup',()=>{
          this.isPopUp = false
        })
    },
    methods:{
        getShoInfo(){
            this.dataService.shopInfo({
                shop_id:this.shopId,
                goods_type:this.goodsType
            }).then(resp=>{
                this.dataService.handleResponse({
                    data:resp,
                    callback:(data)=>{
                        this.shopInfo = data;
                    }
                })
            })
        },
        confim(){
          let money = this.money.replace(this.regSpace,'');
            if(!money || Number(money) <= 0){
                this.isPopUp = true;
                this.popContent = '请输入正确的金额';
                return;
            }
            this.createPay();
        },
        createPay(){
            this.dataService.superShopCreateOrder({
                shop_id:this.shopId,
                money:this.money
            }).then(resp=>{
                this.dataService.handleResponse({
                    data:resp,
                    callback:(data)=>{
                        location.href = data.url;
                    }
                })
            })
        }
    },
    components:{
      popUp
    }
}
</script>
<style lang="less">
@import url('../../less/header.less');
body{
    background: @background-color;
}
.pay-cont{
    .pxRem(margin,20);
    background: @white-color;
    .borderRadius(10,border-bottom-left-radius);
    .borderRadius(10,border-bottom-right-radius);
}
.pay-title{
    background: #fcf1ef;
    .pxRem(padding,20);
    .flex();
    .alignItems();
    .left{
        .flex(column);
        .justifyContent(space-between);
        .flexGrow(1);
        .title{
            color: @gray-text;
        }
        .name{
            color: @gray-light-text;
        }
    }
    .right{
        .pxRem(width,110);
        .pxRem(height,110);
        .borderRadius(10);
        overflow: hidden;
        img{
            width: 100%;
            height: 100%;
        }
    }

}
.pay-write{
    .pxRem(padding-left,30);
    .pxRem(padding-right,30);
    .pxRem(padding-top,80);
    .pxRem(padding-bottom,100);
}
.write-title{
    color: @gray-light-text;
    .pxRem(font-size,24);
}
.white-cont{
    .pxRem(padding-top,40);
    .pxRem(padding-bottom,40);
    .borderBottom(2);
    .flex();
    .alignItems();
    .money-ico{
        .pxRem(min-width,40);
        .pxRem(font-size,40);
        font-weight: bold;
        color: @gray-text;
        text-align:center;
        .pxRem(margin-right,10);
    }
    .number{
        border: 0;
        outline: 0;
        .flexGrow(1);
        .pxRem(font-size,28);
    }
}

.confim-btn{
    width: 100%;
    color: @white-color;
    background:@red-color;
    .pxRem(line-height,80);
    text-align: center;
    .pxRem(font-size,28);
    .borderRadius(40);
    .pxRem(margin-top,140);
    &.disabled{
        opacity: 0.6;
    }
}
</style>
