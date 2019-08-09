<template>
	<div class="viewport">
		<div class="top-area">
			<div class="header">
				<div class="header-title">分享赚赠品</div>
				<!-- <div class="go-back" @click="goBack"></div> -->
			</div>
			<div class="meun">
				<div @click="cutMenu(-1)" class="meun-item" :class="{'active': meunIndex == -1}">全部</div>
				<div @click="cutMenu(0)" class="meun-item" :class="{'active': meunIndex == 0}">暂不可领({{cnt_info[0]}})</div>
				<div @click="cutMenu(1)" class="meun-item" :class="{'active': meunIndex == 1}">待领取({{cnt_info[1]}})</div>
				<div @click="cutMenu(2)" class="meun-item" :class="{'active': meunIndex == 2}">已领取({{cnt_info[2]}})</div>
				<div @click="cutMenu(3)" class="meun-item" :class="{'active': meunIndex == 3}">已失效({{cnt_info[3]}})</div>
			</div>
			<div class="hink" @click="openBottom">
				<img class="hintTrumpet" src="../../assets/hintTrumpet.png" alt="">
				<div class="hink-words">1、您身边的朋友通过您分享的商品链接在平台下单，源头订单签收7天后或本地订单核销后，您就可以领取所属自己的赠品了～</div>
				<img class="boottomArrow" src="../../assets/orangeBottomArrow.png" alt="">
			</div>
		</div>
		<scroll ref="scroll" :upBack="upBack" :downBack="downBack" :isEnd="isEnd" v-if="getList.length > 0">
			<div class="get-list">
				<div class="get-item" v-for="(get,index) in getList" :key="index">
					<template>
						<img class="get-item-corner" v-if="get.share_give_status == 0" src="../../assets/noReceive.png" alt="">
						<img class="get-item-corner" v-if="get.share_give_status == 1" src="../../assets/toReceive.png" alt="">
						<img class="get-item-corner" v-if="get.share_give_status == 2" src="../../assets/alreadyReceive.png" alt="">
						<img class="get-item-corner" v-if="get.share_give_status == 3" src="../../assets/loseEfficacy.png" alt="">
					</template>
					<div class="get-time" v-text="get.share_give_time"></div>
					<div class="purchaser-data">
						<div class="purchaser-img">
							<img :src="get.avatar" alt="">
						</div>
						<div class="purchaser-area">
							<div class="purchaser-name" v-text="get.user_nickname">樱桃小丸子</div>
							<div class="order-number">订单编号：{{get.order_no}}</div>
							<div class="order-time">下单时间：{{get.pay_time}}</div>
						</div>
					</div>
					<div class="get-reason">{{get.desc}}</div>
					<div class="buy-shop">
						<div class="shop-img">
							<img :src="get.goods_pic" alt="">
						</div>
						<div class="shop-data">
							<div class="shop-name" v-text="get.goods_name"></div>
							<div class="shop-price"><span v-text="get.goods_price"></span><span class="lineation" v-text="get.market_price"></span></div>
						</div>
						<img class="buy-shop-corner" v-if="get.goods_type == 1" src="../../assets/fav_goods_tag1.png" alt="">
						<img class="buy-shop-corner" v-if="get.goods_type == 2" src="../../assets/fav_goods_tag2.png" alt="">
					</div>
					<template>
						<div class="get-button" v-if="get.share_give_status == 0">去领赠品</div>
						<div class="get-button active" v-if="get.share_give_status == 1" @click="selectShop(index)">去领赠品</div>
						<div class="get-button opacity" v-if="get.share_give_status == 2">已领取</div>
						<div class="get-button" v-if="get.share_give_status == 3">去领赠品</div>
					</template>
				</div>
			</div>
		</scroll>
		<!-- 没有分享赚赠品 -->
		<div class="no-share-present" v-else>
			<img src="../../assets/no-share-present.png" alt="">
			<div>多多分享商品链接，就有机会赚取更多赠品哦～</div>
			<div>具体详情参见顶部活动规则～</div>
			<div class="goToShare" @click="goToShare">去分享</div>
		</div>
		<div class="bottomPop" @click="closeBottom" v-if="isBottomPop">
			<div class="bottomPop-area" @click.stop>
				<img src="../../assets/guideClose.png" @click="closeBottom" class="closeBottom" alt="">
				<div class="bottomPop-title">赠品领取小帖士</div>
				<div class="bottomPop-content">
					<img src="../../assets/hintTrumpet.png" alt="">
					<div v-html="rules"></div>
				</div>
			</div>
		</div>
		<popUp v-if="commonData.isPopUp" :type="commonData.popupType" :time="commonData.popupTime" :content="commonData.popupContent"></popUp>
		<bottom :num="2"></bottom>
	</div>
