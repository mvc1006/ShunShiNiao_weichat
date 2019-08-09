<template>
	<div class="spePopUp" @click="closeSep">
		<div class="specification-area" @click.stop>
			<!-- 商品信息 -->
			<div class="poopUp-shop-area">
				<img v-if="spe_img" :src="spe_img" alt="">
				<img v-else :src="commonData.shopData.thumb_img" alt="">
				<div class="popUp-shop-data">
					<div class="popUp-shop-price" :class="isMainShop?'':'popUp-shop-line'">¥{{actualPrice?actualPrice:commonData.shopData.shop_price}}</div>
					<div class="popUp-shop-inventory" v-if="store_count">库存{{store_count}}件</div>
					<div class="popUp-shop-inventory" v-if="!store_count">请先选择规格</div>
					<div class="popUp-shop-specification" v-if="selectedSpe">已选: {{selectedSpe}}</div>
				</div>
			</div>
			<!-- 规格选项 -->
			<div class="specification-select" v-if="spec_info.spec_item_list.length>0">
				<div :key="parInd" v-for="(spec_item,parInd) in spec_info.spec_item_list">
					<div class="specification-name">{{spec_item.spec_name}}</div>
					<div class="specification-list">
						<span class="specification-item" @click="selectSpe(parInd,childInd)" :class="childInd == speIndex[parInd]?'active':''" :key="childInd" v-for="(spItem,childInd) in spec_item.list">{{spItem.name}}</span>
					</div>
				</div>
			</div>
			<!-- 购买数量 -->
			<div class="buy-num" v-if="isMainShop">
				<span>购买数量</span>
				<div class="buy-num-area">
					<span class="minus-num num-regulation" @click="reduceNum">-</span>
					<span class="num-area">{{shopBuyNum}}</span>
					<span class="add-num num-regulation" @click="addNum">+</span>
				</div>
			</div>
		</div>
		<template v-if="isMainShop">
			<div class="buy-shop" v-if="commonData.shopData.activity_id == 5 || commonData.shopData.activity_id == 6" @click.stop="confirm">立即领取</div>
			<div class="buy-shop" v-else-if="commonData.shopData.activity_id == 0 || commonData.shopData.activity_id == 2" @click.stop="confirm"><span>立即购买</span></div>
			<div class="buy-shop" v-else @click.stop="confirm">立即购买</div>
		</template>
		<template v-else>
			<div class="buy-shop" @click.stop="confirm">选为赠品</div>
		</template>
	</div>
