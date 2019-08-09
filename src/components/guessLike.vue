<template>
	<div class="guessLike">
		<h2 style="pointer-events: auto;" @click="aaaa">—&nbsp;&nbsp;猜你喜欢&nbsp;&nbsp;—</h2>
		<shop-list v-if="goods_type==1" :isMainShop="isMainShop" :is-one-live="isOneLive" :shop-list="shopList"></shop-list>
      	<localShopList v-if="goods_type==2" :isMainShop="isMainShop" :isStore="false" :shopList="shopList" :isBuyPresent="isMainShop"></localShopList>
	</div>
</template>
<script>
	import localShopList from '@/components/localShopList.vue';
	import shopList from "@/components/shopList";
	export default {
		name:'guessLike',
		// 参数说名: 
		props: {
			goods_type: {
				type: String,
				default: '1',
			},
			isMainShop: {
				type: Boolean,
				default: true
			},
			shopList: {
				type: Array,
				// default: () => {
				// 	return []
				// }
			},
			isOneLive: {
				type: Boolean,
				default: true
			}
		},
		data(){
			return {

			}
		},
		methods:{
			aaaa(){
				console.log(this.shopList)
			}
		},
		computed:{
		
		},
		components:{
			localShopList,
			shopList
		}
	}
</script>
<style lang='less'>
  	@import "../less/common";
	.guessLike{
		.pxRem(padding-bottom,16);
		>h2{
			.pxRem(margin-top,16);
			text-align: center;
			.pxRem(line-height,72);
			.pxRem(font-size,24);
			color: @red-color;
			background: @white-color;
		}
	}
</style>
