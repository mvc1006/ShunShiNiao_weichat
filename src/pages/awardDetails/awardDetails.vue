<template>
	<div class="viewport">
		<!-- 头部 -->
		 <div class="header">
			<span class="go-back" @click="goBack"></span>
			<div>奖励详情</div>
		</div>
		<!-- 主体 -->
		<div class="main">
			<img src="../../assets/prize.png" alt="">
			<div class="award_name">{{lottery_desc}}</div>
			<!-- 中奖时间 -->
			<div class="award_time">
				<div class="award_item">
					<div class="award_item_left">中奖时间</div>
					<div class="award_item_right">{{create_time}}</div>
				</div>
				<div class="award_item">
					<div class="award_item_left">有效期至</div>
					<div class="award_item_right">{{valid_date}}</div>
				</div>
			</div>
			<!-- 领取 -->
			<div class="getPromptly" v-if="lottery_status == 2" @click="getPromptly">立即领取</div>
			<div class="getPromptly lose" v-if="lottery_status == 3">已领取</div>
		</div>
		<hint :title="'中奖说明'" :content="lottery_rule"></hint>
	</div>
</template>
<script>
	import hint from '../../components/hintArea.vue';
	export default {
		name:'index',
		data(){
			return {
				lottery_desc: '', // 奖品描述
				create_time: '', // 中奖日期
				valid_date: '', // 有效期
				lottery_rule: '', // 中奖说明
				lottery_status: '', // 奖品状态 1: 线下领取 2:未领取 3:已领取
			}
		},
		// 初始化函数
		mounted(){
			this.request();
		},
		computed:{
			dlf_id(){
				return Number(this.common.getUrlParam("dlf_id"));
			}
		},
		// 定义函数
		methods:{
			// 返回首页
			goBack(){
				history.back(-1);
			},
			// 请求数据
			request(){
				this.dataService.dailyLotteryDetail({
					dlf_id: this.dlf_id
				}).then((resp)=>{
					this.dataService.handleResponse({
						data:resp,
						callback:(data)=>{
							this.create_time = data.create_time;
							this.valid_date = data.valid_date;
							this.lottery_desc = data.lottery_desc;
							this.lottery_rule  = data.lottery_rule;
							this.lottery_status = data.lottery_status
						}
					})
				})
			},
			// 立即领取
			getPromptly(){
				localStorage.setItem("dlf_id", + this.dlf_id)
				window.location.href = './newExclusive.html?activity_id=5';
			}
		},
		components:{
			hint
		}
	}
</script>
<style lang="less">
	@import '../../less/common';
	body{
		background: @white-color;
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
	// 主体内容
	.main{
		>img{
			display: block;
			margin: 0 auto;
			.pxRem(margin-top,20);
			.pxRem(width,240);
			.pxRem(height,240);
		}
		.award_name{
			.pxRem(margin-top,35);
			.pxRem(font-size,32);
			color: @gray-text;
			text-align: center;
		}
	}
	// 时间
	.award_time{
		.pxRem(margin-top,60);
		.award_item{
			.flex();
			.justifyContent(space-between);
			.pxRem(padding-left,32);
			.pxRem(padding-right,32);
			.pxRem(line-height,94);
			.pxRem(font-size,28);
			.borderBottom(1);
			.borderTop(1);
			color: @gray-text;
			&:last-child{
				border-top: none;
			}
		}
		.award_item_left{
			color: @gray-light-text;
		}
	}
	// 领取
	.getPromptly{
		.pxRem(line-height,82);
		.pxRem(width,600);
		.pxRem(border-radius,50);
		margin: 0 auto;
		.pxRem(margin-top,40);
		background: @red-color;
		color: @white-color;
		text-align: center;
		&.lose{
			background: @CFCFCF;
		}
	}
	.hint-area .hint-name::after{
		border-top-color: @white-color !important;
	}
</style>
