<template>
	<div class="viewport">
		<!-- 头部 -->
		<div class="header">{{shopData.goods_name}}</div>
		<!-- 轮播 -->
		<!-- 商品轮播图 -->
		<div class="swiper-container banner">
			<div class="swiper-wrapper">
				<div class="swiper-slide" v-if="shopData.image_list && shopData.image_list.length == 0"><img :src="shopData.thumb_img" alt=""></div>
				<div class="swiper-slide" v-else v-for="(banner,index) in shopData.image_list" :key="index"><img :src="banner" alt=""></div>
			</div>
			<div class="swiper-pagination banner-paging"></div>
		</div>
		<!-- 商品信息 -->
		<div class="shop-data">
			<!-- 商品名称 -->
			<div class="shop-name">{{shopData.goods_name}}</div>
			<!-- 商品价格 -->
			<div class="shop-price">
				<!-- 主品 -->
				<div v-if="isMainShop">
					<span class="shop-newPrice">¥{{shopData.shop_price}}</span>
					<span class="shop-oldPrice" v-if="shopData.shop_price!=shopData.market_price">¥{{shopData.market_price}}</span>
				</div>
				<!-- 赠品 -->
				<div class="complimentary" v-else>
					<span class="shop-oldPrice">¥0.00</span>
					<span class="shop-newPrice give-price">平台在售价: <span class="strikethrough">¥{{shopData.shop_price}}</span></span>
				</div>
				<span class="shop-work">[已售{{shopData.sales_sum}}]</span>
			</div>
			<!-- 可选赠品 -->
			<div v-if="(shopData.activity_id == 0 || shopData.activity_id == 2) && isMainShop" class="shop-hint">
				<div><img class="shop-hint-img" src="../../assets/hint.png">本主产品最多可选择{{shopData.give_count}}款赠品</div>
				<div v-if="no_reason==1||no_reason==0"><span class="support"></span>7天无理由退货</div>
				<div v-if="no_reason==2"><span class="noSupport"></span>不支持7天无理由退货</div>
			</div>
      	</div>
		<!-- 赠品 -->
      	<complimentary v-if="isPresent" :good="shopData" :is-one-live="true"></complimentary>
		<!-- 套餐 -->
		<div class="merchant" v-if="shopData.goods_set_desc">
			<div class="merchant-content" :style="{'max-height': (isOpenSetMeal ? 'none':'')}" v-html="shopData.goods_set_desc"></div>
			<div class="purchase-more" v-if="!isOpenSetMeal" @click="openSetMeal">展开全部 <img src="../../assets/red_bottom_arrows.png" alt=""></div>
		</div>
		<!-- 购买须知 -->
		<div v-if="!isLoacl" class="merchant">
			<div class="merchant-title">购买须知</div>
			<div class="merchant-content" :style="{'max-height': (isOpenMerchant ? 'none':'')}" v-html="shopData.goods_desc"></div>
			<div class="purchase-more" v-if="!isOpenMerchant" @click="openMerchant">更多购买须知 <img src="../../assets/red_bottom_arrows.png" alt=""></div>
		</div>
		<!-- 商品详情 -->
		<div class="shop-details">
			<div class="shop-details-title"><img src="../../assets/shop_details1.png" alt=""><span>宝贝详情</span><img src="../../assets/shop_details2.png" alt=""></div>
			<div v-html="shopData.goods_content"></div>
		</div>
		<!-- 用户评价 -->
		<div class="evaluate" v-if="comment_list.length>0">
			<span>用户评价 ({{comment_count}})</span>
		</div>
		<!-- 评价列表 -->
		<evaluate :comment_list="comment_list"></evaluate>
        <div class="bottom-btn">
            <!-- <div class="btn"><a :href="shareUrl">在APP中查看</a></div> -->
            <div class="btn" @click="downloadApp">下载APP</div>
        </div>
	</div>
