<template>
    <div class="container">
        <div class="ico-cont">
            <img class="img" src="../../assets/duihao.png" alt="">
            <p>支付成功</p>
        </div>
        <ul class="info-list">
            <li class="info-item">
                <span class="left">付款金额</span>
                <span class="right">￥{{money}}</span>
            </li>
            <li class="info-item">
                <span class="left">收款人</span>
                <span class="right">{{shopName}}</span>
            </li>
        </ul>
        <div class="confirm-btn" @click="confirmClick">
            查看订单
        </div>
        <div class="wechat-photo" v-if="is_subscribe == '0'">
            <p class="photo">
                <img src="static/img/super-wechat.png" alt="" />
            </p>
            <p class="big-text">长按识别二维码关注公众号</p>
            <p class="small-text">关注后领超值赠品</p>
        </div>
    </div>
</template>
<script>
export default {
    name:'paySuccess',
    data(){
        return {}
    },
    computed:{
        money:function(){
            return this.common.getUrlParam('amount')
        },
        shopName:function(){
            return decodeURI(this.common.getUrlParam('shop_name'))
        },
        is_subscribe:function(){
            return this.common.getUrlParam('is_subscribe')
        }
    },
    methods:{
      confirmClick(){
        location.href = './order.html#/local/all';
      },
    },
    components:{}
}
</script>
<style lang="less">
@import url('../../less/header.less');
body{
background: @white-color;
}
.wechat-photo{
    .pxRem(margin-top,60);
    .photo{
        text-align: center;
        img{
            .pxRem(width,244);
            .pxRem(height,244);
        }
    }
    .big-text{
        .pxRem(margin-top,44);
        .pxRem(font-size,32);
        color: @gray-text;
        text-align: center;
    }
    .small-text{
        .pxRem(margin-top,20);
        .pxRem(font-size,28);
        color: @gray-light-text;
        text-align: center;
    }
}
.ico-cont{
    .pxRem(margin-top,60);
    text-align: center;
    img{
        .pxRem(width,160);
        .pxRem(height,160);
    }
    p{
        .pxRem(font-size,48);
        .pxRem(margin-top,60);
        color: @gray-text;
        font-weight: 600;
    }
}
.info-list{
    .pxRem(margin-top,80);
    .pxRem(padding-left,100);
    .pxRem(padding-right,100);
}
.info-item{
    .flex();
    .alignItems();
    .justifyContent(space-between);
    .pxRem(font-size,30);
    .pxRem(line-height,80);
    .left{
        color:@gray-light-text;
    }
    .right{
        color:@gray-text;
    }
}
.confirm-btn{
    .pxRem(margin-left,140);
    .pxRem(margin-right,140);
    .pxRem(line-height,74);
    .border(2,#a4d50a);
    .borderRadius(10);
    text-align: center;
    .pxRem(font-size,24);
    color: #a4d50a;
    .pxRem(margin-top,80);
}
</style>
