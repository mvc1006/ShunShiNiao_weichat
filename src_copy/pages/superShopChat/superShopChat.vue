<template>
    <div class="container">
        <div class="header-top">
            <div class="back" @click="goBack">
                <div class="go-back"></div>
            </div>
            <div class="title">二维码收款</div>
        </div>
        <div class="chat-cont">
            <div class="cont-title">
                <span class="ico"></span>
                <span class="name">二维码收款</span>
            </div>
            <div class="chat">
                <p class="chat-title">扫二维码向我付款</p>
                <p class="chat-img">
                    <img :src="img" alt="">
                </p>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name:'paySuccess',
    data(){
        return {
            img:''
        }
    },
    mounted(){
        this.newChat();
    },
    methods:{
        goBack(){
            history.back();
        },
      confirmClick(){
        location.href = './storeHome.html';
      },
      newChat(){
        const token = localStorage.getItem('stoken');
        let url = this.dataService.baseURL+'/wxapi/shop_base/superCashQrCode?&stoken='+token;
        this.img = url;
      }
    },
    components:{}
}
</script>
<style lang="less">
@import url('../../less/header.less');
body{
    background: @background-color;
}
.chat-cont{
    .pxRem(margin,20);
    background: @white-color;
    .borderRadius(10,border-bottom-left-radius);
    .borderRadius(10,border-bottom-right-radius);
}
.cont-title{
    .flex();
    .alignItems();
    background: #fcf1ef;
    .pxRem(padding,20);
    .ico{
        .pxRem(width,27);
        .pxRem(height,31);
        background: url('../../assets/weChat-title.png') no-repeat;
        background-size:100%;
    }
    .name{
        .pxRem(font-size,24);
        color:@red-color;
        .pxRem(margin-left,20);
    }
}
.chat{
    .pxRem(padding-left,120);
    .pxRem(padding-right,120);
    .pxRem(padding-top,70);
    .pxRem(padding-bottom,70);
}
.chat-title{
    .pxRem(margin-bottom,20);
    .pxRem(font-size,24);
}
.chat-img{
    .pxRem(width,414);
    .pxRem(height,414);
    img{
        width: 100%;
        height: 100%;
    }
}
</style>
