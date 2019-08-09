<template>
	<div class="viewport">
		<div class="share-img" v-if="isShare" @click="closeShare">
			<img src="../../assets/shareGuide.png" alt="">
		</div>
		<!-- 头部 -->
		 <div class="header">
			<!-- <span class="go-back" @click="goBack"></span> -->
			<div>每日抽奖</div>
		</div>
		<!-- 抽奖区域 -->
		<div class="award-area">
			<div class="award-item" 
			v-for="(award,index) in awardList" :key="index" 
			:class="{'active': index==actIndex}">
				<img :src="award.lottery_pic" alt="">
				<!-- <div>{{award.lottery_desc}}</div> -->
			</div>
			<div class="award-button" @click="drawAward"></div>
		</div>
		<!-- 中奖区域 -->
		<div class="award-centre">
			<div class="acrossVertical">
				<div class="award-list">
					<div class="award-item" v-for="(award,index) in winAwardList" :key="index" :class="index%2==0?'odd':'both'">
						<div>{{award.nickname}}</div>
						<div class='award-time'>{{award.time_desc}}</div>
						<div>{{award.lottery_desc}}</div>
					</div>
				</div>
			</div>
		</div>
		<!-- 说明 -->
		<hint :title='"抽奖说明"' :content='hintContent'></hint>
		<!-- 查看中奖记录 -->
		<div class="lookAwardRecord" @click="lookAwardRecord">查看我的中奖记录</div>
		<!-- 弹窗 -->
		<div class="awardPop" v-if="awardPop">
			<div class="awardPopArea" :class="{'notAward': isAward==0}">
				<div class="awaryExplain" v-if="isAward==1">{{awardPopContent}}</div>
				<div class="awaryExplain" v-if="isAward==0">与大奖擦家而过</div>
				<div class="awaryExplain">分享给其他人试试手气吧</div>
				<div class="awardBtn">
					<div v-if="isAward==1" @click="getAward">立即领取</div>
					<div @click="promptlyShare">立即分享</div>
				</div>
				<div class="closeAward" @click="closeAward"></div>
			</div>
		</div>
		<popUp v-if="isPopup" :content='popContent'></popUp>
		<div @click="promptlyShare" class="promptlyShare"><img src="../../assets/activityShare.png" alt=""></div>
	</div>
