<template>
	<div class="box">
		<!-- 头部返回 -->
		<div class="header">
			<span class="go-back" @click="goBack"></span>
			<div class="selectShopType">
				<span class="mainShop" :class="mainMenu==0?'active':''" @click="cutMainMenu(0)">主商品</span>
				<span :class="mainMenu==1?'active':''" @click="cutMainMenu(1)">赠品</span>
			</div>
			<span class="store-search" @click="search"></span>
		</div>
		<scroll ref="scroll" :upBack="upBack" :downBack="downBack" :isEnd="isEnd">
			<div class="viewport">
				<!-- 销售信息 -->
				<div class="market-data">
				<div class="sales-volume">
					<p>销量: <span v-if="mainMenu==0">{{mgoods_sales}}</span><span v-if="mainMenu==1">{{ggoods_sales}}</span>件</p>
				</div>
				<div class="make-bargain">
					<p>成交额: <span v-if="mainMenu==0">¥{{mgoods_sum}}</span><span v-if="mainMenu==1">¥{{ggoods_sum}}</span></p>
				</div>
				</div>
				<!-- 切换菜单 -->
				<div class="cut-menu">
					<div @click="cutTypeMenu(0)"><span :class="typeMenu==0?'active':''">出售中 ({{onsale_sum}})</span></div>
					<div @click="cutTypeMenu(1)"><span :class="typeMenu==1?'active':''">已下架 ({{notsale_sum}})</span></div>
				</div>
				<!-- 排序 -->
				<div class="sort-type">
					<div class="sort-item" v-for="(sort,index) in sortList" :key="index" :class="sortMenu==index?'active':''" @click="cutSort(index)">
						{{sort.name}}
						<span class="arrows arrows-top" :class="sort.isArrowsDir?'active':''"></span>
						<span class="arrows arrows-bottom" :class="sort.isArrowsDir?'':'active'"></span>
					</div>
				</div>
				<!-- 商品列表 -->
				<div class="shop-item" v-for="(good,index) in shopData" :key="index" @click="gotoDetails(good.goods_id)">
					<div class="shop-img">
						<img :src="good.gimg" alt="">
						<div class="shop-type" v-if="typeMenu==0&&good.store_count==0||typeMenu==1">
							<span v-if="typeMenu==0&&good.store_count==0">已售完</span>
							<span v-if="typeMenu==1">已下架</span>
						</div>
					</div>
					<div class="shop-data">
						<div class="shop-name">{{good.goods_name}}</div>
						<div class="shop-price"><span><i style="font-size: .8em;font-style: normal">￥</i>{{good.shop_price}}</span><span><i style="font-size: .8em;font-style: normal">￥</i>{{good.mprice}}</span></div>
						<div class="shop-other">
							<span class="shop-inventory">库存{{good.store_count}}</span>
							<span class="add-time">添加时间：{{good.create_time}}</span>
						</div>
					</div>
					<img class="look-details" src="../../assets/advance.png" alt="">
				</div>
				<div class="noShopList" v-if="shopData.length == 0">
					<img src="../../assets/no_shopkeeper.png" alt="">
					<div>暂无相关商品</div>
				</div>
			</div>
		</scroll>
	</div>
