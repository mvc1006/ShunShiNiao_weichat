<template>
	<div v-if="shopList.length>0">
		<!-- 商品列表 -->
		<div class="shop-list-area" v-for="(shop,index) in shopList" :key="index">
			<!-- 店铺信息 -->
			<div class="store-area" v-if="!isStore && shop.is_overseas == 0" @click="goToStore(shop)">
				<div class="store-data">
					<div class="store-name">
						<div><span class="store-ico"></span><span class="store-title">{{shop.shop_name}}</span></div>
						<span class="isBusiness" v-if="!isStore"><img class="clock" src="../assets/clock.png" alt=""> {{shop.is_open==1?'营业中':'休息中'}}</span>
					</div>
					<div class="store-site">{{shop.shop_address}}</div>
					<div class="store-distance"><span class="site-img"></span><span>{{shop.distance}}</span></div>
				</div>
				<div class="store-img"><img :src="shop.shop_logo" alt=""></div>
			</div>
			<!-- 商品信息 -->
			<div class="shop-list-data">
				<localShopListData :isMainShop='isMainShop' :commonData='commonData' :shop = 'shop' :selectPresent='selectPresent'></localShopListData>
				<localShopListData  v-if="!isStore&&shop.isMore" v-for="(other,childIndex) in shop.other_goods" :key="childIndex" :selectPresent='selectPresent' :isMainShop='isMainShop' :commonData='commonData' :shop = 'other'></localShopListData>
			</div>
			<!-- 查看更多 -->
			<div class="look-more" v-if="shop.other_goods&&!isStore&&!shop.isMore&&shop.other_goods.length!=0" @click="lookMore(index)">查看更多<img src="../assets/red_bottom_arrows.png" alt=""></div>
		</div>
	</div>
</template>
<script>
	import common from '../js/common';
	import localStorageCorrelation from '../js/localStorageCorrelation';
	import localShopListData from './localShopListData';
	export default {
		name:'shopList',
		props: {
			isMainShop: { // 是否为主商品
				type: Boolean,
				default: true
			},
			isStore: { // 是否为店铺
				type: Boolean,
				default: false
			},
			shopList: { // 商品列表
				type: Array,
				default: () => {
					return []
				}
			},
			selectPresent:{
				type: Boolean,
				default: false
			}
		},
		data(){
			return {
				shopData: "", // 商品信息
			}
		},
		mounted(){},
		methods:{
			// 跳转店铺页面
			goToStore(data){
				window.location.href = 'storeMerchant.html?shop_id='+data.shop_id+'&local=false&shop_name='+data.shop_name
			},
			// 查看更多
			lookMore(num){
				this.shopList[num].isMore = true;
			},
		},
		computed:{
			commonData(){
				return this.$store.state.commonData;
			}
		},
		components:{
			localShopListData
		}
	}
</script>
<style lang='less' scoped>
	@import url('../less/common.less');
	/* 商铺信息 */
	.shop-list-area{
        background: #fff;
		.pxRem(margin,20);
        .borderRadius(20);
		overflow: hidden;
		/* 查看更多 */
		.look-more{
			.flex();
			.justifyContent();
			.alignItems();
			.pxRem(line-height,54);
			.pxRem(font-size,24);
			.borderTop(1);
			color: @red-color;
			img{
				.pxRem(margin-left,16);
				.pxRem(width,28)
			}
		}
	}
	.store-area{
		.flex();
		.justifyContent(space-between);
		.borderBottom(1);
		.pxRem(margin-top,20);
		.pxRem(padding,20);
		background: @white-color;
		>.store-img{
			.pxRem(width,112);
			.pxRem(height,112);
			.pxRem(border-radius,8);
			.flexShrink(0);
			overflow: hidden;
		}
		>.store-data{
			.flexGrow(1);
			.pxRem(margin-right,60);
			.pxRem(font-size,22);
			color: @gray-light-text;
			overflow: hidden;
			>div{
				.flex();
				.alignItems();
			}
		}
		.store-site{
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		.store-name{
			.flex();
			.justifyContent(space-between);
			.pxRem(font-size,26);
			color: @gray-text;
			>div{
				.flex();
				.alignItems();
				.flexGrow(0);
				overflow: hidden;
			}
			>.isBusiness{
				.flex();
				.alignItems(center);
				.pxRem(min-width,130);
				.justifyContent(flex-end);
				.flexShrink(0);
			}
			.store-title{
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
			.store-ico{
				.flexShrink(0);
			}
			.clock{
				.pxRem(width,24);
				.pxRem(height,24);
				.pxRem(margin-right,8);
			}
		}
		.store-ico,.site-img{
			.pxRem(margin-right,16);
		}
		.site-img{
			.pxRem(width,24);
			.pxRem(height,24);
		}
	}
	.shop-list-data{
		.pxRem(padding,20);
		.pxRem(padding-right,12);
	}
</style>
