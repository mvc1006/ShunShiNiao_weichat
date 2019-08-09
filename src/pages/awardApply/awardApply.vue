<template>
	<div class="viewport">
		<!-- 头部 -->
		 <div class="header">
			<span class="go-back" @click="goBack"></span>
			<div>抽奖报名</div>
		</div>
		<!-- 抽奖报名 -->
		<div class="award-list">
			<div class="award-item">
				<div class="award-name">姓名<span>*</span></div>
				<div class="award-content">
					<input v-if="!isApply" type="text" placeholder="请输入姓名" v-model="userName">
					<span v-if="isApply" v-text="userName"></span>
				</div>
			</div>
			<div class="award-item">
				<div class="award-name">手机号码<span>*</span></div>
				<div class="award-content">
					<input v-if="!isApply" type="number" placeholder="请输入手机号码" v-model="telPhone">
					<span v-if="isApply" v-text="telPhone"></span>
				</div>
			</div>
		</div>
		<!-- 提示区域 -->
		<hint :title='"提示"' :content='hintContent'></hint>
		<!-- 提交 -->
		<div v-if="!isApply" class="submit" @click="submit" :class="{'active': isSubmit}">提交</div>
		<popUp v-if="isPopUp" :content='popContent'></popUp>
	</div>
</template>
<script>
	import hint from '../../components/hintArea.vue';
	import popUp from '../../components/popUp.vue';
	export default {
		name:'index',
		data(){
			return {
				isPopUp: false, // 是否打开弹窗
				popContent: '', // 弹窗显示内容
				hintContent: '', // 说明内容
				isApply: false, // 是否已经报名
				userName: "", // 报名人姓名
				telPhone: '', // 报名人手机号
			}
		},
		// 初始化函数
		mounted(){
			this.init();
		},
		computed:{
			isSubmit(){
				return this.userName != ''&& this.telPhone != '';
			}
		},
		// 定义函数
		methods:{
			// 返回首页
			goBack(){
				history.back(-1);
			},
			init(){
				this.isApply = Number(this.common.getUrlParam('is_apply'))==0?false:true;
				// if(this.isApply){
					
				// }
				this.bigLotteryInfo();
				this.$eventBus.$on("closePopup",() => {
					this.isPopUp = false;
					if(this.isApply){
						window.location.href = './applySucceed.html'
					}
				})
			},
			bigLotteryInfo(){
                this.dataService.bigLotteryInfo({}).then((resp)=>{
                    this.dataService.handleResponse({
                        data: resp,
                        callback: (data)=>{
                            this.userName = data.applyer_name || '';
							this.telPhone = data.applyer_mobile || '';
							this.hintContent = data.tips
                        },
                    })
                })
            },
			// 提交
			submit(){
				if(this.userName == ''){
					this.openPop("请输入姓名");
					return false;
				}
				if(this.telPhone == ''){
					this.openPop("请输入手机号");
					return false;
				}
				var myreg=/^[1][3,4,5,7,8,9][0-9]{9}$/;
				if (!myreg.test(this.telPhone)){
					this.openPop("请输入正确的手机号");
					return false
				}
				this.request();
			},
			request(){
				this.dataService.bigLotteryApply({
					applyer_name: this.userName,
					applyer_mobile: this.telPhone
				}).then((resp) => {
					if(resp.data.code == 1000){
						this.openPop("<p>报名成功</p><p>您的信息将导入第三方抽奖软件</p><p>6月1日由视频公开抽奖</p><p>保证公平公正</p><p>中奖信息将公布在顺势鸟商城中</p>");
						this.isApply = true;
						return false;
					}
					this.dataService.handleResponse({
						data: resp,
						callback: (data) => {},
						callback1001: (data) => {
							this.openPop(data);
						}
					})
          		})
			},
			// 弹窗提示
			openPop(content){
				this.isPopUp = true;
				this.popContent = content;
			}
		},
		components:{
			hint,
			popUp
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
	// 报名列表
	.award-list{
		.pxRem(margin-top,20);
	}
	.award-item{
		.flex();
		.justifyContent(space-between);
		// .alignItems();
		.pxRem(line-height,96);
		.pxRem(padding-left,24);
		.pxRem(padding-right,24);
		.borderBottom(2);
		background: @white-color;
	}
	.award-name{
		.flexShrink(0);
		>span{
			color: @red-color;
		}
	}
	.award-content{
		.flexGrow(1);
		.flex();
		.justifyContent(flex-end);
		.alignItems();
		>input{
			display: block;
			width: 100%;
			height: 100%;
			text-align: right;
			.pxRem(font-size,24);
			border: none;
			&::-webkit-input-placeholder{
				color: @gray-light-text;
			}
		}
	}
	// 提交
	.submit{
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		.pxRem(line-height,96);
		text-align: center;
		background: #FF9629;
		color: @white-color;
		opacity: .3;
		&.active{
			opacity: 1;
		}
	}
</style>