</template>
<script>
	import common from '../js/common';
	import Vue from 'vue';
	import localStorageCorrelation from '../js/localStorageCorrelation'
	export default {
		name:'screen',
		// 商品信息，是否为主产品，是否选择赠品,是否立即购买
		props: ['isMainShop','pageName','share_main_order_goods_id','pid'],
		data(){
			return {
				actualPrice: '', // 商品的实际价格
				store_count: '', // 商品的库存
				selectedSpe: '', // 商品的分类
				spec_info: {
				spec_item_list:[]
				}, // 商品分类
				speIndex: [], // 商品选择的分类
				shopBuyNum: 1, // 商品购买数量
				actualSpe:'', // 确认规格选择
				spe_img: '',// 规格选项图片
				isBuy: false, // 是否可以购买
				isRepetition: false,
			}
		},
		computed: {
			commonData(){
				return this.$store.state.commonData
			},
		},
		mounted(){
			this.request();
			// 关闭提示框
			this.$eventBus.$on("closePopup",() => {
				this.isRepetition = false;
			});
		},
		methods:{
			// 请求后台
			request(){
				var that = this;
				this.dataService.specInfo({
					goods_id: this.commonData.shopData.goods_id,
					tab_type: this.isMainShop ? 1:2
				}).then(function(resp){
					that.dataService.handleResponse({
						data: resp,
						callback: function(data){
							that.spec_info = data;
							if(data.spec_item_list.length==0){
								that.store_count = data.store_count
							}
							for(let i = 0; i < data.spec_item_list.length; i++){
								that.speIndex.push("-1");
							}
						}
					})
				})
			},
			// 获取是否可以选为赠品
			checkBuy(){
				let shopGroupData = this.getShopData(),ssn_shopGroup = this.commonData.ssn_shopGroup,presentList = ssn_shopGroup.presentList,laterSelect = localStorage.getItem('main_order_goods_id');
				if(laterSelect){
					this.amendPageLocalPresent(shopGroupData);
					return false; 
				}
				for(let i = 0;i <presentList.length;i++){
					if(shopGroupData.goods_id == presentList[i].goods_id) {
						localStorageCorrelation.openPopUp(this,{popupContent:'您已选择过此赠品'});
						this.isRepetition = false;
						return false;
					}
				}
				let goods_give_item_id = [],select_give_goods_id = [],give_goods_num = [];
				for(let i = 0; i < presentList.length; i ++){
					goods_give_item_id.push(presentList[i].actualSpe?presentList[i].actualSpe:0);
					select_give_goods_id.push(presentList[i].goods_id);
					give_goods_num.push(1)
				}
				goods_give_item_id.push(this.actualSpe || 0);
				select_give_goods_id.push(this.commonData.shopData.goods_id);
				give_goods_num.push(1);
				let params = {
					main_goods_id: ssn_shopGroup.mainShop.goods_id,
					main_goods_item_id: ssn_shopGroup.mainShop.actualSpe?ssn_shopGroup.mainShop.actualSpe:0,
					main_goods_num: ssn_shopGroup.mainShop.shopBuyNum,
					give_goods_id: select_give_goods_id.join(","),
					give_goods_item_id: goods_give_item_id.join(","),
					give_goods_num: give_goods_num.join(','),
				};
				this.dataService.checkBuy(params).then((resp) => {
					this.dataService.handleResponse({
						data: resp,
						callback: (data) => {
							this.isBuy = true;
							this.amendPageLocalPresent(shopGroupData);
						},
						callback1001: (data) => {
							this.isRepetition = false;
							this.isBuy = false;
							localStorageCorrelation.openPopUp(this,{popupContent:data});
						}
					})
				})
			},
			// 关闭规格选项
			closeSep(){
				this.commonData.isSpe = false;
				this.$eventBus.$emit('closeSpe')
			},
			// 减少购买数量
			reduceNum(){
				if(this.shopBuyNum <= 1){
					this.shopBuyNum = 1;
					return false
				}
				this.shopBuyNum --
			},
			// 增加购买数量
			addNum(){
				if(!this.store_count) {
					localStorageCorrelation.openPopUp(this,{popupContent:'请先选择规格~'});
					return false;
				}
				let activity = [1,2,5,6];
				if(activity.includes(Number(this.commonData.shopData.activity_id))){
					localStorageCorrelation.openPopUp(this,{popupContent:'活动商品只能购买一件~'});
					return false
				}
				if(this.shopBuyNum >= this.store_count){
					this.shopBuyNum = this.store_count;
					return false
				}
				this.shopBuyNum ++
			},
			// 选择分类
			selectSpe(parInd,childInd){
				var selectedSpe = '',speTemporary = [];
				Vue.set(this.speIndex,parInd,childInd);
				for(let i = 0; i < this.speIndex.length; i ++){
					if(this.spec_info.spec_item_list[i].list[this.speIndex[i]]){
						this.spe_img = this.spec_info.spec_item_list[i].list[this.speIndex[i]].img||this.spe_img;
						speTemporary.push(this.spec_info.spec_item_list[i].list[this.speIndex[i]].key );
						selectedSpe += this.spec_info.spec_item_list[i].list[this.speIndex[i]].name + " ";
					}
				}
				this.selectedSpe = selectedSpe;
				this.confirmPrice(speTemporary);
			},
			// 确认价格
			confirmPrice(arr){
				if(arr.length != this.speIndex.length) return false;
				arr = arr.sort();
				var key = arr.join("_");
				this.actualPrice = this.spec_info.spec_price_list[key].price;
				this.actualSpe = this.spec_info.spec_price_list[key].item_id;
				this.store_count = this.spec_info.spec_price_list[key].store_count;
			},
			// 确认选购
			confirm(){
				if(this.isRepetition) return false;
				this.isRepetition = true;
				for(let i = 0; i < this.speIndex.length; i++){
					if(this.speIndex[i] == '-1'){
						localStorageCorrelation.openPopUp(this,{popupContent:'请选择：规格'});
						return false;
					}
				}
				if(this.isMainShop||this.commonData.isActivity==1){
					this.amendPageLocalMain(this.getShopData());
				}else{
					if(this.share_main_order_goods_id){
						this.amendPageLocalPresent(this.getShopData());
						return false;
					}
					this.checkBuy();
				}
			},
			// 获取商品组保存数据
			getShopData(){
				let shopGroup = {
					goods_id: this.commonData.shopData.goods_id,
					goods_name: this.commonData.shopData.goods_name,
					thumb_img: this.commonData.shopData.thumb_img,
					store_count: this.store_count,
					actualSpe: this.actualSpe,
					actualPrice: this.actualPrice?this.actualPrice:this.commonData.shopData.shop_price,
					shopBuyNum: this.shopBuyNum,
					selectedSpe: this.selectedSpe,
					activity_id: this.commonData.shopData.activity_id,
					goods_type: this.commonData.shopData.goods_type,
					give_count: this.commonData.shopData.give_count,
				}
				return shopGroup;
			},
			// 选为赠品时
			amendPageLocalPresent(shopGroupData) {
				var ssn_shopGroup = this.commonData.ssn_shopGroup;
				if(this.share_main_order_goods_id){
					ssn_shopGroup.mainShop = {};
					ssn_shopGroup.presentList = [];
					ssn_shopGroup.presentList.push(shopGroupData);
					localStorageCorrelation.setLocalStorage(this);
					this.closeSep();
					if(this.pageName=='shopDetails'){
						history.back(-1);
					}
					return false
				}
				this.isRepetition = false;
				var presentList = ssn_shopGroup.presentList;
				var give_count = this.commonData.ssn_shopGroup.mainShop.give_count;
				if(!give_count){
					give_count = 3;
				}else if(give_count > 3){
					give_count  = 3
				}
				if(presentList.length>=3) this.commonData.isUpper = true;
				if(presentList.length>=give_count){
					localStorageCorrelation.openPopUp(this,{popupContent:'赠品数量已达上限'});
					this.commonData.popupType = 2;
					this.commonData.isPopUp = true;
					this.commonData.popupContent = JSON.stringify(this.commonData.ssn_shopGroup.mainShop)=='{}'?'赠品数量已达上限，是否去选择主商品?':'赠品和主商品已达上限，是否立即去结算?';
					this.commonData.isUpper = true;
					return false
				}
				if(!this.isBuy&&this.commonData.isEmptyShopGroup&&JSON.stringify(this.commonData.ssn_shopGroup.mainShop)!='{}'){
					presentList.push(shopGroupData);
					this.commonData.ssn_shopGroup = ssn_shopGroup;
					this.commonData.popupType = 2;
					this.commonData.isPopUp = true;
					this.commonData.popupContent = '选择当前产品为赠品,商品组将清空,是否继续?';
					return false
				}
				presentList.push(shopGroupData);
				localStorageCorrelation.setLocalStorage(this);
				this.commonData.isSpe = false;
				if(this.pageName=='shopDetails'){
                    sessionStorage.setItem('select-give',1)
					history.back(-1);
				}
				this.$eventBus.$emit('confirm');
			},
			// 选为主品时
			amendPageLocalMain(shopGroupData) {
				this.isRepetition = false;
				var ssn_shopGroup = this.commonData.ssn_shopGroup;
				if(this.commonData.isEmptyShopGroup){
					if(this.commonData.ssn_shopGroup.presentList.length > 0 || (JSON.stringify(this.commonData.ssn_shopGroup.mainShop)!='{}'&&this.commonData.ssn_shopGroup.mainShop.goods_id!=shopGroupData.goods_id)){
						ssn_shopGroup.mainShop = shopGroupData;
						this.commonData.ssn_shopGroup = ssn_shopGroup;
						this.commonData.popupType = 2;
						this.commonData.isPopUp = true;
						this.commonData.popupContent = '选择当前产品为主产品,商品组将清空,是否继续?';
						return false
					}
					var isActivity = [1,3].includes(Number(this.commonData.isActivity));
					if(this.commonData.isGotoPresent&&!isActivity){
						window.location.href = './selectShop.html?buyPresent=false&isActivity='+this.commonData.isActivity;
					}else{
						window.location.href = "./confirmOrder.html";
					}
					ssn_shopGroup.presentList = [];
				}else if(this.pageName == 'shopDetails'){
					window.location.href = "./confirmOrder.html";
				}
				if(this.pid){
					localStorage.setItem("pid",this.pid)
				}else{
					localStorage.setItem("pid",'')
				}
				this.commonData.isSpe = false;
				ssn_shopGroup.mainShop = shopGroupData;
				this.commonData.isMain = true;
				this.commonData.ssn_shopGroup = ssn_shopGroup;
				localStorageCorrelation.setLocalStorage(this);
				localStorage.setItem("give_count",this.commonData.shopData.give_count);
				localStorage.setItem("order_id",'');
				localStorage.setItem("main_order_goods_id",'');
				this.$eventBus.$emit('confirm');
			}
		},
		components:{}
	}
