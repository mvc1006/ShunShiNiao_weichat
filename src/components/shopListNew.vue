<template>
	<div class='shop-list-new'>
		<div class="shop-new-item" v-for="(good,index) in shopList" :key="index" @click="JumpShopDetails(index)">
			<div class="shop-new-store" v-if="isStore">
				<div class="shop-new-storeData">
					<span class="title-ico store-ico"></span>
					<div v-text="good.shop_name"></div>
				</div>
				<div class="shop-new-distance" v-text="good.distance"></div>
			</div>
			<div class="shop-new-img">
				<span :style="{backgroundImage: 'url(' + (good.long_img || good.thumb_img) + ')'}"></span>
				<img v-if="isSelectMain(good.goods_id) || isSelectPresent(good.goods_id)" class="corner-marker" src="../assets/corner_marker.png" alt="">
			</div>
			<div class="shop-new-data">
				<div class="shop-new-title">
					<div class="shop-new-name" v-text="good.goods_name"></div>
				</div>
				<div class="shop-new-price">
					<div class="shop-new-priceArea">
						<template v-if="isMainShop">
							<span class="shop-new-newPrice">¥{{good.shop_price}}</span>
							<span class="shop-new-oldPrice" v-if='good.shop_price != good.market_price'>
								<span v-if="isLocal">门市价: </span>
								<span class="decoration">¥{{good.market_price}}</span>
							</span>
						</template>
						<template v-else>
							<span class="shop-new-present">平台在售价：<span class="shop-new-newPrice">¥{{good.shop_price}}</span></span>
							<span class="shop-new-oldPrice shop-new-present">¥0.00</span>
						</template>
					</div>
					<div class="shop-new-soldOut">[已售{{good.sales_sum}}]</div>
				</div>
				<div class="shop-new-hint" v-if="isMainShop && good.give_count"><div><img src="../assets/hint.png">本主商品最多可选择{{good.give_count}}款赠品</div></div>
				<div class="shop-new-hint" v-if='!isMainShop'>
					<div><img src="../assets/hint.png">赠品需搭配主商品方可下单哦！</div>
					<template v-if="!isMainShop && !isHaveMain">
						<div class="shop-new-selPresent active" v-if="!isSelectPresent(good.goods_id)" @click.stop="openSpecification(good)">选为赠品</div>
						<div class="shop-new-selPresent" v-if="isSelectPresent(good.goods_id)" @click.stop="cancelSelect(good.goods_id)">取消选择</div>
					</template>
				</div>
			</div>
			<complimentary @click.stop :good="good" v-if="commonData.isEmptyShopGroup&&isMainShop" :is-one-live="true" :give-list="good.give_list" :give-count-total="good.give_count_total"></complimentary>
		</div>
	</div>
</template>
<script>
	import complimentary from './complimentary.vue';
	import common from '../js/common';
	import localStorageCorrelation from '../js/localStorageCorrelation';
	export default {
		name:'shopListNew',
		// 是否为主品区，是否一排一个，商品列表，商品组信息
		props: {
			isLocal: { // 是否为本地
				type: Boolean,
				default: false,
			},
			isMainShop:{ // 是否为主品
				type: Boolean,
				default: true
			},
			shopList: { // 商品列表
				type: Array,
				default: () => {
					return {}
				}
			},
			isStore: { // 是否有商品名
				type: Boolean,
				default: false
			}
		},
		data(){
			return {
				shopData: "", // 商品信息
			}
		},
		mounted(){
			var that = this;
			this.$eventBus.$on("openSpecification",function(shopData){
				//that.openSpecification(shopData)
			});
		},
		methods:{
			// 跳转商品详情页
			JumpShopDetails(num){
				var id = this.shopList[num].goods_id;
                // 是否为本地  是否是主品  当钱商品id  是否清除商品组
                this.$eventBus.$emit('goDetails');
				window.location.href = './sourceShopDetails.html?local='+(this.isLocal ? 1 : 0)+'&isMainShop=' + this.isMainShop +'&id=' + id + '&isEmptyShopGroup='+this.commonData.isEmptyShopGroup
			},
			// 打开规格选项
			openSpecification(shopData){
				if(this.commonData.ssn_shopGroup.mainShop.goods_id == shopData.goods_id&&this.isMainShop) {
					// 是否为主品
					window.location.href = './selectShop.html?buyPresent='+!this.isMainShop;
					return false;
				}
				this.commonData.shopData = shopData;
				this.commonData.isSpe = true;
			},
			// 取消赠品选择
			cancelSelect(id){
				var that = this;
				this.commonData.ssn_shopGroup.presentList.forEach(function(item,index){
					if(item.goods_id == id){
					that.commonData.ssn_shopGroup.presentList.splice(index,1);
					}
				})
				localStorageCorrelation.setLocalStorage(that);
			},
			// 是否已经选为主品
			isSelectMain(id){
				return this.commonData.ssn_shopGroup.mainShop.goods_id == id;
			},
			// 是否已经选择为赠品
			isSelectPresent(id){
				var isTrue = false;
				if(!this.commonData.ssn_shopGroup.presentList) return false;
				this.commonData.ssn_shopGroup.presentList.forEach(function(item){
					if(item.goods_id == id){
						isTrue = true;
					}
				});
				return isTrue;
			},
		},
		computed:{
			commonData(){
				return this.$store.state.commonData;
			},
			isHaveMain(){ // 是否存在主商品
				return JSON.stringify(this.commonData.ssn_shopGroup.mainShop) == "{}";
			}
		},
		components:{
			complimentary,
		}
	}