</template>
<script>
	import hint from '@/components/hintArea.vue';
	import popUp from '@/components/popUp.vue';
	export default {
		name:'index',
		data(){
			return {
				isPopup: false, // 是否打开弹窗
				popContent: '', // 弹窗内容
				awardPop: false, // 中奖弹窗 
				awardPopContent: '', // 中奖弹窗内容
				actIndex: -1,
				awardList:[],// 奖品列表
				winAwardList: [], // 中奖列表
				hintContent: '', // 活动说明
				isStartAward: false,// 是否开始抽奖
				isAward: 0, // 是否中奖
				isAwardId: '' ,// 中奖id
				isShare: false, // 是否分享
				isDrawComplete: false, // 抽奖是否有剩余次数
				DrawCompleteContent: '', // 抽奖没有 次数时的提示
			}
		},
		computed:{
			
		},
		// 初始化函数
		mounted(){
			this.init();
		},
		// 定义函数
		methods:{
			goBack(){},
			init(){
				let url = location.origin;
				// let link = url+ '/poster.html'
          		let imgUrl = url+'/static/img/storeLogo.png';
				this.common.shareFun('我在顺势鸟商城参与每日抽奖','顺势鸟商城是一个神奇的商城，1元当成100元，还有每日抽奖享不停！',imgUrl);
				this.dailyLotteryInfo();
				this.$eventBus.$on("closePopup",() => {
					this.isPopup = false;
				})
			},
			// 请求奖品列表
			awardListRequest(award){
				if(award.length == 12){
					this.awardList = award;
					return false;
				}
				if(award.length == 0){
					for(let i = 0; i < 12; i++){
						this.awardList.push({daily_lottery_id: -1,lottery_desc: '感谢参与'})
					}
					return false
				}
				let num = 0,aIndex = 0,forNum = award.length == 5||award.length == 7 ? 11 : 12;
				if(award.length * 2 > 12){
					num = Math.ceil(12 / (12 - award.length));
					for(let i = 0; i < forNum; i++){
						if(i % num == 0){
							this.awardList.push({daily_lottery_id: -1,lottery_desc: '感谢参与'})
							if(award.length == 7 && i == 0){
								this.awardList.push({daily_lottery_id: -1,lottery_desc: '感谢参与'})
							}
							continue;
						}
						this.awardList.push(award[aIndex])
						aIndex ++;
					}
				}else{
					num = Math.ceil(12 / award.length);
					for(let i = 0; i < forNum; i++){
						if(i % num == 0){
							this.awardList.push(award[aIndex]);
							aIndex ++;
							continue
						}
						this.awardList.push({daily_lottery_id: -1,lottery_desc: '感谢参与'});
						if(award.length == 5 && aIndex == 1){
							aIndex ++;
							this.awardList.push(award[aIndex])
						}
					}
				}
			},
			// 请求中奖记录
			dailyLotteryInfo(){
				this.dataService.dailyLotteryInfo().then((resp)=>{
					this.dataService.handleResponse({
						data:resp,
						callback:(data)=>{
							this.hintContent = data.content
							this.winAwardList = data.bingo_flow;
							this.awardListRequest(data.lottery_list);
							if(data.bingo_flow <= 0) return false;
							this.$nextTick(() => {
								this.rollVertical();
							})
						}
					})
				})
			},
			// 竖向滚动函数
			rollVertical(){
				setTimeout(() => {
					let winWidth = document.getElementsByClassName('acrossVertical')[0].clientHeight;
					let acrossVertical = Math.floor(document.getElementsByClassName('acrossVertical')[0].clientHeight);
					let acrossRoll = document.getElementsByClassName("award-list")[0];
					let itemHeight = Math.floor(acrossRoll.firstChild.clientHeight);
					let marginTop = acrossRoll.children.length * itemHeight;
					if(itemHeight * acrossRoll.children.length <= winWidth) return false;
					acrossRoll.innerHTML = acrossRoll.innerHTML + acrossRoll.innerHTML;
					acrossRoll.style.marginTop =  - marginTop + "px";
					setInterval(() => {
						marginTop ++;
						acrossRoll.style.marginTop = - marginTop + 'px';
						if(marginTop >= acrossRoll.children.length * itemHeight - acrossVertical){
							marginTop = acrossRoll.children.length * itemHeight / 2 - acrossVertical
						}
					},10)
				},50)
			},
			// 开始抽奖
			drawAward(){
				if(this.isDrawComplete){
					this.isPopup = true;
					this.popContent = this.DrawCompleteContent;
					return false;
				}
				if(this.isStartAward) return false;
				this.isStartAward = true;
				let num = 0;
				let time = setInterval(() => {
					this.actIndex ++;
					if(this.actIndex>=12){
						num ++;
						this.actIndex = 0;
					}
				},100);
				this.dataService.dailyLotteryDo().then((resp)=>{
					this.dataService.handleResponse({
						data:resp,
						callback:(data)=>{
							clearInterval(time);
							this.judgeAward(data,num);
						},
						callback1001:(data) => {
							clearInterval(time);
							this.isPopup = true;
							this.popContent = data;
							this.isDrawComplete = true;
							this.DrawCompleteContent = data;
							this.actIndex = -1;
						}
					})
				})
			},
			// 判断抽奖
			judgeAward(data,num){
				this.isAwardId = data.dlf_id
				this.isAward = data.status
				let awardArrer = [],awardList = this.awardList,awardNum = '',awardSlower = '';
				console.log(data)
				this.awardPopContent = data.lottery_desc;
				for(let i = 0; i < awardList.length; i++){
					if(data.status == 0&&awardList[i].daily_lottery_id == -1){
						awardArrer.push(i);
					}else if(data.daily_lottery_id == awardList[i].daily_lottery_id){
						awardArrer.push(i)
					}
				}
				awardNum = awardArrer[Math.floor(Math.random()*awardArrer.length)];
				awardSlower = awardNum - 8;
				if(awardSlower < 0){
					awardSlower = 12 - 8 + awardNum
				}
				let time = setInterval(()=>{
					this.actIndex ++;
					if(this.actIndex>=12){
						num ++;
						this.actIndex = 0;
					}
					if(num >= 5 && this.actIndex == awardSlower){
						clearInterval(time);
						time = setInterval(()=>{
							if(this.actIndex == awardNum){
								this.awardPop = true;
								this.isStartAward = false;
								clearInterval(time);
								return false;
							}
							this.actIndex ++;
							if(this.actIndex>=12){
								num ++;
								this.actIndex = 0;
							}
						},500)
					}
				},50);
			},
			// 立即领取
			getAward(){
				if(this.awardList[this.actIndex].daily_lottery_id==1){
					localStorage.setItem('dlf_id',this.isAwardId)
					window.location.href = './newExclusive.html?activity_id=5';
				}else{
					window.location.href = './awardDetails.html?dlf_id=' + this.isAwardId;
				}
			},
			// 立即分享
			promptlyShare(){
				this.isShare = true;
			},
			closeShare(){
				this.isShare = false;
			},
			// 关闭弹窗
			closeAward(){
				this.awardPop = false
			},
			// 查看中奖记录
			lookAwardRecord(){
				window.location.href = './awardRecord.html'
			},
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
		background: @purple-bg;
	}
	.viewport{
		max-width: 720px;
		width: 100%;
		margin: 0 auto;
		.pxRem(padding-top,96);
		.pxRem(padding-bottom,96);
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
	// 抽奖区域
	.award-area{
		position: relative;
		.flex();
		.flexWrap(wrap);
		.pxRem(width,640);
		.pxRem(height,640);
		.pxRem(padding,34);
		margin: 0 auto;
		.pxRem(margin-top,42);
		background: url('../../assets/award_area_bg.png') no-repeat;
		background-size: 100%;
		box-sizing: border-box;
		>.award-item{
			color: @red-color;
			position: absolute;
			.flexShrink(0);
			.pxRem(width,140);
			.pxRem(height,140);
			background: url('../../assets/award_item.png') no-repeat;
			background-size: 100%;
			&:nth-child(1){
				.pxRem(left,34);
			}
			&:nth-child(2){
				.pxRem(left,178);
			}
			&:nth-child(3){
				.pxRem(right,178);
			}
			&:nth-child(4){
				.pxRem(right,34);
			}
			&:nth-child(5){
				.pxRem(top,178);
				.pxRem(right,34);
			}
			&:nth-child(6){
				.pxRem(bottom,178);
				.pxRem(right,34);
			}
			&:nth-child(7){
				.pxRem(bottom,34);
				.pxRem(right,34);
			}
			&:nth-child(8){
				.pxRem(bottom,34);
				.pxRem(right,178);
			}
			&:nth-child(9){
				.pxRem(bottom,34);
				.pxRem(left,178);
			}
			&:nth-child(10){
				.pxRem(bottom,34);
				.pxRem(left,34);
			}
			&:nth-child(11){
				.pxRem(bottom,178);
				.pxRem(left,34);
			}
			&:nth-child(12){
				.pxRem(top,178);
				.pxRem(left,34);
			}
			&.active{
				background-image: url('../../assets/award_item_active.png');
			}
			>div{
				width: 100%;
				.pxRem(font-size,24);
				text-align: center;
			}
			>img{
				display: block;
				margin: 0 auto;
				.pxRem(width,140);
				.pxRem(height,140);
			}
		}
		.award-button{
			position: absolute;
			.pxRem(top,178);
			.pxRem(left,178);
			.pxRem(width,284);
			.pxRem(height,284);
			background: url('../../assets/award_button.png') no-repeat;
			background-size: 100%;
		}
	}
	// 中奖区域
	.award-centre{
		.pxRem(width,720);
		.pxRem(height,640);
		.pxRem(padding-top,148);
		.pxRem(padding-bottom,92);
		background: url('../../assets/award_centre_bg.png') no-repeat;
		background-size: 100%;
		box-sizing: border-box;
	}
	.acrossVertical{
		.pxRem(height,400);
		.pxRem(padding-left,68);
		.pxRem(padding-right,68);
		overflow: hidden;
		box-sizing: border-box;
	}
	.award-list{
		.award-item{
			.flex();
			.justifyContent(space-between);
			.pxRem(padding-left,20);
			.pxRem(padding-right,20);
			.pxRem(line-height,64);
			.pxRem(font-size,24);
			color: #FFE403;
			&.odd{
				background: #8D58F0;
			}
			&.both{
				background: #7C49E6;
			}
			>div{
				.pxRem(width,220);
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
				&:last-child{
					text-align: right;
				}
			}
			.award-time{
				color: @white-color;
				text-align: center;
				.flexShrink(1);
				.pxRem(width,90);
				.pxRem(font-size,20);
			}
		}
	}
	// 查看我的中奖记录
	.lookAwardRecord{
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		.pxRem(line-height,96);
		background: @red-color;
		color: @white-color;
		text-align: center;
	}
	.hint-area{
		.pxRem(margin-bottom, 38);
		.hint-name::after{
			border-top-color: @purple-bg !important;
		}
	}
	// 中奖弹窗
	.awardPop{
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, .3)
	}
	.awardPopArea{
		position: relative;
		.pxRem(width,720);
		.pxRem(height,782);
		.pxRem(margin-top,170);
		.pxRem(padding-top,550);
		background: url('../../assets/alreadyAward.png') no-repeat;
		background-size: 100%;
		box-sizing: border-box;
		&.notAward{
			background-image: url('../../assets/notAward.png')
		}
	}
	.awaryExplain{
		.pxRem(font-size,28);
		text-align: center;
		color: @gray-text;
	}
	.awardBtn{
		.flex();
		.justifyContent();
		.pxRem(font-size,28);
		>div{
			.pxRem(margin,20);
			.pxRem(padding-left,30);
			.pxRem(padding-right,30);
			.pxRem(line-height,70);
			.pxRem(border-radius,40);
			background: #FFEA37;
			color: #FF5337;
			box-shadow: 0 3px 0 #F5B605
		}
	}
	.closeAward{
		.pxRem(width,68);
		.pxRem(height,68);
		margin: 0 auto;
		.pxRem(margin-top,80);
		background: url('../../assets/guanbi.png') no-repeat;
		background-size: 100%;
	}
	/* 分享指引图片 */
	.share-img{
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 999999;
		background: rgba(0,0,0,.3);
		img{
			position: absolute;
			.pxRem(right,26);
			top: 0;
			.pxRem(width,560);
			.pxRem(height,280);
			display: block;
			margin: 0 auto;
		}
	}
	// 立即分享
	.promptlyShare{
		position: fixed;
		right: 0;
		.pxRem(right,16);
		.pxRem(bottom, 200);
		.pxRem(padding,16);
		border-radius: 50%;
		.border();
		background: @white-color;
		>img{
			.pxRem(width,40);
			.pxRem(height,40);
		}
	}
</style>