</template>
<script>
	import scroll from '@/components/scroll';
	export default {
		name:'index',
		data(){
			return {
				isEnd:false, // 分页加载是否结束
				canLoading:true, // 是否加载完成
				pages: 1, // 分页加载
				mainMenu: 0, // 显示的是那个主菜单
				typeMenu: 0, // 显示的是那个分类菜单
				sortMenu: 0, // 当前显示的是那个排序方法
				sortList: [
				{name: "添加时间",isArrowsDir: true,isOne: false},
				{name: "销量",isArrowsDir: true,isOne: true},
				{name: "库存",isArrowsDir: true,isOne: true}
				],
				mgoods_sales: '',// 主品销量
				mgoods_sum: '', // 主品销售额
				ggoods_sales: '',// 赠品销量
				ggoods_sum: '', // 赠品销售额
				shopData: [], // 商品信息
				onsale_sum: '', // 出售中的
				notsale_sum: '', // 已下架的
			}
		},
		mounted(){
			this.requestParam();
		},
		methods:{
			requestParam(type){
				if(type=='break'){
					this.pages = 1;
				}
				this.request({
					shop_id: '1',
					is_main: this.mainMenu == 0 ? 1 : 2,
					is_on_sale: this.typeMenu == 0 ? 1 : 2,
					order_type: this.sortMenu==0?"addtime":this.sortMenu==1?"sale":'store',
					order_val: this.sortList[this.sortMenu].isArrowsDir?"desc":"asc",
					page: this.pages
				})
			},
			// 请求后台
			request(parems){
				var that = this;
				this.dataService.goodsList(parems).then(function(resp){
					that.dataService.handleResponse({
						data: resp,
						callback: function(data){
							if(data.data.length == 0||data.data.length < data.per_page){
								that.isEnd = true;
							}
							if(that.pages==1){
								that.shopData = []
							}
							that.shopData =  that.shopData.concat(data.data);
							that.mgoods_sales = data.mgoods_sales;
							that.mgoods_sum = data.mgoods_sum;
							that.ggoods_sales = data.ggoods_sales;
							that.ggoods_sum = data.ggoods_sum;
							that.onsale_sum = data.onsale_sum;
							that.notsale_sum = data.notsale_sum;
							that.$nextTick(function () {
							that.$refs.scroll.scroll.refresh();
							})
						}
					})
				})
			},
			// 返回
			goBack(){
				history.back(-1);
			},
			// 跳转搜索页面
			search(){
				window.location.href = './search.html?page=storeShop&mainMenu=' + this.mainMenu + "&shop_id=" + this.shop_id;
			},
			// 切换主菜单
			cutMainMenu(num){
				if(this.mainMenu == num) return false;
				this.pages = 1;
				this.isEnd = false;
				this.mainMenu = num;
				this.requestParam();
			},
			// 切换分类菜单
			cutTypeMenu(num){
				if(this.typeMenu == num) return false;
				this.isEnd = false;
				this.pages = 1;
				this.typeMenu = num;
				this.requestParam();
			},
			// 切换排序方式
			cutSort(num){
				this.sortMenu = num;
				if(!this.sortList[num].isOne){
					this.sortList[num].isArrowsDir = !this.sortList[num].isArrowsDir
				}
				this.sortList[num].isOne = false;
				for(let i = 0; i < this.sortList.length; i ++){
					if(i != num){this.sortList[i].isOne = true;}
				}
				this.isEnd = false;
				this.pages = 1;
				this.requestParam();
			},
			// 跳转商品编辑页面
			gotoDetails(id){
				this.$eventBus.$emit("gotoDetails",{
					goods_id: id,
					mainMenu: this.mainMenu,
					typeMenu: this.typeMenu
				})
			},
			// 上拉刷新
			upBack(){
				if(this.canLoading){
					this.pages ++;
					this.requestParam();
				}
			},
			// 下拉刷新
			downBack(){
				if(this.canLoading){
					this.pages = 1;
					this.isEnd = false;
					this.requestParam();
				}
			}
		},
		components:{
			scroll
		}
	}
