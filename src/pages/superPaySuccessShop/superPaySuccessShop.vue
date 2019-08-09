<template>
    <div class="container">
        <div class="ico-cont">
            <img class="img" src="../../assets/duihao.png" alt="">
            <p>收款成功</p>
        </div>
        <ul class="info-list">
            <li class="info-item">
                <span class="left">收款金额</span>
                <span class="right">￥150</span>
            </li>
        </ul>
        <div class="confirm-btn" @click="confirmClick">确定</div>
    </div>
</template>
<script>
export default {
    name:'paySuccess',
    data(){
        return {}
    },
    mounted(){
    },
    methods:{
      confirmClick(){
        location.href = './storeHome.html';
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
.ico-cont{
    .pxRem(margin-top,180);
    text-align: center;
    img{
        .pxRem(width,160);
        .pxRem(height,160);
    }
    p{
        .pxRem(font-size,48);
        .pxRem(margin-top,50);
        color: @gray-text;
        font-weight: 600;
    }
}
.info-list{
    .pxRem(margin-top,120);
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
    .pxRem(margin-top,100);
}
</style>
