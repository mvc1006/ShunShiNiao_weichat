<template>
<div class="viewport">
	<div class='loading-area' v-if='!isLoading'>
		<div class="loading" ></div>
	</div>
	<!-- 商品组弹窗 -->
	<shopGroup  v-if="!isTrading"></shopGroup>
	<!-- 头部返回 -->
	<div class="header">
		<span class="go-back" @click="goBack"></span>
		<div v-text="store_name"></div>
		<div class="goHome" @click="goHome">返回首页</div>
	</div>
	<!-- 菜单 -->
	<div class="menu" v-if="!isTrading">
		<div v-for="(item,index) in menu" :key="index" :class="menuIndex==index?'active':''" @click="cutMenu(index)">{{item}}</div>
	</div>
	<scroll ref="scroll" :upBack="upBack" :downBack="downBack" :isEnd="isEnd" v-if="!storeSever&&goods_list.length!=0">
		<!-- 商品列表 -->
		<localShopList class="shopSelectArea" v-if="!isLoacl" :isMainShop="isMainShop" :isStore="true" :shopList="goods_list"></localShopList>
		<shop-list v-if="isLoacl" is-zero-buy="true" :pageName='"storeMerchant"' :isMainShop="isMainShop" :is-one-live="true" :shop-list="goods_list"></shop-list>
	</scroll>
	<div v-if="!storeSever&&goods_list.length==0" class="no-shopList" style="pointer-events: auto;"><div class="no-content"></div> <div>已无符合要求的商品</div></div>
	<!-- 商家信息 -->
	<div class="store-data" v-if="storeSever">
		<div class="store-item"><span class="store-name">商家名称</span><span class="store-content">{{store_data.shop_name}}</span></div>
		<div class="store-item"><span class="store-name" v-if="store_data.shop_type != 0">商家类型</span><span class="store-content">{{store_data.shop_type_name}}</span></div>
		<div class="store-item"><span class="store-name">商家品类</span><span class="store-content">{{store_data.cate_name}}</span></div>
		<div class="store-item" @click="openMapUrl"><span class="store-name">商家地址</span><span class="store-content">{{store_data.shop_address}}</span></div>
		<div class="store-item"><span class="store-name">商家电话</span><span class="store-content">{{store_data.tel}}</span></div>
		<div class="store-item" v-if="!isTrading"><span class="store-name">营业时间</span><span class="store-content">{{store_data.shop_hours}}</span></div>
		<!--<div class="store-item" @click="aptitude"><span class="store-name">营业资质</span><span class="next-ico"></span></div>-->
		<div class="store-item" v-if="isTrading" @click="turnover"><span class="store-name">商家营业额</span><span class="next-ico"></span></div>
	</div>
	<!-- 店铺启用规格 -->
	<div class="store-open" v-if="isTrading">
		<div class="store-open-title">店铺启用状态</div>
		<div class="store-open-btn" @click='storeOPen()' :class='isOpen?"active":""'><div></div></div>
	</div>
	<!-- 商家服务 -->
    <template v-if="store_data.shop_service &&  store_data.shop_service.length > 0">
        <div class="store-sever" v-if="!isTrading && storeSever">
            <div class="store-sever-title">商家服务</div>
            <div class="sever-list">
                <span v-for="(service,index) in store_data.shop_service" :key="index">{{service}}</span>
            </div>
        </div>
    </template>
	
	<!-- 移出商圈 -->
	<div class="outTrading" v-if="isTrading" @click="outTrading">移除商圈</div>
	<!-- 规格弹窗 -->
	<specificationPopUp v-if="commonData.isSpe" :isMainShop="isMainShop"></specificationPopUp>
	<!-- 提示弹窗 -->
	<popUp v-if="commonData.isPopUp" :type="commonData.popupType" :time="commonData.popupTime" :content="commonData.popupContent" :isMainShop='isMainShop'></popUp>