</script>
<style lang='less'>
	@import url('../less/shopList.less');
	.activity-bg{
		position: absolute;
		top:0;
		text-align:center;
		color: @white-color;
		.pxRem(left,40);
		.pxRem(line-height,32);
		.pxRem(font-size,20);
	}
	// 新列表
	.shop-list-new{
		.pxRem(padding,20);
		color: @gray-text;
		background: @background-color;
		>.shop-new-item{
			.pxRem(margin-bottom,20);
			.pxRem(padding,20);
			background-color: @white-color;
			.pxRem(border-radius,20);
			overflow: hidden;
		}
		.shop-new-store{
			.flex();
			.justifyContent(space-between);
			.pxRem(margin-bottom,26);
		}
		.shop-new-storeData{
			.flex();
			.alignItems(center);
			.pxRem(font-size,26);
			font-weight: bold;
			>div{
				.pxRem(margin-left,16);
			}
		}
		.shop-new-distance{
			.pxRem(font-size,24);
			color: @gray-light-text;
		}
		.shop-new-img{
			width: 100%;
			// .pxRem(height,320);
			position: relative;
			.pxRem(border-radius,8);
			overflow: hidden;
			>span{
				display: block;
				width: 100%;
				.pxRem(height,320);
				background-repeat: no-repeat;
				background-size: 100%;
				background-position: center;
			}
			>img{
				position: absolute;
				right: 0;
				top: 0;
				.pxRem(width,48);
				.pxRem(height,48);
			}
		}
		.shop-new-title{
			.flex();
			.justifyContent(space-between);
			.alignItems(center);
		}
		.shop-new-data{
			.pxRem(padding-bottom,8);
		}
		.shop-new-name{
			width: 60%;
			.pxRem(margin-top,8);
			.pxRem(font-size,24);
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		.shop-new-selPresent{
			.pxRem(padding-left,12);
			.pxRem(padding-right,12);
			.pxRem(line-height,34);
			.pxRem(height,36);
			.pxRem(border-radius,30);
			.pxRem(font-size,20);
			background: @gray-light-text;
			color: @white-color;
			&.active{
				background: linear-gradient(to right,#FC6B9A,@red-color);
				// color: @red-color;
				border-color: @red-color;
			}
		}
		.shop-new-price{
			.flex();
			.justifyContent(space-between);
		}
		.shop-new-newPrice{
			font-weight: bold;
			.pxRem(font-size,28);
			color: @red-color;
		}
		.shop-new-oldPrice{
			.pxRem(margin-left,18);
			.pxRem(font-size,20);
			color: @gray-light-text;
			>.decoration{
				text-decoration: line-through;
			}
		}
		.shop-new-present{
			.pxRem(font-size,26);
			color: @gray-light-text;
			>.shop-new-newPrice{
				text-decoration: line-through;
			}
			
		}
		.shop-new-soldOut{
			.pxRem(font-size,20);
			color: @gray-light-text;
		}
		.shop-new-hint{
			.flex();
			.justifyContent(space-between);
			.pxRem(font-size,20);
			img{
				.pxRem(width, 28);
				.pxRem(height, 28);
				.pxRem(margin-right, 8)
			}
			>div{
				.flex();
				.alignItems(baseline);
			}
		}
		.shop-present{
			.borderTop(1,@background-color)
		}
	}
</style>
