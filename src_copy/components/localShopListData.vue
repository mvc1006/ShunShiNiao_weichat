<template>
	<div class="shop-item" @click="JumpShopDetails(shop)">
		<div class="halving-line"><img src="../assets/jiandao.png" alt=""></div>
		<div class="shop-area">
			<div class="shop-img">
				<img v-if="!shop.store_count" src="../assets/loot-all.png" alt="">
				<span :style="{backgroundImage: 'url(' + (shop.list_long_img || shop.thumb_img) + ')'}"></span>
				<div class="activity-bg activity-ico" v-if="shop.activity_name">{{shop.activity_name}}</div>
			</div>
			<div class="shop-data">
				<div class="shop-name">{{shop.goods_name}}</div>
				<div class="shop-star">
					<star :num="shop.goods_point"></star>
					<template v-if="isMainShop && !commonData.isEmptyShopGroup">
						<span v-if="!isSelectMain(shop.goods_id)" class="shop-selPresent active" @click.stop="openSpecification(shop)">选为主商品</span>
						<span v-else class="shop-selPresent">已选为主商品</span>
					</template>
					<template v-if='!isMainShop && !isHaveMain'>
						<span v-if="!isSelectPresent(shop.goods_id)"  @click.stop="openSpecification(shop)" class="shop-selPresent active">选为赠品</span>
						<span v-else class="shop-selPresent" @click.stop="cancelSelect(shop.goods_id)">取消选择</span>
					</template>
				</div>
				<template v-if="isMainShop">
					<div class="shop-newPrice">
						¥{{shop.shop_price}}
					</div>
					<div class="shop-oldPrice">
						<div v-if="shop.shop_price != shop.market_price">
							<span>门市价</span><span style="text-decoration: line-through">¥{{shop.market_price}}</span>
						</div>
						<div v-else></div>
						<div class="shop-soldOut">[已售{{shop.sales_sum}}]</div>
					</div>
					<div class="shop-hint" v-if="shop.give_count"><img src="../assets/hint.png">本主商品最多可选择{{shop.give_count}}款赠品</div>
				</template>
				<template v-else>
					<div class="shop-newPrice present">
						平台在售价:<span>¥{{shop.shop_price}}</span>
					</div>
					<div class="shop-oldPrice">
						<span>¥0.00</span>
						<span class="shop-soldOut">[已售{{shop.sales_sum}}]</span>
					</div>
					<div class="shop-hint"><img src="../assets/hint.png">赠品需搭配主商品方可下单哦!</div>
				</template>
			</div>
		</div>
		<!-- 赠品 -->
		<complimentary v-if="isMainShop&&commonData.isEmptyShopGroup" :is-one-live="true" :good="shop"></complimentary>
	</div>
</template>
<script>
	import complimentary from './complimentary.vue';
	import common from '../js/common';
	import star from './star.vue';
	import localStorageCorrelation from '../js/localStorageCorrelation'
	export default {
		name:'shopList',
		props: {
			isMainShop: { // 是否为主商品
				type: Boolean,
				default: true
			},
			commonData: { // 是否为店铺
				type: Object,
				default: () => {
					return {}
				}
			},
			shop: { // 商品列表
				type: Object,
				default: () => {
					return {}
				}
			},
			selectPresent:{
				type: Boolean,
				default: false
			}
		},
		data(){
			return {
				
			}
		},
		computed: {
			isHaveMain(){ // 是否存在主商品
				if(this.selectPresent) return false;
				return JSON.stringify(this.commonData.ssn_shopGroup.mainShop) == "{}";
			}
		},
		mounted(){
            this.$eventBus.$on("openSpecification",(shopData)=>{
                //this.openSpecification(shopData)
            });
        },
		methods:{
			// 跳转商品详情页
			JumpShopDetails(data){
                var id = data.goods_id;
                this.$eventBus.$emit('goDetails');
				window.location.href = './sourceShopDetails.html?id=' + id + "&local=1&isMainShop=" + this.isMainShop + '&isEmptyShopGroup=' + this.commonData.isEmptyShopGroup + '&share_main_order_goods_id=' + this.selectPresent
			},
			// 打开规格选项
			openSpecification(shopData){
				if(this.commonData.ssn_shopGroup.mainShop.goods_id == shopData.goods_id&&this.isMainShop) {
					window.location.href = './selectShop.html?buyPresent='+!this.isMainShop+'&id='+shopData.goods_id;
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
		components:{
			complimentary,
			star
		}
	}
</script>
<style lang='less' >
	@import url('../less/common.less');
	// 商品信息
	.shop-list-data{
		.pxRem(padding,20);
		.pxRem(padding-right,12);
		.shop-item{
			.pxRem(padding-bottom,20);
			&:first-child{
				.halving-line{
					display: none;
				}
			}
			&:last-child{
				padding-bottom: 0;
			}
		}
		.halving-line{
			.borderTop(2,@red-color,dashed);
			.pxRem(padding-bottom,30);
			.pxRem(margin-left,20);
			position: relative;
			img{
				position: absolute;
				.pxRem(left,-25);
				.pxRem(top,-16);
				.pxRem(width,32);
			}
		}
		.shop-area{
			.flex();
			.justifyContent(space-between);
		}
		.shop-img{
			position: relative;
			.pxRem(width,320);
			.pxRem(height,200);
			.flexShrink(0);
			.pxRem(border-radius,8);
			overflow: hidden;
			>span{
				display: block;
				.pxRem(width,320);
				.pxRem(height,200);
				background-repeat: no-repeat;
				background-position: center;
				background-size: 100%;
			}
			>img{
				position: absolute;
				.pxRem(left,114);
				.pxRem(top,54);
				.pxRem(width,92);
				.pxRem(height,92);
			}
		}
		.activity-bg{
			position: absolute;
			top: 0;
			text-align: center;
			color: #fff;
			.pxRem(left,100);
			.pxRem(line-height,32);
			.pxRem(font-size,20);
		}
		.shop-data{
			.flexGrow(1);
			.pxRem(padding-left,20);
			.flex(column);
			.justifyContent(space-between);
			overflow: hidden;
		}
		.shop-name{
			.pxRem(font-size,28);
			color: @gray-text;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		.shop-star{
			.flex();
			.justifyContent(space-between);
			.star{
				.pxRem(margin-right,8);
			}
		}
		.shop-selPresent{
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
			// .pxRem(padding-left,8);
			// .pxRem(padding-right,8);
			// .pxRem(line-height,34);
			// .pxRem(height,36);
			// .pxRem(border-radius,8);
			// .pxRem(font-size,20);
			// .border(1,@gray-light-text);
			// color: @gray-light-text;
			// &.active{
			// 	color: @red-color;
			// 	border-color: @red-color;
			// }
		}
		.shop-newPrice{
			.pxRem(font-size,36);
			color: @red-color;
			&.present{
				.pxRem(font-size,20);
				color: @gray-light-text;
				span{
					color: @red-color;
					text-decoration: line-through;
				}
			}
		}
		.shop-oldPrice{
			.flex();
			.justifyContent(space-between);
			.pxRem(font-size,24);
			color: @gray-light-text;
			div{
				&:last-child{
					.pxRem(font-size,20);
				}
			}
		}
		.shop-hint{
			.flex();
			.pxRem(font-size,20);
			img{
				.pxRem(width, 28);
				.pxRem(height, 28);
				.pxRem(margin-right, 8)
			}
		}
	}
	
</style>
