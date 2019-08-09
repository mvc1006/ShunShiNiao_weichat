<template>
	<div class="viewport">
		<!-- 头部 -->
		 <div class="header">
			<span class="go-back" @click="goBack"></span>
			<div>报名成功</div>
		</div>
		<!-- 中间内容 -->
		<div class="main">
			<img src="../../assets/duihao.png" alt="">
			<div class="title">报名成功</div>
			<!-- <div class="content">中奖结果将于6月1日视频公开抽奖~</div>
			<div class="content">您的信息将导入第三方抽奖软件~</div>
			<div class="content">千元大礼包更在每日抽奖等你来拿！</div> -->



			<div class="content">您的信息将导入第三方抽奖软件</div>
			<div class="content">6月1日由视频公开抽奖，保证公平公正</div>
			<!-- <div class="content">保证公平公正</div> -->
			<div class="content">中奖信息将公布在顺势鸟商城中</div>
		</div>
		<!-- 新人专享按钮 -->
		<div class="newButton" @click="goNewExclusive">进入新人专享专区</div>
		<div class="newButton" @click="goEverydayAward">进入每日抽奖专区</div>
		<!-- 图片区域 -->
		<div class="imgList">
			<img src="../../assets/award_img1.jpg" alt="">
			<img src="../../assets/award_img2.jpg" alt="">
			<img src="../../assets/award_img3.jpg" alt="">
			<img src="../../assets/award_img4.jpg" alt="">
			<!-- <img src="../../assets/award_img5.jpg" alt=""> -->
		</div>
	</div>
</template>
<script>
	import hint from '../../components/hintArea.vue';
	import popUp from '../../components/popUp.vue';
	export default {
		name:'index',
		data(){
			return {
				
			}
		},
		// 初始化函数
		mounted(){
			
		},
		computed:{
			
		},
		// 定义函数
		methods:{
			// 返回首页
			goBack(){
				window.location.href = './localService.html'
			},
			// 跳转新人专享
			goNewExclusive(){
				window.location.href = './newExclusive.html'
			},
			// 跳转每日抽奖
			goEverydayAward(){
				window.location.href = './awardActivity.html'
			}
		},
		components:{
			
		}
	}
</script>
<style lang="less">
	@import '../../less/common';
	.viewport{
		max-width: 720px;
		width: 100%;
		margin: 0 auto;
		.pxRem(padding-top,96);
		.pxRem(font-size,24);
		color: @gray-text;
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
	}
	// 主要内容
	.main{
		img{
			display: block;
			margin: 0 auto;
			.pxRem(margin-top,60);
			.pxRem(width,160);
			.pxRem(height,160);

		}
		.title{
			.pxRem(margin-top,32);
			.pxRem(margin-bottom,32);
			.pxRem(font-size,32);
			color: @gray-text;
			text-align: center;
		}
		.content{
			.pxRem(font-size,24);
			color: @red-color;
			text-align: center;
		}
	}
	// 新人专享专区按钮
	.newButton{
		.pxRem(line-height,96);
		.pxRem(font-size,34);
		.pxRem(margin-top,50);
		.pxRem(margin-left,24);
		.pxRem(margin-right,24);
		.pxRem(border-radius,16);
		background: @red-color;
		color: @white-color;
		text-align: center;
	}
	// 图片列表
	.imgList{
		.pxRem(margin-top,30);
		// .pxRem(padding-left,24);
		// .pxRem(padding-right,24);
		>img{
			width: 100%;
			display: block;
		}
	}
</style>