</div>
</template>
<script>
import scroll from '@/components/scroll';
import common from '@/js/common'
import localStorageCorrelation from '@/js/localStorageCorrelation';
import localShopList from '../../components/localShopList.vue';
import specificationPopUp from '@/components/specificationPopUp';
import shopGroup from "@/components/shopGroups";
import popUp from '@/components/popUp';
import shopList from "@/components/shopList.vue";
import loading from '@/components/loading.vue';
import history from '@/js/history'
export default {
	name:'storeMerchant',
	data(){
		return {
			isLoading: false, // 初始化是否加载完成
			store_name: '', // 店铺名称
			isGotoPresent: true, // 跳转赠品页面
			menu: ['主商品','赠品','商家'],
			menuIndex: 0,
			isMainShop: true, // 是否为主商品
			storeSever: false, // 是否为商家信息
			store_id: '', // 店铺id
			isLoacl: true, // 是否为本地 true为不是，false为是
			goods_list: [{}],//
			store_data: {
				shop_service:[]
			}, // 店铺信息
			canLoading:true, // 是否加载完成
			isEnd:false, // 分页加载是否结束
			pages: 1, // 分页加载
			// 位置信息
			city_id: '',
			city_name: "",
			lat: "",
			lng: "",
			isOpen: true, // 店铺是否开始
		}
	},
	mounted(){
        this.eventBus();
		localStorageCorrelation.getLocalStorage(this);
        history.init(this);
        let storage = history.getData();
        if(storage){
            this.historyBack(storage)
        }else{
            this.store_name = decodeURIComponent(common.getUrlParam("shop_name"))!="null"?decodeURIComponent(common.getUrlParam("shop_name")):"店铺信息";
            var isLoacl = common.getUrlParam("local")=='true'?true:false;
            this.isLoacl = isLoacl;
            this.store_id = common.getUrlParam("shop_id");
            if(this.isTrading){
                this.cutMenu(2);
                return false;
            }
            if(this.$route.path=='/main'){
                this.cutMenu(0)
            }else if(this.$route.path=='/give'){
                this.cutMenu(1)
            }else if(this.$route.path=='/merchant'){
                this.cutMenu(2)
            }
            this.getUserNowAddr();
        }
	},
	methods:{
        historyBack({items,scrollY,maxScroll}){
            this.isLoading = items.isLoading;
            this.store_name = items.store_name;
            this.isGotoPresent = items.isGotoPresent;

            this.menu = items.menu;
            this.menuIndex = items.menuIndex;
            this.isMainShop = items.isMainShop;
            this.storeSever = items.storeSever;
            this.store_id = items.store_id;

            this.isLoacl = items.isLoacl;
            this.goods_list = items.goods_list;
            this.store_data = items.store_data;

            this.city_id = items.city_id;
            this.city_name = items.city_name;
            this.lat = items.lat;
            this.lng = items.lng;
            this.isOpen = items.isOpen;

            this.canLoading = true;
            this.isEnd = items.isEnd;
            this.pages = items.pages;

            this.$nextTick(()=>{
                let time = setInterval(() => {
                    let scroll = this.$refs.scroll.scroll;
                    if(scroll){
                        scroll.refresh();
                        scroll.maxScrollY = maxScroll;
                        scroll.scrollTo(0,scrollY,0);
                        clearInterval(time);
                    }
                }, 100);
            })
        },
        openMapUrl(){
              let { lng , lat , shop_name} = this.store_data;
              let url = 'http://api.map.baidu.com/marker?location='+lat+','+lng+'&title='+shop_name+'&output=html'
            //   let url = 'https://uri.amap.com/marker?position='+ lng + ',' + lat +'&name='+shop_name;
                location.href = url;
          },
		// 获取位置
		getUserNowAddr(){
			let userAddr = JSON.parse(sessionStorage.getItem("user-addr"));
			this.city_id = userAddr.city_id;
            this.city_name = userAddr.city_name;
            this.lat = userAddr.lat;
			this.lng = userAddr.lng;
            this.request();
		},
		// 请求后台
		request(){
            history.clearData();
			var that = this;
			this.dataService.getProList({
				tab_type: this.isMainShop?1:2,
				goods_type: this.isLoacl?1:2,
				shop_id: this.store_id, //172
				city_id: this.city_id,
				lat: this.lat,
				lng: this.lng,
				page: this.pages
			}).then(function(resp){
				that.dataService.handleResponse({
					data: resp,
					callback: function(data){
						if(data.goods_list.length == 0){
							that.isEnd = true
						}
						if(that.pages==1){
							that.goods_list=[];
						}
						that.goods_list = that.goods_list.concat(data.goods_list);
						that.$nextTick(()=>{
							if(that.$refs.scroll&&that.$refs.scroll.scroll){
								that.$refs.scroll.scroll.refresh();
							}
							that.isLoading = true;
						})
					}
				})
			})
		},
		// 执行eventBus里面的函数
		eventBus(){
			var that = this;
			// 关闭提示框
			this.$eventBus.$on("closePopup",function(){
				that.isPopUp = false;
			});
		},
		// 返回
		goBack(){
			if(window.history.length <= 1){
				window.location.href = './localService.html';
				return false
			}
			window.history.back(-1);
		},
		// 返回首页
		goHome(){
			window.location.href = './localService.html'
		},
		// 切换菜单
		cutMenu(num){
            history.clearData();
			if(this.menuIndex==num) return false;
			this.isLoading = false;
			this.menuIndex = num;
			this.storeSever = num == 2 ? true : false,
			this.isMainShop = num == 0 ? true : false
			if(num == 2){
				this.$router.replace("merchant");
				var that = this;
				if(that.isTrading){
					this.dataService.areaerShopDetail({
						shop_id: this.store_id, //172
						area_id: this.area_id
					}).then(function(resp){
						that.dataService.handleResponse({
							data: resp,
							callback: function(data){
								that.store_data = data;
								that.isOpen = data.status==1?true:false
								that.$nextTick(()=>{
									that.isLoading = true
								})
							}
						})
					})
					return false;
				}
				this.dataService.shopInfo({
					goods_type: this.isLoacl?1:2,
					shop_id: this.store_id, //172
				}).then(function(resp){
					that.dataService.handleResponse({
						data: resp,
						callback: function(data){
						that.store_data = data;
							that.$nextTick(()=>{
								that.isLoading = true
							})
						}
					})
				})
			}else{
				if(num==0){
					this.$router.replace("main");
				}else{
					this.$router.replace("give");
				}
				this.page = 1;
				this.getUserNowAddr();
			}
		},
		// 店铺是否开启
		storeOPen(){
			var that = this;
			this.isOpen = !this.isOpen;
			this.dataService.shopMng({
				mng_type: this.isOpen?2:1,
				area_id: this.area_id,
				shop_id: this.store_id, //172
			}).then(function(resp){
				if(resp.data.code == 1000){
					that.commonData.isPopUp = true;
					that.commonData.popupType = 1;
					that.commonData.popupTime = 3000;
					that.commonData.popupContent = that.isOpen?"店铺已开启":"店铺已关闭";
				}
			})
		},
		// 移出商圈
		outTrading(){
			var that = this;
			this.dataService.shopMng({
				mng_type: 100,
				area_id: this.area_id,
				shop_id: this.store_id, //172
			}).then(function(resp){
				if(resp.data.code == 1000){
				that.commonData.isPopUp = true;
				that.commonData.popupType = 1;
				that.commonData.popupTime = 3000;
				that.commonData.popupContent = "已移出商圈";
				setTimeout(function(){
					that.goBack();
				},3000)
				}
			})
		},
		// 跳转营业资质页面
		aptitude(){
            history.clearData();
			window.location.href = './businessQualification.html?goods_type='+ (this.isLoacl?1:2) + '&store_id='+ this.store_id;
		},
		// 跳转商家营业额
		turnover(){
            history.clearData();
			window.location.href = './merchantDealDetail.html?store_id='+ this.store_id;
		},
		// 上拉刷新
		upBack(){
			if(this.canLoading){
				this.pages ++;
			this.request();
			}
		},
		// 下拉刷新
		downBack(){
			if(this.canLoading){
				this.pages = 1;
				this.isEnd = false;
			this.request();
			}
		}
	},
	computed:{
		commonData(){
			return this.$store.state.commonData
		},
		isTrading(){
			return common.getUrlParam("isTrading")=='true'?true:false
		},
		area_id(){
			return localStorage.getItem('area_id')
		},
	},
	components:{
		localShopList,
		specificationPopUp,
		popUp,
		shopList,
		scroll,
		loading,
		shopGroup
	}
}
</script>
<style lang="less">
	@import "storeMerchant.less";
</style>