</script>
<style lang="less" scoped>
	@charset "utf-8";
	@import "../../less/common.less";
	*{
		box-sizing: border-box;
	}
	body{
		background: @background-color;
	}
	.viewport{
		position: relative;
		max-width: 720px;
		margin: 0 auto;
		background-size: 100%;
		height: 100%;
		color: @gray-text;
		.pxRem(font-size,24);
		.pxRem(padding-top,96);
		>div{
			background: @white-color;
		}
	}
	/* 头部 */
	.header{
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		background: #fff;
		z-index: 9999;
		.pxRem(line-height,41);
		.pxRem(padding-top,26);
		.pxRem(padding-bottom,22);
		.flex();
		.alignItems();
		.justifyContent(space-between);
		.borderBottom(1);
	}
	.header>div{
		width: 100%;
		text-align: center;
		.flex();
		.justifyContent();
		.pxRem(font-size,24)
	}
	.store-search{
		position: absolute;
		.pxRem(right,30);
		.pxRem(width,50);
	}
	.header>.go-back{
		position: absolute;
		.pxRem(left,30);
		.pxRem(width,16);
	}
	.selectShopType>span{
		display: block;
		.pxRem(width,126);
		text-align: center;
		.border(3,@red-color);
		color: @red-color;
	}
	.selectShopType>span:first-child{
		.pxRem(border-top-left-radius,10);
		.pxRem(border-bottom-left-radius,10);
	}
	.selectShopType>span:last-child{
		.pxRem(border-top-right-radius,10);
		.pxRem(border-bottom-right-radius,10);
	}
	.selectShopType>span.active{
		background: @red-color;
		color: @white-color;
	}
	/* 销售信息 */
	.market-data{
		.flex();
		.pxRem(margin-bottom,20);
		.pxRem(line-height,72);
		>div{
			.flexGrow(1);
			.flexShrink(0);
			flex:1;
			text-align: center;
		}
	}
	.market-num{
		font-weight: bold;
	}
	.make-bargain{
		position: relative;
	}
	.make-bargain>.look-details{
		position: absolute;
		.pxRem(right,25);
		.pxRem(top,25)
	}
	/* 切换菜单 */
	.cut-menu{
		.flex();
		.borderBottom(1,#d2d2d2);
		>div{
			.flexGrow(1);
			text-align: center;
			.flex();
			.justifyContent();
			>span{
				display: block;
				.pxRem(line-height,72);
				.borderBottom(4,transparent);
			}
			>.active{
				color: @red-color;
				border-bottom-color: @red-color;
			}
		}
	}
	/* 排序 */
	.sort-type{
		.flex();
		.pxRem(line-height,75);
		text-align: center;
		>.sort-item{
			.flexGrow(1);
			position: relative;
		}
		.active{
			color: @red-color;
		}
	}
	.arrows{
		position: absolute;
		content: '';
		.pxRem(right,70);
		line-height: 1;
		.border(6,transparent,solid);
	}

	.arrows-top{
		.pxRem(top,20);
		.borderBottom(10, #000, solid)
	}
	.active>.arrows-top{
		border-bottom-color: @red-color;
		opacity: .5;
	}
	.active>.arrows-top.active{
		.borderBottom(10, @red-color, solid);
		opacity: 1;
	}
	.arrows-bottom{
		.pxRem(bottom,20);
		.borderTop(10, #000, solid)
	}
	.active>.arrows-bottom{
		border-top-color: @red-color;
		opacity: .5;
	}
	.active>.arrows-bottom.active{
		.borderTop(10, @red-color, solid);
		opacity: 1;
	}
	/* 商品列表 */
	.shop-item{
		.pxRem(margin-top,20);
		.pxRem(padding-top,25);
		.pxRem(padding-left,30);
		.pxRem(padding-bottom,30);
		.pxRem(padding-right,25);
		.flex();
		.alignItems();
		.justifyContent(space-between);
	}
	/* 商品图片 */
	.shop-img{
		position: relative;
		.pxRem(width,152);
		.pxRem(height,152);
		.flexShrink(0);
		.pxRem(border-radius,10);
		overflow: hidden;
	}
	/* 商品状态 */
	.shop-type{
		position: absolute;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		background: rgba(71,71,71,.6);
		.pxRem(font-size,22);
		color: @white-color;
		.flex();
		.alignItems();
		.justifyContent();
		>span{
			.border(1, @white-color);
			.pxRem(padding-left,10);
			.pxRem(padding-right,10);
			transform: rotate(-15deg);
			opacity: .8;
		}
	}
	/* 商品信息 */
	.shop-data{
		.flexGrow(1);
		.pxRem(padding-left,25);
		.pxRem(padding-right,30);
	}
	.compile{
		.pxRem(padding-right,8)
	}
	/* 商品名称 */
	.shop-name{
		.pxRem(font-size,22);
		.pxRem(line-height,36);
		.pxRem(height,72);
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}
	.shop-price{
		color: @red-color;
		>span{
			.pxRem(margin-right,15);
		}
		span:last-child{
			text-decoration: line-through;
		}
	}
	/* 商品其他信息 */
	.shop-other{
		.flex();
		.alignItems();
		.justifyContent(space-between);
		.pxRem(font-size,20);
		color: @gray-light-text;
		>.add-time{
			.pxRem(font-size,18);
		}
	}
	/* 查看商品详情 */
	.look-details{
		.pxRem(width,16);
		.pxRem(height,28);
	}
	.noShopList{
		.pxRem(padding-top,50);
		background: @background-color !important;
	>img{
		.pxRem(width,218);
		display: block;
		margin: 0 auto;
	}
	>div{
		text-align: center;
		.pxRem(font-size,24);
		color: @gray-light-text;
		.pxRem(margin-top,30);
	}
	}
	.box{
		.flex(column);
		height: 100%;
		.header{
			.flexShrink(0);
			.flexGrow(0);
		}
  	}
</style>