</script>
<style lang='less'>
	@import "../less/common";
	/* 选择规格弹窗 */
	.spePopUp{
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
		background: rgba(0,0,0,.3) !important;
		.flex();
		align-content: flex-end;
		align-items: flex-end;
		flex-wrap: wrap;
		z-index: 99999;
	}
	/* 规格区域 */
	.specification-area{
		width: 100%;
		max-width: 720px;
		margin: 0 auto;
		.pxRem(padding-top,22);
		.pxRem(padding-left,32);
		.pxRem(padding-right,32);
		.pxRem(padding-bottom,96);
		.pxRem(border-top-left-radius,16);
		.pxRem(border-top-right-radius,16);
		background: #fff;
	}
	/* 弹窗中的商品信息 */
	.poopUp-shop-area{
		.flex();
		.pxRem(padding-bottom,20);
		border-bottom: 1px dotted #979797;
		line-height: 1;
	}
	.popUp-shop-data{
		.pxRem(padding-left,16);
		.pxRem(padding-top,22)
	}
	.poopUp-shop-area>img{
		flex-shrink: 1;
		.pxRem(width,200);
		.pxRem(max-height,200);
		.pxRem(border-radius,8)
	}
	/* 价格 */
	.popUp-shop-price{
		.pxRem(margin-bottom,20);
		.pxRem(font-size,36);
		color: @red-color;
	}
	.popUp-shop-line{
		text-decoration: line-through;
	}
	/* 库存 */
	.popUp-shop-inventory{
		.pxRem(margin-bottom,47);
		.pxRem(font-size,20);
		color: @gray-light-text;
	}
	/* 已选规格 */
	.popUp-shop-specification{
		.pxRem(font-size,20);
		color: @gray-text;
	}
	.specification-select{
		.pxRem(min-height,160);
		.pxRem(margin-bottom,30);
		.pxRem(max-height,300);
		overflow: auto;
	}
	/* 规格选择名称 */
	.specification-name{
		.pxRem(margin-top,18);
		.pxRem(margin-bottom,14);
		.pxRem(font-size,24);
		.pxRem(line-height,36);
		color: @gray-text;
	}
	.specification-list{
		.flex();
		.flexWrap(wrap);
	}
	.specification-item{
		.pxRem(margin-left,16);
		.pxRem(margin-bottom,16);
		.pxRem(font-size,20);
		.pxRem(line-height,47);
		.pxRem(padding-left,16);
		.pxRem(padding-right,16);
		.pxRem(border-radius,30);
		color: @simple-gray-color;
		background: @background-color;
		border: 1px solid transparent;
		white-space: nowrap;
	}
	.specification-item.active{
		background: transparent;
		border-color: @red-color;
		color: @red-color;
	}
	.buy-num{
		.flex();
		.justifyContent(space-between);
		.alignItems();
		.pxRem(padding-bottom,45);
		.pxRem(margin-top,30);
		.pxRem(font-size,24);
		color: @gray-text;
	}
	.buy-num-area{
		.flex();
		.alignItems();
	}
	/* 购买数量区域 */
	.num-regulation{
		.pxRem(width,60);
		.pxRem(line-height,48);
		text-align: center;
		.pxRem(font-size,22);
		color: @gray-light-text;
		background: @background-color;
	}
	.num-area{
		.pxRem(padding-left,16);
		.pxRem(padding-right,16);
		color: @gray-text;
	}
	/* 选为主商品 */
	.buy-shop{
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		.pxRem(font-size,24);
		.pxRem(line-height,96);
		color: @white-color;
		background: @red-color;
		text-align: center;
		z-index: 8888;
		>span{
			font-weight: bold;
			.pxRem(margin-right,8);
		}
	}
</style>
