<template>
  <div class="viewport">
	  	<!-- 商品组弹窗 -->
		<shopGroup v-if="!isCityConcat" :share_main_order_goods_id='share_main_order_goods_id'></shopGroup>
		<!-- 规格弹窗 -->
		<specificationPopUp v-if="commonData.isSpe && !isCityConcat" 
			:isMainShop="isMainShop" 
			:pageName="'shopDetails'"
			:pid='sharePeopleId'
			:share_main_order_goods_id='share_main_order_goods_id'></specificationPopUp>
		<!-- 页面弹窗提示 -->
		<popUp v-if="commonData.isPopUp"
			:type="commonData.popupType"
			:time="commonData.popupTime"
			:content="commonData.popupContent"
			:isMainShop="isMainShop"
			:pageName="'shopDetails'"></popUp>
			<!-- 头部返回 -->
		<div class="header">
			<img @click="goBack" class="goBack" src="../../assets/goBackDetails.png" alt="">
			<img class="share" @click="shareOpen" src="../../assets/shareDetails.png" alt="">
			<img class="collect" v-if="!isCollect" @click="collect" src="../../assets/collectDetails.png" alt="">
			<img class="collect" v-if="isCollect" @click="cancelCollect" src="../../assets/haveCallectDetaile.png" alt="">
		</div>
		<!-- 分享指引图片 -->
		<div class="share-img" v-if="isShare" @click="closeShare">
			<img src="../../assets/shareGuide.png" alt="">
		</div>
		<!-- 商品轮播图 -->
		<div class="swiper-container banner" v-if="shopData">
			<div class="swiper-wrapper">
				<template v-if="shopData.image_list && shopData.image_list.length>0">
					<div class="swiper-slide" v-for="(banner,index) in shopData.image_list" :key="index"><img :src="banner" alt=""></div>
				</template>
				<div class="swiper-slide" v-else><img :src="shopData.thumb_img" alt=""></div>
			</div>
			<div class="swiper-pagination banner-paging"></div>
		</div>
		<!-- 商品信息 -->
		<div class="shop-data">
            <div class="line-top"></div>
			<!-- 商品名称 -->
			<div class="shop-name backColor-padding" v-text="shopData.goods_name"></div>
			<!-- 商品价格 -->
			<div class="shop-price-area backColor-padding">
				<div class="shop-price" v-if="isMainShop">
					<div class="shop-newPrice">¥{{shopData.shop_price}}</div>
					<div class="shop-olrPrice" v-if="Number(shopData.shop_price) < Number(shopData.market_price)">
						<span v-if="!isLoacl">门市价</span><span class="decoration">¥{{shopData.market_price}}</span>
					</div>
				</div>
				<div class="shop-price complimentary" v-else>
					<div class="shop-olrPrice">¥0.00</div>
					<div class="">
						<span>平台在售价: </span><span class="shop-newPrice decoration">¥{{shopData.shop_price}}</span>
					</div>
				</div>
				<span class="shop-work">[已售{{shopData.sales_sum}}]</span>
			</div>
         
			<!-- 是否七天无理由 -->
			<div v-if="(commonData.isActivity == 0 || commonData.isActivity == 2) && isMainShop && !isCityConcat" class="shop-hint backColor-padding">
				<template>
					<div v-if="shopData.give_count"><img class="shop-hint-img" src="../../assets/hint.png">本主产品最多可选择{{shopData.give_count}}款赠品</div>
					<div v-else></div>
				</template>
				<template>
					<div v-if="no_reason==1||no_reason==0"><span class="support"></span>7天无理由退货</div>
					<div v-if="no_reason==2"><span class="noSupport"></span>不支持7天无理由退货</div>
				</template>
			</div>
               <!-- 商品服务信息 -->
            <div class="serverData backColor">
                <div class="server-item" v-if="isLoacl && source_city">
                    <div class="server-title">发货</div>
                    <div class="server-content">{{source_city}}<span>库存剩{{shopData.store_count}}件</span></div>
                </div>
                <div class="server-item" v-if="service_title" @click="openServerData('server')">
                    <div class="server-title">服务</div>
                    <div class="server-content">{{service_title}}<img src="../../assets/advance.png" alt=""></div>
                </div>
                <div class="server-item" v-if="spec_info" @click="openSpe">
                    <div class="server-title">规格</div>
                    <div class="server-content">{{spec_info}}<img src="../../assets/advance.png" alt=""></div>
                </div>
                <div class="server-item" v-if="attr_info_string" @click="openServerData('parems')">
                    <div class="server-title">参数</div>
                    <div class="server-content">{{attr_info_string}}<img src="../../assets/advance.png" alt=""></div>
                </div>
            </div>
			<!-- 赠品 -->
			<template v-if="!isCityConcat && (isMainShop&&shopData.give_list&&shopData.give_list.length > 0) && (commonData.isActivity == 0 || commonData.isActivity == 2)">
				<complimentary class="backColor-padding"
					:good="shopData"
					:is-one-live="true"></complimentary>
				<div class="line-bottom"></div>
			</template>
		</div>
		<!-- 分享赚赠品 -->
		<div v-if="isMainShop" class="merchant share-present-area">
			<div class="merchant-title">分享赚赠品</div>
			<div class="swiper-container share-present">
				<div class="swiper-wrapper">
					<div class="swiper-slide swiper-no-swiping share-present-item" v-for="(share,index) in share_info.list" :key="index">
						<img :src="share.avatar" alt="">
						<span v-text="share.nickname" class="share-present-name"></span>
						<span v-text="share.desc" class="share-present-content"></span>
					</div>
				</div>
			</div>
			<div class="hink" @click="openTips">
				<img class="hintTrumpet" src="../../assets/hintTrumpet.png" alt="">
				<div class="hink-words" v-text="share_info.rules"></div>
				<img class="boottomArrow" src="../../assets/orangeBottomArrow.png" alt="">
			</div>
		</div>
		<!-- 商品店铺 -->
		<div class="merchant" v-if="is_overseas">
			<!-- 源头商品信息 -->
			<div class="merchant-title" v-if="!isLoacl">商家信息</div>
			<div class="store-area" v-if="isLoacl">
				<div class="store-img" :style="{backgroundImage: 'url(' + shop_info.logo + ')'}"></div>
				<div class="store-data">
					<div class="store-name">
						<div class="store-title">{{shop_info.shop_name}}</div>
            			<div class="gotoStore" @click="goToStore">进店逛逛</div>
					</div>
					<div class="grade">
						<span>商品描述 {{shop_info.goods_point?shop_info.goods_point:5}} <span class="star active"></span></span>
						<span>卖家服务 {{shop_info.shop_point?shop_info.shop_point:5}} <span class="star active"></span></span>
						<span>物流服务 {{shop_info.deliver_point?shop_info.deliver_point:5}} <span class="star active"></span></span>
					</div>
				</div>
			</div>
			<!-- 本地商品信息 -->
			<div class="store-area local-store" v-else>
				<div class="store-data">
					<div class="store-name">
						<div class="store-name-area">
							<span class="store-img" :style="{backgroundImage: 'url(' + shop_info.logo + ')'}"></span>
							<span class="store-title">{{shop_info.shop_name}}</span>
						</div>
						<div class="gotoStore" @click="goToStore">进店逛逛</div>
					</div>
					<div class="store-addr" v-text="shop_info.addr"></div>
					<div class="store-distance" @click="openMapUrl">
						<img src="../../assets/serve_unselected.png" alt="">
              			<span v-text="shop_info.distance"></span>
					</div>
				</div>
				<div class="telephone" @click.stop="telephone"><img src="../../assets/telephone.png" alt=""></div>
			</div>
		</div>
		
		<!-- 套餐 -->
		<div class="merchant" v-if="!isLoacl && shopData.goods_set_desc">
			<div class="merchant-content" :style="{'max-height': (isOpenSetMeal ? 'none':'')}" v-html="shopData.goods_set_desc"></div>
			<div class="purchase-more" v-if="!isOpenSetMeal" @click="openSetMeal">展开全部 <img src="../../assets/red_bottom_arrows.png" alt=""></div>
		</div>
		<!-- 购买须知 -->
		<div v-if="(!isLoacl || !is_overseas) && shopData.goods_desc" class="merchant">
			<div class="merchant-title">购买须知</div>
			<div class="merchant-content" :style="{'max-height': (isOpenMerchant ? 'none':'')}" v-html="shopData.goods_desc"></div>
			<div class="purchase-more" v-if="!isOpenMerchant" @click="openMerchant">更多购买须知 <img src="../../assets/red_bottom_arrows.png" alt=""></div>
		</div>
		<!-- 温馨提示 -->
		<div v-if="goods_tips" class="merchant">
			<div class="merchant-title">温馨提示</div>
			<div class="merchant-content" :style="{'max-height': (isOpenTips ? 'none':'')}" v-html="goods_tips"></div>
			<div class="purchase-more" v-if="!isOpenTips" @click="openWarmTips">更多温馨提示 <img src="../../assets/red_bottom_arrows.png" alt=""></div>
		</div>
		<!-- 商品详情 -->
		<div class="shop-details">
			<div class="shop-details-title"><img src="../../assets/shop_details1.png" alt=""><span>宝贝详情</span><img src="../../assets/shop_details2.png" alt=""></div>
			<div v-html="shopData.goods_content"></div>
		</div>
		<!-- 用户评价 -->
		<div class="evaluate" v-if="comment_list.length > 0">
			<span>用户评价 ({{comment_count}})</span>
		</div>
		<!-- 评价列表 -->
		<evaluate :comment_list="comment_list"></evaluate>
		<!-- 查看更多评价 -->
		<div class="evaluate evaluate-more" @click="skipEvaluate" v-if="comment_list.length > 0">
			<span>查看全部用户评价</span>
			<div class="evaluate-num">共{{comment_count}}条 <img src="../../assets/advance.png" alt=""></div>
		</div>
		<!-- 购买 -->
		<template v-if="!isCityConcat">
			<template v-if="isMainShop">
				<div class="buy-shop" :class="{'active': shopData.store_count == 0}" v-if='commonData.isActivity == 5 || commonData.isActivity == 6' @click="openSpe">立即领取</div>
				<div class="buy-shop" :class="{'active': shopData.store_count == 0}" v-else-if="commonData.isActivity == 0 || commonData.isActivity == 2" @click="openSpe"><span>立即购买</span></div>
				<div class="buy-shop" :class="{'active': shopData.store_count == 0 || able_buy == 0}" v-else @click="openSpe">立即购买</div>
			</template>
			<template v-else>
				<div class="buy-shop" :class="{'active': shopData.store_count == 0}" @click="openSpe">选为赠品</div>
			</template>
		</template>
		<!-- 商品服务信息弹窗 -->
		<div class="serverData-popUp" v-if="isServerData" @click="closeServerData">
			<div class="serverData-empty"></div>
			<div class="serverData-area" @click.stop>
				<div class="serverData-title">{{serverTitle}} <img @click="closeServerData"  v-if="serverData == 'server'" src="../../assets/close.png" alt=""></div>
				<div class="serverData-content" v-if="serverData == 'server'" v-html="service"></div>
				<div class="serverData-content serverData-content-list" v-if="serverData == 'parems'">
					<div class="serverData-item" v-for="(item,index) in attr_info" :key="index">
						<div class="serverData-name" v-text="item.name"></div>
						<div class="serverData-data" v-text="item.value"></div>
					</div>
				</div>
				<div class="serverData-confirm" v-if="serverData == 'parems'" @click="closeServerData">我知道了</div>
			</div>
		</div>
		<!-- 领取小贴士 -->
		<div class="bottomPop" @click="closeTips" v-if="isBottomPop">
			<div class="bottomPop-area" @click.stop>
				<img src="../../assets/guideClose.png" @click="closeTips" class="closeBottom" alt="">
				<div class="bottomPop-title">赠品领取小帖士</div>
				<div class="bottomPop-content">
					<img src="../../assets/hintTrumpet.png" alt="">
					<div v-html="share_info.rules"></div>
				</div>
			</div>
		</div>
  </div>
