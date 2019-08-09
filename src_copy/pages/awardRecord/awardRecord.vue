<template>
	<div class="viewport">
		<!-- 头部 -->
		 <div class="header">
			<span class="go-back" @click="goBack"></span>
			<div>我的中奖记录</div>
		</div>
		<!-- 中奖记录列表 -->
		<div class="record_list">
			<div class="record_item" v-for="(record,index) in recordList" :key="index" @click="gotoDetails(index)">
				<div class="record_left">
					<span></span>
					<div>
						<div class="record_name">{{record.lottery_desc}}</div>
						<div class="record_time">{{record.remark}}</div>
					</div>
				</div>
				<div class="record_right">
					<div @click="gotoDetails(index)" v-if="record.lottery_status==1">查看详情</div>
					<div @click.stop="getAward(index)" v-if="record.lottery_status==2">立即领取</div>
					<div class="lose" v-if="record.lottery_status==3">已领取</div>
				</div>
			</div>
		</div>
		<!-- 暂无记录 -->
		<div class="not-available" v-if="recordList.length <= 0">
          <img src="../../assets/no_shopkeeper.png" alt="">
          <div class="text">暂无订单数据</div>
        </div>
	</div>
</template>
<script>
	export default {
		name:'index',
		data(){
			return {
				recordList: [],
			}
		},
		// 初始化函数
		mounted(){
			this.request();
		},
		computed:{
			
		},
		// 定义函数
		methods:{
			// 返回首页
			goBack(){
				history.back(-1);
			},
			// 请求数据
			request(){
				this.dataService.dailyLotteryFlow().then((resp)=>{
					this.dataService.handleResponse({
						data:resp,
						callback:(data)=>{
							this.recordList = data
						}
					})
				})
			},
			// 领取奖品
			getAward(num){
				localStorage.setItem("dlf_id",this.recordList[num].dlf_id)
				window.location.href = './newExclusive.html?activity_id=5';
			},
			// 查看详情
			gotoDetails(num){
				window.location.href = './awardDetails.html?dlf_id=' + this.recordList[num].dlf_id;
			},
		},
		components:{}
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
	// 中奖记录
	.record_list{
		.pxRem(padding,20);
	}
	.record_item{
		.flex();
		.pxRem(margin-bottom,20)
	}
	.record_left{
		.flexShrink(0);
		.flex();
		.justifyContent(space-between);
		.alignItems();
		.pxRem(width,480);
		.pxRem(padding,20);
		background: @white-color;
		.pxRem(height,200);
		.pxRem(border-radius,20);
		.borderRight(2,@background-color,dashed);
		box-sizing: border-box;
		>span{
			display: block;
			.pxRem(width,160);
			.pxRem(height,160);
			background: url('../../assets/prize.png') no-repeat;
			background-size: 100%;
		}
		.record_name{
			.pxRem(margin-bottom,26);
			.pxRem(font-size,28);
			color: @gray-text;
		}
		.record_time{
			.pxRem(font-size,24);
			color: @gray-light-text;
		}
	}
	.record_right{
		.flexGrow(1);
		.flex();
		.justifyContent();
		.alignItems();
		background: @white-color;
		.pxRem(border-radius,20);
		>div{
			.pxRem(min-width,112);
			.pxRem(line-height,48);
			.pxRem(padding-left,16);
			.pxRem(padding-right,16);
			.pxRem(font-size,20);
			.pxRem(border-radius,30);
			text-align: center;
			color: @white-color;
			background: linear-gradient(to right,#FC6B9A,#E10D51);
			box-sizing: border-box;
			&.lose{
				background: @CFCFCF
			}
		}
	}
	// 暂无记录
	.not-available{
		.pxRem(padding-top,50);
		text-align: center;
		.pxRem(font-size,24);
    	color: @gray-light-text;
		>img{
			display: block;
			margin: 0 auto;
			.pxRem(margin-bottom,30);
			.pxRem(width, 218);
		}
	}
</style>