</template>
<script>
	import common from '@/js/common';
	import Swiper from "swiper";
	import complimentary from '@/components/complimentary';
	import evaluate from "@/components/evaluate";
	export default {
		name:'sourceShopDetails',
		data(){
			return {
				shopData: {},// 商品信息
				city_id: '', // 城市id
				no_reason: '', // 是否支持七天无理由退款
				isOpenSetMeal: '', // 套餐是否展开
				isOpenMerchant: '', // 购买须知是否展开
				comment_count: '', // 评价总数
                comment_list: [], // 评价列表
			}
		},
		mounted(){
			if(this.isLoacl){
				this.requestSite();
			}else{
				this.request();
			}
			this.requestSite()
		},
		methods:{
            downloadApp(){
               var u = navigator.userAgent;
                var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
                var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
                if (isAndroid) {
                    location.href = 'http://downloadpkg.apicloud.com/app/download?path=http://A6002817142081.qiniucdn.apicloud-system.com/10666595856dd71be8ac64b884604e42_d';
                }
                if (isIOS) {
                    alert('敬请期待苹果版app上线')
                }
            },
			// 请求地理位置
			requestSite(){
				this.dataService.getUserNowAddr().then((resp) => {
					this.dataService.handleResponse({
						data: resp,
						callback: (data) => {
							this.city_id = data.city_id;
							this.request({
								lng: data.lng,
								lat: data.lat
							});
						}
					})
				});
			},
			// 请求后台
			request(site = {}){
				this.dataService.getShopDetail({
					goods_id: this.good_id,
					tab_type: this.isMainShop ? 1 : 2,
					lng: site.lng,
					lat: site.lat,
					city_id:this.city_id,
					dlf_id: this.dlf_id
				}).then((resp) => {
					this.dataService.handleResponse({
						data: resp,
						callback: (data) => {
							this.formattingData(data);
						}
					})
				}).catch(function(err){
					console.log(err)
				})
			},
			// 格式化数据
			formattingData(data){
				let goods_content = '', goods_desc = '', goods_set_desc = '';
				if(data.goods_content){
					goods_content = data.goods_content.replace(/&lt;/g,"<");
					goods_content = goods_content.replace(/&gt;/g,">");
				}
				if(data.goods_desc){
					goods_desc = data.goods_desc.replace(/&lt;/g,"<");
					goods_desc = goods_desc.replace(/&gt;/g,">");
					goods_desc = goods_desc.replace(/&quot;/g,"'");
					goods_desc = goods_desc.replace(/&amp;nbsp;/g," ");
					goods_desc = goods_desc.replace(/white-space: nowrap;/g,"");
				}
				if(data.goods_set_desc){
					goods_set_desc = data.goods_set_desc.replace(/&lt;/g,"<");
					goods_set_desc = goods_set_desc.replace(/&gt;/g,">");
					goods_set_desc = goods_set_desc.replace(/&quot;/g,"'");
					goods_set_desc = goods_set_desc.replace(/&amp;nbsp;/g," ");
					goods_set_desc = goods_set_desc.replace(/white-space: nowrap;/g,"");
				}
				this.shopData = {
					activity_id: data.activity_id, // 活id
					thumb_img: data.thumb_img, // 主图
					image_list: data.image_list, // 轮播图
					goods_name: data.goods_name, // 商品名称
					shop_price: data.shop_price, // 商品价格
					market_price: data.market_price,  // 市场价格
					sales_sum: data.sales_sum, // 已售
					give_count: data.give_count, // 可选赠品数
					give_list: data.give_list, // 赠品列表
					goods_content: goods_content,// 图文详情
					goods_set_desc: goods_set_desc, // 套餐
					goods_desc: goods_desc, // 购买须知
				}
				this.no_reason = data.no_reason; // 七天无理由退款
				this.comment_count = data.comment_count; // 评论总数
          		this.comment_list = this.initComminList(data.comment_list);
				this.$nextTick(function () {
					new Swiper(".banner",{
						autoplay: true,
						delay: 5000,
						loop: true,
						pagination : {
							el:'.banner-paging',
						}
					});
				});
			},
			// 评论处理
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
			// 展开全部购买须知
			openMerchant(){
				this.isOpenMerchant = true
			},
			// 展开全部套餐
			openSetMeal(){
				this.isOpenSetMeal = true
			},
		},
		computed:{
			// 是否主品
			isMainShop(){
				return common.getUrlParam("isMainShop") == 'false' ? false : true;
			},
			// 是否本地
			isLoacl(){
				return common.getUrlParam("local") == 1? false : true;
			},
			// 商品id
			good_id(){
				return common.getUrlParam("id");
			},
			// 是否有赠品
			isPresent(){
				return (this.isMainShop && this.shopData.give_list && this.shopData.give_list.length > 0) && (this.shopData.activity_id == 0 || this.shopData.activity_id == 2)
            },
            shareUrl(){
                return 'ssnshopping://?share=1&id='+this.good_id+'&is_main='+ this.isMainShop;
            }
		},
		components:{
			complimentary,
			evaluate
		}
	}
</script>
<style lang="less">
	@import "../../less/swiper.min.css";
    @import "sourceShopDetailsShare.less";
    .bottom-btn{
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        background: @white-color;
        .pxRem(padding-top,16);
        .pxRem(padding-bottom,16);
        .flex();
        .alignItems();
        .justifyContent(space-around);
        .btn{
            .pxRem(padding-left,30);
            .pxRem(padding-right,30);
            .pxRem(line-height,76);
            .borderRadius(8);
            .pxRem(font-size,26);
            background: @red-color;
            color: @white-color;
            text-align: center;
            a{
                width: 100%;
                height: 100%;
                display: block;
                color: @white-color;
            }

        }
    }

</style>
