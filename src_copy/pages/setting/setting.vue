<template>
	<div class="viewport">
		<div class="header">
			<span class="go-back" @click="goBack"></span>
			<div>设置</div>
		</div>
		<div class="other-list">
			<div class="other-item" @click="binding">
				<div class="other-name">手机号</div>
				<div class="other-fun">
					<span v-if="!mobile">去绑定</span>
					<span class="active" v-else>{{mobile}}</span>
					<span class="person-write-ico"></span>
				</div>
			</div>
			<!-- <div class="other-item" @click="openAddr">
				<div class="other-name">收货地址</div>
				<div class="other-fun">
					<span class="person-write-ico"></span>
				</div>
			</div> -->
		</div>
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
		// 关闭提示框
			this.$eventBus.$on("closePopup",()=>{
				this.isPopUp = false;
			});
		},
		// 计算属性
		computed:{
			mobile(){
				let mobile = this.common.getUrlParam('mobile');
				if(mobile == 'null'||mobile=='undefined'||mobile==''){
					return false
				}
				mobile = mobile.substring(0,3)+'****'+ mobile.substring(7);
				return mobile;
			}
		},
		// 定义函数
		methods:{
			// 返回
			goBack(){
				window.location.href = './personCenter.html';
			},
			// 绑定手机号
			binding(){
				window.location.href = './bindingPhone.html?mobile=' + this.common.getUrlParam('mobile');
			},
			// 收货地址
			openAddr(){
				window.location.href = './myAddr.html';
			}
		},
		watch: {
			
		},
		components:{}
	}
</script>
<style lang="less">
	@import "../../less/common.less";
	body{
		background: @background-color
	}
	.viewport{
		max-width: 720px;
		margin: 0 auto;
		background-size: 100%;
		height: 100%;
		color: @gray-text;
		.pxRem(font-size,24);
		.pxRem(padding-top,96);
	}
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
	.other-list{
		.pxRem(margin-top,16);
		.other-item{
			.flex();
			.justifyContent(space-between);
			.alignItems();
			.pxRem(height,96);
			.pxRem(padding-left,32);
			.pxRem(padding-right,20);
			background: @white-color;
			.borderBottom(1)
		}
		.other-fun{
			.flex();
			.alignItems();
			color: @gray-light-text;
		}
		.person-write-ico{
			.pxRem(margin-left,26);
		}
		.active{
			color: @gray-text;
		}
	}
</style>
