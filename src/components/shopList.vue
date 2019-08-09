<template>
	<div class='shop-list source'>
		<!-- 商品信息 -->
		<div class='shop-item' :class="isOneLive?'':'shop-two'" v-for="(good,index) in shopList" :key="index"  @click="JumpShopDetails(index)">
			<!-- 商品图片 -->
			<div class="shop-img">
				<img class="loot-all" v-if="!good.store_count" src="../assets/loot-all.png" alt="">
				<span :style="{backgroundImage: 'url(' + good.thumb_img + ')'}"></span>
				<div class="activity-bg activity-ico" v-if="good.activity_id && good.activity_id != 0">{{good.activity_name}}</div>
				<img v-if="isSelectMain(good.goods_id)" class="corner-marker" src="../assets/corner_marker.png" alt="">
			</div>
			<template v-if="isMainShop">
				<div class="shop-data">
					<div class="shop-name" v-text="good.goods_name"></div>
					<div class="shop-new-price">
						¥{{good.shop_price}}
						<span class="shop-old-price" v-if="!isOneLive&&good.shop_price!=good.market_price">¥{{good.market_price}}</span>
						<span v-if="!isOneLive" class="shop-sold-out">[已售{{good.sales_sum}}]</span>
					</div>
					<div class="shop-old-price" v-if="isOneLive&&good.shop_price!=good.market_price">¥{{good.market_price}}</div>
					<div class="shop-sold-out" v-if="isOneLive">
						[已售{{good.sales_sum}}]
						<template v-if="!commonData.isEmptyShopGroup">
							<span v-if="!isSelectMain(good.goods_id)" @click.stop='openSpecification(good)'>选为主商品</span>
							<span class="active" @click.stop v-else>已选为主商品</span>
						</template>
					</div>
					<div class="shop-into-shop" @click.stop="intoShop(index)" v-if="good.is_overseas == 0 && pageName != 'storeMerchant'">
						<span v-text="good.shop_name"></span><span class="into-shop">进店</span> <img src="../assets/advance.png" alt="">
					</div>
					<div class="shop-hint" v-if="good.give_count"><img src="../assets/hint.png">本主商品最多可选择{{good.give_count}}款赠品</div>
					</div>
			</template>
			<template v-else>
				<div class="shop-data present">
					<div class="shop-name" v-text="good.goods_name"></div>
					<div class="shop-new-price">
						<div>平台在售价：<span>¥{{good.shop_price}}</span></div>
						<span class="shop-old-price" v-if="!isOneLive">¥0.00</span>
					</div>
					<!-- <div v-if="!isOneLive" class="shop-sold-out">[已售{{good.sales_sum}}]</div> -->
					<div class="shop-old-price" v-if="isOneLive">¥0.00</div>
					<div class="shop-sold-out">
						[已售{{good.sales_sum}}]
						<template v-if="!isHaveMain">
							<span class="active" v-if="isSelectPresent(good.goods_id)" @click.stop="cancelSelect(good.goods_id)">取消选择</span>
							<span v-else @click.stop="openSpecification(good)">选为赠品</span>
						</template>
					</div>
					<div class="shop-into-shop" @click.stop="intoShop(index)" v-if="good.shop_name && pageName!='storeMerchant'">
						<span v-text="good.shop_name"></span><span class="into-shop">进店</span> <img src="../assets/advance.png" alt="">
					</div>
					<div class="shop-hint"><img src="../assets/hint.png">赠品需搭配主商品方可下单哦！</div>
				</div>
			</template>
			<!-- 赠品区域 -->
			<complimentary :good="good" v-if="commonData.isEmptyShopGroup&&isMainShop" :is-one-live="isOneLive" :give-list="good.give_list" :give-count-total="good.give_count_total"></complimentary>
		</div>
	</div>
</template>
<script>
	import complimentary from './complimentary.vue';
	import common from '../js/common';
	import localStorageCorrelation from '../js/localStorageCorrelation';
	export default {
		name:'shopList',
		// 是否为主品区，是否一排一个，商品列表，商品组信息
		props: ["isMainShop","isOneLive","shopList","pageName","isLoacl","selectPresent"],
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
				window.location.href = './sourceShopDetails.html?local=0&isMainShop=' + this.isMainShop +'&id=' + id + '&isEmptyShopGroup=' + this.commonData.isEmptyShopGroup + '&share_main_order_goods_id=' + this.selectPresent
			},
			// 打开规格选项
			openSpecification(shopData){
				let mainShop = this.commonData.ssn_shopGroup.mainShop;
				if(mainShop.activity_id == 3 && !this.isMainShop) {
					localStorageCorrelation.openPopUp(this,{popupContent: '尖叫卡不支持自主选择赠品~'});
					return false;
				}
				if(mainShop.goods_id == shopData.goods_id&&this.isMainShop) {
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
			// 进入店铺
			intoShop(num){
				let good = this.shopList[num];
				window.location.href = './storeMerchant.html?shop_id='+good.shop_id + "&local=true&shop_name=" + encodeURIComponent(good.shop_name);
			},
		},
		computed:{
			commonData(){
				return this.$store.state.commonData;
			},
			isHaveMain(){ // 是否存在主商品
				if(this.selectPresent) return false;
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
		.pxRem(left,110);
		.pxRem(line-height,32);
		.pxRem(font-size,20);
  	}
</style>
