<template>
<div class="container">
    <div class="header-top">
        <div class="back">
            <div class="go-back" @click="goBack"></div>
        </div>
        <div class="title">关于我们</div>
    </div>
    <div class="about-us">
        <div class="logo-img">
            <img src="../../assets/logo.png" alt="">
        </div>
        <p class="cont-text">
            草木蔓发，春山可望。六下团组。连日来，习近平参加全国人大部分代表团审议和全国政协联组会，指明方向、提出要求、绘就蓝图。七年两会。2013年以来，总书记每年都会与代表委员真情互动、共商国是，谆谆嘱托、殷切鼓励。
十个妙喻。短语里展现的是绵绵长情，言简中透露的是浓浓深意。那些年，那些话，那些温暖记忆！让我们一起聆听习近平两会下团组那些精妙比喻，带着温暖和力量，在新时代的浩荡春风里努力奔跑！
        </p>
    </div>
</div>
</template>
<script>
export default {
    name:'app',
    data(){
        return {
            // clearBtn:false
        }
    },
    methods:{
        goBack:function(){ // 返回
            history.back();
        }
    }
}
</script>
<style lang="less">
    @import url('../../less/header.less');
    body{
        background: @background-color;
    }
    .about-us{
        background: @white-color;
        width: 100%;
        .flexGrow(1);
        .pxRem(padding-top,60);
        .pxRem(padding-right,32);
        .pxRem(padding-bottom,60);
        .pxRem(padding-left,32);
        box-sizing: border-box;
    }
    .logo-img{
        text-align: center;
        .pxRem(margin-bottom,20);
        img{
            .pxRem(width,62);
            .pxRem(height,64);
        }
    }
    .cont-text{
        .pxRem(font-size,28);
        .pxRem(line-height,44);
        color: @gray-text;
    }
</style>