</template>
<script>
	import scroll from '../../components/scroll';
	import bottom from '../../components/bottom';
	import localStorageCorrelation from '../../js/localStorageCorrelation';
	import popUp from '@/components/popUp';
	export default {
		name:'shareMark',
		data(){
			return {
				canLoading:true, // 是否加载完成
				isEnd:false, // 分页加载是否结束
				page: 1, // 分页加载
				meunIndex: -1, // 显示菜单
				cnt_info: [],// 菜单上显示的数量
				rules: '', // 规则说明
				getList: [],// 领取列表
				isFriceReqest: true, // 是否第一次加载
				isBottomPop: false, // 是否打开底部弹窗
			}
		},
		computed:{
			commonData(){
				return this.$store.state.commonData
			}
		},
		// 初始化函数
		mounted(){
			localStorageCorrelation.getLocalStorage(this);
			let path = this.$route.path;
			switch (path){
				case '/all':
					this.cutMenu(-1);
					break
				case '/noReceive':
					this.cutMenu(0);
					break
				case '/toReceive':
					this.cutMenu(1);
					break
				case '/alreadyReceive':
					this.cutMenu(2);
					break
				case '/loseEfficacy':
					this.cutMenu(3);
					break
			}
			this.request();
		},
		// 定义函数
		methods:{
			// 请求后台
			request(){
				this.dataService.shareOrderList({
					share_give_status: this.meunIndex,
					page: this.page
				}).then((resp) => {
					this.dataService.handleResponse({
						data: resp,
						callback: (data) => {
							if(data.list.length <= 0){
								this.isEnd = true;
							}
							// if(this.isFriceReqest){
							// 	this.cnt_info = data.cnt_info;
							// 	this.rules = data.rules;
							// }
							if(this.page == 1){
								this.getList = [];
								this.cnt_info = data.cnt_info;
								this.rules = data.rules.replace(/<br>/g,"<br><br>");
							}
							this.isFriceReqest = false;
							this.getList = this.getList.concat(data.list);
						}
					})
				})
			},
			// 返回
			goBack(){
				history.go(-1)
			},
			// 菜单切换
			cutMenu(num){
				if(this.meunIndex == num) return false;
				this.meunIndex = num;
				this.page = 1;
				switch (num){
					case -1:
						this.$router.replace('all');
						break
					case 0:
						this.$router.replace('noReceive');
						break
					case 1:
						this.$router.replace('toReceive');
						break
					case 2:
						this.$router.replace('alreadyReceive');
						break
					case 3:
						this.$router.replace('loseEfficacy');
						break
				}
				this.request();
			},
			// 打开弹窗
			openBottom(){
				this.isBottomPop = true;
			},
			// 关闭弹窗
			closeBottom(){
				this.isBottomPop = false;
			},
			// 选择赠品
			selectShop(num){
				localStorage.setItem('ssn_shopGroup', JSON.stringify({"mainShop":{},"presentList":[]}))
				window.location.href = './selectShop.html?share_main_order_goods_id=' + this.getList[num].share_main_order_goods_id
			},
			// 去分享
			goToShare(){
				window.location.href = './localService.html'
			},
			// 上拉加载
			upBack(){
				if(this.canLoading){
					this.page ++;
					this.request();
				}
			},
			// 下拉刷线
			downBack(){
				if(this.canLoading){
					this.page = 1;
					this.isEnd = false;
					this.request();
				}
			}
		},
		components:{
			scroll,
			bottom,
			popUp
		}
	}
