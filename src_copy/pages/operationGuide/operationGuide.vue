<template>
    <div class="viewport">
        <!-- 头部 -->
		<div class="header">
			<span class="go-back" @click="goBack"></span>
			<div>操作指南</div>
		</div>
        <img src="http://imgs.shunshiniao.net/frontapp/imgs/operationGuide1.png" alt="">
        <img src="http://imgs.shunshiniao.net/frontapp/imgs/operationGuide2.png" alt="">
        <img src="http://imgs.shunshiniao.net/frontapp/imgs/operationGuide3.png" alt="">
    </div>
</template>
<script>
export default {
    name:'operationGuide',
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
    .viewport{
        .pxRem(padding-top,96);
        max-width: 720px;
        margin: 0 auto;
    }
    .viewport>img{
        width: 100%;
    }
    // 头部
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
		.store-search{
			position: absolute;
			.pxRem(right,60);
			.pxRem(width,50);
		}
	}
</style>

