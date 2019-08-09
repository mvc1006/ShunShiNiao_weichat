<template>
	<div class="viewport">
		<!-- 头部 -->
		 <div class="header">
			<!-- <span class="go-back" @click="goBack"></span> -->
			<div>抽奖海报</div>
		</div>
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
	// 图片列表
	.imgList{
		>img{
			width: 100%;
			display: block;
		}
	}
</style>