</template>
<script>
	import localStorageCorrelation from '@/js/localStorageCorrelation'
	import common from '@/js/common'
	import Swiper from "swiper";
	import Vue from 'vue';
	// 页面中的插件
	import evaluate from "@/components/evaluate";
	import complimentary from '@/components/complimentary';
	import popUp from '@/components/popUp';
	import shopGroup from "@/components/shopGroups";
	import specificationPopUp from "@/components/specificationPopUp";
	import textImage from '../../components/textImage.vue';
	export default {
      	name:'sourceShopDetails',
		data(){
			return {
				/* 商品相关 */
				isShare: false, // 是否分享
				shopData: {	},// 商品信息
				shop_id:'',  // 店铺id
				city_id: '',// 地址id
				shop_info:[],  // 店铺信息
				comment_count: '', // 评价总数
				comment_list: [], // 评价列表
				spec_info: '', // 规格信息
				isCollect: false, // 是否收藏
				isOpenMerchant: false,// 是否展开全部购买须知
				isOpenSetMeal: false, // 是否展开套餐
				isTextImage: false, // 是显示图文详情
				no_reason: '', // 是否支持七天无理由退款
				able_buy: 1 , // 是否可以购买
				able_buy_con: '', // 不可购买的提示
				isRepetitionClick: false, // 防止重复点击
				share_info: [],// 分享赚列表
				isBottomPop: false, // 领取小贴士
				isServerData: false, // 是否显示商品服务信息弹窗
				serverData: '',
				service: '',// 弹窗服务信息
				service_title: '', // 服务标题
				source_city: '', // 发货地
				attr_info_string: '',// 产品参数
				attr_info: [], // 产品参数列表
				is_overseas: false, // 是否为海外购
				goods_tips: '' , // 温馨提示
				isOpenTips: false, // 是否展开全部温馨提示
			}
		},
		computed:{
			// 是否为主商品
			isMainShop(){
				let isMainShop = common.getUrlParam("isBuyPresent");
				if(isMainShop){
					return isMainShop == 'true' ? true : false
				}
				return common.getUrlParam("isMainShop") == "true" ? true : false;
			},
			// 是否为本地
			isLoacl(){
				return common.getUrlParam("local") == 1 ? false : true;
			},
			// 是否选择商品 暂未用
			isSelectShop(){
				return common.getUrlParam("isSelectShop") == 'true' ? true : false;
			},
			//  是否为城市联盟
			isCityConcat:function(){
				return common.getUrlParam('isCityConcat');
			},
			// 存储的信息
			commonData(){
				return this.$store.state.commonData;
			},
			dlf_id(){
				return Number(localStorage.getItem("dlf_id")) || undefined;
			},
			// 分享赚的订单id
			share_main_order_goods_id(){
				return Number(common.getUrlParam("share_main_order_goods_id")) || false;
			},
			// 分享人的id
			sharePeopleId(){
				return Number(common.getUrlParam("pid")) || false;
			},
		},
      	mounted(){
			localStorageCorrelation.getLocalStorage(this);
			this.commonData.isEmptyShopGroup = common.getUrlParam("isEmptyShopGroup") == "false" ? false : true;
			this.requestSite();
			this.eventBus();
		},
		methods:{
			// 执行eventBus里面的函数
			eventBus(){
				var that = this;
				// 关闭提示框
				this.$eventBus.$on("closePopup",function(){
					that.isPopUp = false;
				});
				// 弹出规格选项
				this.$eventBus.$on('openSpecification',function(){
					that.openSpe();
				});
				// 关闭规格选项
				this.$eventBus.$on('closeSpe',function(){
					that.isRepetitionClick = false;
				})
			},
			// 请求地理位置
			requestSite(){
				var that = this;
				let addr = sessionStorage.getItem('user-addr');
				if(addr){
					let data = JSON.parse(addr);
					that.city_id = data.city_id;
					that.request({
						lng: data.lng,
						lat: data.lat
					});
				}
			},
			// 请求后台
			request(site){
				var that = this;
				this.dataService.getShopDetail({
					goods_id: common.getUrlParam("id"),
					tab_type: this.isMainShop?1:2,
					lng: site.lng,
					lat: site.lat,
					city_id:that.city_id,
					dlf_id: that.dlf_id
				}).then(function(resp){
					that.dataService.handleResponse({
						data: resp,
						callback: function(data){
							that.formattingData(data);
							if(!that.isMainShop){
								that.checkBuy();
							}
						}
					})
				}).catch(function(err){
					// alert(JSON.stringify(err))
				})
			},
			// 格式化数据
			formattingData(data){
				this.shopData = {
					thumb_img: data.thumb_img,  // 商品主图
					goods_id: data.goods_id,   // 商品id
					goods_name: data.goods_name,  // 商品名称
					shop_price: data.shop_price, // 商品价格
					market_price: data.market_price,  // 市场价格
					store_count: data.store_count,  // 库存
					sales_sum: data.sales_sum,  // 销量
					goods_content: this.formattingHtml(data.goods_content),  // 商品描述
					image_list: data.image_list,  // 商品图片列表
					goods_desc: this.formattingHtml(data.goods_desc),
					give_count_total:data.give_count_total,
					give_list:data.give_list,
					activity_id: data.activity_id,
					goods_set_desc: this.formattingHtml(data.goods_set_desc), // 套餐
					give_count:data.give_count, // 可选赠品数量
					goods_type: data.goods_type,
				};
				this.commonData.isActivity = data.activity_id;
				this.shop_id = data.shop_id;
				this.goods_type = data.goods_type;
				this.shop_info = data.shop_info;
				this.give_list = data.give_list;
				this.comment_count = data.comment_count;
				this.comment_list = this.initComminList(data.comment_list);
				this.spec_info = this.formattingForData(data.spec_info.spec_item_list);
				this.no_reason = data.no_reason;
				data.share_info.rules = data.share_info.rules ? data.share_info.rules.replace(/<br>/g,"<br><br>") : '';
				this.goods_tips = this.formattingHtml(data.goods_tips);
				this.share_info = data.share_info;
				this.service_title = data.service_title;
				this.service = this.formattingHtml(data.service);
				this.attr_info_string = this.formattingForData(data.attr_info);
				this.attr_info = data.attr_info;
				this.source_city = data.source_city;
				this.is_overseas = data.is_overseas == 0 ? true : false
				if(data.is_favor == 1){
					this.isCollect = true;
				}else{
					this.isCollect = false;
				}
				this.share();
				let winWidth = window.screen.width / 720 * 88 * 2;
				this.$nextTick(function () {
					new Swiper(".banner",{
						autoplay: true,
						delay: 5000,
						loop: true,
						pagination : {
							el:'.banner-paging',
						}
					});
					new Swiper(".share-present",{
						direction: 'vertical',
						autoplay: true,
						delay: 5000,
						loop: true,
						slidesPerView : 2,
						slidesPerGroup : 2,
						height: winWidth
					});
				});
			},
			// 格式化html数据
			formattingHtml(html){
				console.log()
				if(!html) return '';
				html = html.replace(/&lt;/g,"<");
				html = html.replace(/&gt;/g,">");
				html = html.replace(/&quot;/g,"'");
				html = html.replace(/&amp;nbsp;/g," ");
				html = html.replace(/white-space: nowrap;/g,"");
				return html;
			},
			// 格式化循环数据
			formattingForData(data){
				let dataHtme = '';
				for(let i = 0; i < data.length; i++){
					dataHtme += (data[i].spec_name || data[i].name) + ' '
				}
				return dataHtme;
			},
			initComminList(data){
				for(let i=0;i<data.length;i++){
					const one = data[i];
					if(one.content.length>100){
						one.text = one.content.substr(0,100)+'...';
						one.btnText  = '全文';
						this.$set(one,'showAll',true);
					}else{
						one.text = one.content;
						this.$set(one,'showAll',false);
					}
				}
				return data;
			},
			// 跳转地图
			openMapUrl(){
				let { lng , lat , shop_name} = this.shop_info;
				let url = 'http://api.map.baidu.com/marker?location='+lat+','+lng+'&title='+shop_name+'&output=html'
				// let url = 'https://uri.amap.com/marker?position='+ lng + ',' + lat +'&name='+shop_name;
				location.href = url;
			},
			// 获取是否可以选为赠品
			checkBuy(){
				if(!this.isMainShop) return false;
				let ssn_shopGroup = this.commonData.ssn_shopGroup,presentList = ssn_shopGroup.presentList,laterSelect = localStorage.getItem('main_order_goods_id');
				if(laterSelect) return false;
				let goods_give_item_id = [],select_give_goods_id = [],give_goods_num = [];
				for(let i = 0; i < presentList.length; i ++){
					goods_give_item_id.push(presentList[i].actualSpe?presentList[i].actualSpe:0);
					select_give_goods_id.push(presentList[i].goods_id);
					give_goods_num.push(1)
				}
				if(!this.isMainShop){
					goods_give_item_id.push(0);
					select_give_goods_id.push(common.getUrlParam("id"));
					give_goods_num.push(1);
				}
				let params = {
					main_goods_id: this.isMainShop?common.getUrlParam("id") : '',
					main_goods_item_id: 0,
					main_goods_num: 1,
					give_goods_id: select_give_goods_id.join(","),
					give_goods_item_id: goods_give_item_id.join(","),
					give_goods_num: give_goods_num.join(','),
				};
				this.dataService.checkBuy(params).then((resp) => {
					this.dataService.handleResponse({
						data: resp,
						callback: (data) => {
							this.able_buy = 1;
						},
						callback1001: (data) => {
							this.able_buy_con = data;
							this.able_buy = 0;
						}
					})
				})
			},
			// 返回
			goBack(){
				if(history.length<=1){
					window.location.href = './index.html';
					return false
				}
				history.back(-1);
			},
			// 打开分享提示
			shareOpen(){
				this.isShare = true;
			},
			// 关闭分享提示
			closeShare(){
				this.isShare = false;
			},
			// 分享
			share(){
				let title = this.shopData.goods_name+'----顺势鸟商城',
					des = this.shopData.goods_name + '--原价' + this.shopData.market_price + '元 现价' + this.shopData.shop_price + '元,限时抢购.更多优惠尽在顺势鸟商城.',
					imgUrl = this.shopData.thumb_img;
				common.shareFun(title,des,imgUrl);
			},
			// 弹出规格
			openSpe(){
				if(this.shopData.store_count == 0) return false;
				if(this.isRepetitionClick) return false;
				this.isRepetitionClick = true;
				if(!this.share_main_order_goods_id && JSON.stringify(this.commonData.ssn_shopGroup.mainShop) == "{}" && !this.isMainShop){
					localStorageCorrelation.openPopUp(this,{popupContent: '没有主商品不能选购赠品哦~'});
					return false
				}
				if(this.able_buy == 0){
					localStorageCorrelation.openPopUp(this,{popupContent: this.able_buy_con});
					return false
				}
				if(this.commonData.ssn_shopGroup.mainShop.goods_id == this.shopData.goods_id&&this.isMainShop) {
					window.location.href = "./confirmOrder.html";
					return false;
				}
				this.commonData.shopData = this.shopData;
				this.commonData.isSpe = true;
			},
			// 拨打电话
			telephone(){
				this.dataService.userVtel({
					shop_id:this.shop_id,
					goods_type:this.goods_type
				})
			},
			// 跳转评价页面
			skipEvaluate(){
				window.location.href = './shopComment.html?buyPresent='+this.isMainShop+'&id='+this.shopData.goods_id;
			},
			// 收藏商品
			collect(){
				var that = this;
				this.dataService.addUserFavor({
						goods_id: this.shopData.goods_id,
						tab_type:this.isMainShop?1:2
					}).then(function(resp){
					that.dataService.handleResponse({
						data: resp,
						callback: function(data){
							that.isCollect = true;
						}
					})
				})
			},
			// 取消收藏
			cancelCollect(){
				var that = this;
				this.dataService.cancelUserFavor({
						goods_id: this.shopData.goods_id,
						tab_type:this.isMainShop?1:2
					}).then(function(resp){
					that.dataService.handleResponse({
						data: resp,
						callback: function(data){
							that.isCollect = false;
						}
					})
				})
			},
			// 进入店铺
			goToStore(){
				window.location.href = './storeMerchant.html?shop_id='+this.shop_id + '&local=' + this.isLoacl + "&shop_name=" + encodeURIComponent(this.shop_info.shop_name) + "&city_id=" + this.city_id
			},
			// 展开全部购买须知
			openMerchant(){
				this.isOpenMerchant = true
			},
			// 展开全部的温馨提示
			openWarmTips(){
				this.isOpenTips = true
			},
			// 展开全部套餐
			openSetMeal(){
				this.isOpenSetMeal = true
			},
			// 打开小贴士
			openTips(){
				this.isBottomPop = true;
			},
			// 关闭小贴士
			closeTips(){
				this.isBottomPop = false;
			},
			// 打开商品服务信息
			openServerData(param){
				this.isServerData = true;
				if(param == 'server'){
                    this.serverData = 'server';
                    this.serverTitle = '产品服务';
				}else if(param == 'parems'){
                    this.serverData = 'parems';
                    this.serverTitle = '产品参数';
				}
			},
			// 关闭商品服务信息
			closeServerData(){
				this.isServerData = false
			}
		},
		components:{
			evaluate,
			complimentary,
			popUp,
			shopGroup,
			specificationPopUp,
			textImage
		}
  	}
</script>
<style lang="less">
	@import "../../less/swiper.min.css";
	@import "sourceShopDetails.less";
</style>
