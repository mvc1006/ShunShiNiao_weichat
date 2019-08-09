<template>
	<div class="viewport">
		<!-- 头部 -->
		 <div class="header">
			<span class="go-back" @click="goBack"></span>
			<div>招商合作</div>
		</div>
		<!-- 招商合作类型 -->
		<ul class="type-list">
			<li class="type-item" @click="circleCollaborate(1)">
				<div class="ico invite-source"></div>
				<div class="text">招源头厂商</div>
				<div class="next-ico"></div>
			</li>
			<li class="type-item" @click="circleCollaborate(2)">
				<div class="ico invite-locality"></div>
				<div class="text">招本地店铺</div>
				<div class="next-ico"></div>
			</li>
			<li class="type-item" @click="circleCollaborate(3)">
				<div class="ico invite-partner"></div>
				<div class="text">招城市合伙人</div>
				<div class="next-ico"></div>
			</li>
			<li class="type-item" @click="circleCollaborate(4)">
				<div class="ico invite-enterprise"></div>
				<div class="text">企业招聘</div>
				<div class="next-ico"></div>
			</li>
		</ul>
	</div>
</template>
<script>
	
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
				history.back(-1);
			},
			// 招聘合作
			circleCollaborate(num){
				location.href = './circleCollaborate.html?circleType=' + num;
			},
		},
		components:{
			
		}
	}
</script>
<style lang="less">
	@import '../../less/common';
	body{
		background: @background-color;
	}
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
	// 招商合作类型
	.type-list{
		.pxRem(margin-top,16);
		background: @white-color;
	}
	.type-item{
		.flex();
        .alignItems(center);
        .borderBottom(2,@border-color);
        .pxRem(padding-top,25);
        .pxRem(padding-bottom,25);
        .pxRem(padding-left,30);
        .pxRem(padding-right,20);
        .borderBottom(2,@border-color);
        .text{
            .flexGrow(1);
            .pxRem(margin-left,26);
            color: #404040;
            .pxRem(font-size,28);
            .pxRem(line-height,44);
        }
        &:last-child{
            border:none;
        }
	}
</style>