</script>
<style lang="less">
	@import '../../less/common.less';
	.viewport{
		max-width: 720px;
		width: 100%;
		height: 100%;
		margin: 0 auto;
		background: @background-color;
		.pxRem(font-size,24);
		color: @gray-text;
		.flex(column)
	}
	.top-area{
		background: @white-color;
		.flexShrink(0);
	}
	// 头部返回
	.header{
		position: relative;
		.flex();
		.alignItems(center);
		.pxRem(line-height,96);
		.borderBottom(1,@border-color);
	}
	.header-title{
		.flexGrow(1);
		.pxRem(font-size,28);
		text-align: center;
	}
	.go-back{
		position: absolute;
		.pxRem(left,30);
	}
	// 菜单切换
	.meun{
		.flex();
		.pxRem(line-height,64);
		.justifyContent(space-around);
		.borderBottom(1,@border-color);
		color: @simple-gray-color;
		>.active{
			color: @red-color;
			.borderBottom(3,@red-color)
		}
	}
	.meun-item{
		.flexShrink(0);
		.pxRem(padding-left,24);
		.pxRem(padding-right,24);
	}
	// 顶部提示
	.hink{
		.flex();
		.alignItems(center);
		.pxRem(padding-left,20);
		.pxRem(padding-right,20);
		.pxRem(line-height,64);
		.pxRem(font-size,22);
		background: #FFF8D8;
		color: @yellow-text;
		>img{
			.flexShrink(0);
		}
	}
	.hink-words{
		.pxRem(padding-left,8);
		.pxRem(padding-right,20);
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.hintTrumpet{
		.pxRem(width,20);
	}
	.boottomArrow{
		.pxRem(width,28);
	}
	// 领取列表
	.get-list{
		.pxRem(padding,20);
	}
	.get-item{
		position: relative;
		.pxRem(margin-bottom,20);
		.pxRem(padding-top,20);
		.pxRem(padding-bottom,20);
		padding-bottom: 0;
		background: @white-color;
		.pxRem(border-radius,20);
		>div{
			.pxRem(margin-left,20);
			.pxRem(margin-right,20);
		}
	}
	.get-item-corner{
		position: absolute;
		.pxRem(right,-5);
		.pxRem(top,-5);
		.pxRem(width,140);
	}
	.get-time{
		.pxRem(margin-bottom,30);
		line-height: 1;
		.pxRem(font-size,22);
		color: @gray-light-text;
	}
	.purchaser-data{
		.flex();
	}
	.purchaser-img{
		.flexShrink(0);
		.pxRem(width,80);
		.pxRem(height,80);
		.pxRem(margin-right,20);
		border-radius: 50%;
		overflow: hidden;
		>img{
			max-width: 100%;
		}
	}
	.purchaser-area{
		.flexGrow(1);
		.pxRem(line-height,48);
		.pxRem(font-size,22);
		color: @gray-light-text;
	}
	.purchaser-name{
		.pxRem(font-size,28);
		color: @gray-text;
	}
	.get-reason{
		.pxRem(margin-bottom,20);
	}
	.buy-shop{
		position: relative;
		.flex();
		.pxRem(padding,20);
		.pxRem(border-radius,12);
		background: #f9f9f9;
	}
	.buy-shop-corner{
		.pxRem(width,76);
		.pxRem(height,50);
		position: absolute;
		.pxRem(right,-5);
		.pxRem(bottom,12);
	}
	.shop-img{
		.flexShrink(0);
		.pxRem(width,112);
		.pxRem(height,112);
		.pxRem(margin-right,16);
		.pxRem(border-radius,8);
		overflow: hidden;
		>img{
			max-width: 100%;
		}
	}
	.shop-data{
		.flex(column);
		.justifyContent(space-between);
	}
	.shop-name{
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		.pxRem(line-height,36);
	}
	.shop-price{
		.pxRem(font-size,26);
		.lineation{
			.pxRem(margin-left,6);
			.pxRem(font-size,20);
			color: @gray-light-text;
			text-decoration: line-through;
		}
	}
	.get-button{
		margin: 0 !important;
		.pxRem(margin-top,20) !important;
		.borderTop();
		.pxRem(line-height,80);
		text-align: center;
		color: @gray-light-text;
		&.active{
			color: @red-color;
		}
		&.opacity{
			color: @red-color;
			opacity: .5;
		}
	}
	// 底部弹窗
	.bottomPop{
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background: rgba(0,0,0,.3);
		z-index: 99999;
	}
	.bottomPop-area{
		position: absolute;
		bottom: 0;
		.pxRem(padding-top,40);
		.pxRem(padding-bottom,40);
		.pxRem(border-top-left-radius,16);
		.pxRem(border-top-right-radius,16);
		background: @white-color;
	}
	.closeBottom{
		position: absolute;
		.pxRem(top,-60);
		.pxRem(right,36);
		.pxRem(width,36);
	}
	.bottomPop-title{
		.pxRem(font-size,28);
		text-align: center;
	}
	.bottomPop-content{
		.flex();
		.alignItems(flex-start);
		.pxRem(padding,24);
		.pxRem(font-size,22);
		color: @yellow-text;
		>img{
			.pxRem(width,20);
			.pxRem(margin-right,8);
			.pxRem(margin-top,8);
		}
	}
	// 没有分享赚赠品
	.no-share-present{
		.flexGrow(1);
		text-align: center;
		.pxRem(font-size,20);
		color: @red-color;
		>img{
			.pxRem(width,140);
			.pxRem(height,180);
			display: block;
			margin: 0 auto;
			.pxRem(margin-bottom,32);
			.pxRem(margin-top,180);
		}
	}
	.goToShare{
		margin: 0 auto;
		.pxRem(margin-top,32);
		.pxRem(margin-bottom,50);
		.pxRem(max-width,220);
		.pxRem(line-height,60);
		text-align: center;
		.pxRem(font-size,28);
		color: @white-color;
		background: @red-color;
		.pxRem(border-radius,30);
	}
</style>
