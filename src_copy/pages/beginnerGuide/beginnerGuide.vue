<template>
    <div class="viewport">
        <!-- 头部返回 -->
        <div class="header">
            <span class="go-back" @click="goBack"></span>
            <div>新手指南</div>
        </div>
        <!-- 图文区域 -->
        <div class="imgArea">
            <img src="../../assets/beginnerGuide1.png" alt="">
            <img src="../../assets/beginnerGuide2.png" alt="">
            <img src="../../assets/beginnerGuide3.png" alt="">
            <img src="../../assets/beginnerGuide4.png" alt="">
            <img src="../../assets/beginnerGuide5.png" alt="">
        </div>
    </div>
</template>
<script>
    export default {
        name:'app',
        data(){
            return {
                
            }
        },
        methods:{
            goBack(){
                history.back();
            }
        },
        components:{
            
        }
    }
</script>
<style lang="less">
    *{
        box-sizing: border-box;
    }
    body{
        background: @background-color;
    }
    .viewport{
        max-width: 720px;
        margin: 0 auto;
        background-size: 100%;
        height: 100%;
        color: @gray-text;
        .pxRem(font-size,24);
        .pxRem(padding-top,96);
        >div{
            background: @white-color;
        }
    }
    @import "../../less/common.less";
    /* 头部 */
    .header{
        position: fixed;
        width: 100%;
        left: 0;
        top: 0;
        .pxRem(line-height,56);
        .pxRem(font-size,28);
        .pxRem(padding,20);
        .flex();
        .alignItems();
        .justifyContent(space-between);
        .borderBottom(1);
        background: @white-color;
        z-index: 99999;
        >div{
            width: 100%;
            text-align: center;
        }
        >.go-back{
            position: absolute;
            .pxRem(left,30);
            .pxRem(width,16);
        }
    }
</style>

