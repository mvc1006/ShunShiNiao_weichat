<template>
	<div class="viewport">
		<!-- 回到顶部 -->
		<go-top></go-top>
		<!-- 商品组弹窗 -->
		<shopGroup :share_main_order_goods_id='share_main_order_goods_id'></shopGroup>
		<!-- 顶部搜索区域 -->
		<div class="header">
			<span class="go-back" @click="goBack"></span>
			<div class="header-input" @click="searchClick">
				<span class="search-img"></span>
				<span class="text">{{search_text}}</span>
			</div>
			<img @click="cutStyle" v-if="!isOneLive&&goods_type==1" class="header-style" src="../../assets/cutStyle.png" alt="">
			<img @click="cutStyle" v-if="isOneLive&&goods_type==1" class="header-style" src="../../assets/cutStyleOne.png" alt="">
			<div class="place-box" @click="changeCity" v-if="goods_type==2">
				<img src="../../assets/serve_unselected.png" alt=""> 
				<p>{{city_name}}<img src="../../assets/bottomArrows.png"/></p>
			</div>
		</div>
		<!-- 筛选方法 -->
        <component 
            :is="screen"
            ref="screenNew"
            :screenReset="screenReset" 
            :brand_list="brand_list" 
            :goods_type="goods_type" 
            :is_main="isBuyPresent ? '1':'2'">
        </component>
		<!-- 商品列表 -->
		<scroll v-if="goods_list.length>0" ref="scroll" :upBack="upBack" :downBack="downBack" :isEnd="isEnd">
			<template v-if="!active_id">
				<shop-list v-if="goods_type==1" :isMainShop="isBuyPresent" :is-one-live="isOneLive" :shop-list="goods_list" :isLoacl='goods_type==1?true:false' :selectPresent='share_main_order_goods_id'></shop-list>
				<localShopList v-if="goods_type==2" :isMainShop="isBuyPresent" :isStore="false" :shopList="goods_list" :isBuyPresent="isBuyPresent" :selectPresent='share_main_order_goods_id'></localShopList>
			</template>
			<template v-else>
				<local-pro v-for="(item,index) in goods_list" :key="index" :data="item" :showShopInfo="true" :isMain="true" :showGive="active_id==1?false:true"></local-pro>
			</template>
		</scroll>
		<div class="loading" v-if="!canLoading"></div>
		<div class="no-shop mescroll">
			<div v-if="goods_list.length<=0" class="no-shopList" style="pointer-events: auto;">
				<div class="no-content"></div> 
				<div>已无符合要求的商品</div>
			</div>
			<guess-like v-if="recommend_list.length > 0 && tab_type == 1" :goods_type='goods_type' :isMainShop='isBuyPresent' :shopList='recommend_list' :isOneLive='isOneLive'></guess-like>
		</div>
		<!-- 规格弹窗 -->
		<specificationPopUp v-if="commonData.isSpe" :isBuyPresent="isBuyPresent" :isMainShop="tab_type==1?true:false" :share_main_order_goods_id='share_main_order_goods_id'></specificationPopUp>
		<!-- 页面弹窗提示 -->
		<popUp v-if="commonData.isPopUp" :type="commonData.popupType" :time="commonData.popupTime" :content="commonData.popupContent" :isMainShop="isBuyPresent"></popUp>
	</div>
</template>
<script>
	import Swiper from "swiper";
	import localStorageCorrelation from '@/js/localStorageCorrelation'
	import shopList from "@/components/shopList";
	import localPro from '@/components/localService/localProduct.vue';
	import screenNew from "@/components/screenNew";
	import common from '@/js/common';
	import specificationPopUp from '@/components/specificationPopUp';
	import popUp from '@/components/popUp';
	import scroll from '@/components/scroll';
	import localShopList from '@/components/localShopList.vue';
	import shopGroup from "@/components/shopGroups";
	import goTop from '@/components/goTop';
    import guessLike from '@/components/guessLike';
    import history from '@/js/history'
	export default {
		name:'particulars',
		data(){
			return {
				goods_list: [],
				recommend_list: [], // 没有商品时显示的推荐
				isOneLive: false, // 是否为一排一个
				isBuyPresent: true, // 是否为主品区
				brand_list: [], // 品牌列表
				search_text: '', // 搜索关键字
				canLoading:true, // 是否加载完成
				isEnd:false, // 分页加载是否结束
				pages: 1, // 分页加载
				// 位置信息
				city_id: '',
				city_name: "",
				lat: "",
				lng: "",
				screenData: {},
                params:{},
                screen:'screenNew',
                isFristLoad: true, // 是否第一次加载
                screenReset:{}, // screennew 恢复上次的数据
                likeScroll:0
			}
		},
		computed:{
			goods_type:function(){
				return common.getUrlParam("goods_type");
			},
			tab_type:function(){
				return common.getUrlParam("tab_type");
			},
			search:function(){
				return decodeURIComponent(common.getUrlParam('search')) || '';
			},
			cat_id:function(){
				return common.getUrlParam("id") || '';
			},
			pageName(){
				return common.getUrlParam('page')||''
			},
			commonData(){
				return this.$store.state.commonData
			},
			main_order_goods_id(){
				return localStorage.getItem('main_order_goods_id');
			},
			active_id(){
				return Number(common.getUrlParam("active_id")) || '';
			},
			share_main_order_goods_id(){
				return Number(common.getUrlParam('share_main_order_goods_id')) || ''
			}
		},
		mounted(){
            history.init(this);
			if(this.$route.path=='/oneShop'){
				this.isOneLive = true;
			}else{
				this.isOneLive = false;
			}
			localStorageCorrelation.getLocalStorage(this);
			this.isBuyPresent = this.tab_type == 1 ? true : false;
			this.commonData.isEmptyShopGroup = common.getUrlParam("isEmptyShopGroup") == 'false'?false:true;
			this.search_text = this.search!='null'?this.search:'请输入要搜索的内容';
			this.getUserNowAddr();
            this.eventBus();
            let box = document.querySelector('.no-shop')
            box.onscroll = ()=>{
                this.likeScroll = box.scrollTop
            }
        },
        beforeDestroy(){
            document.querySelector('.no-shop').onscroll = null;
        },
		methods:{
			goTop(){
				let scroll = this.$refs.scroll.scroll;
				scroll.scrollTo(0,0,500);
			},
			// 切换城市
			changeCity(){
                history.clearData();
				location.href = './changeCity.html';
            },
            selectWay(){
                let storage = history.getData();
                if(storage){
                    this.historyBack(storage)
                }else{
                    this.request();
                }
            },
            historyBack({items,scrollY,maxScroll,screen}){

                this.screenReset = screen;
                this.screen = '';

                this.goods_list = items.goods_list;
                this.recommend_list = items.recommend_list;
                this.isOneLive = items.isOneLive;
                
                this.isBuyPresent = items.isBuyPresent;
                this.brand_list = items.brand_list;
                this.search_text = items.search_text;

                this.canLoading = true;
                this.isEnd = items.isEnd;
                this.pages = items.pages;

                this.city_id = items.city_id;
                this.city_name = items.city_name;
                this.lat = items.lat;
                this.screenData = items.screenData;
                this.params = items.params;
                this.likeScroll = items.likeScroll

                setTimeout(()=>{
                    this.screen = 'screenNew';
                    if(this.$refs.scroll){
                        let time = setInterval(() => {
                            let scroll = this.$refs.scroll.scroll;
                            if(scroll){
                                scroll.refresh();
                                scroll.maxScrollY = maxScroll;
                                scroll.scrollTo(0,scrollY,0);
                                clearInterval(time);
                            }
                        }, 100);
                    }else{
                        document.querySelector('.no-shop').scrollTop = this.likeScroll;
                    }
                },10)
            },
			// 获取位置
			getUserNowAddr(){
				var that = this;
				const cityInfo = sessionStorage.getItem('user-addr')?JSON.parse(sessionStorage.getItem('user-addr')):'';
				if(cityInfo){
					that.city_id = cityInfo.city_id;
					that.city_name = cityInfo.city_name.slice(0,2);
					that.lat = cityInfo.lat;
					that.lng = cityInfo.lng;
					this.initParams();
					this.selectWay();
				}
			},
			initParams(){
				//   params
				let param = {};
				var that = this;
				param.lat = this.lat;
				param.lng = this.lng;
				param.city_id = this.city_id;
				param.tab_type = this.tab_type;
				param.goods_type = this.goods_type;
				if(this.share_main_order_goods_id){
					param.share_main_order_goods_id = this.share_main_order_goods_id;
					param.keywords = this.search_text;
				}else{
					var ssn_shopGroup = this.commonData.ssn_shopGroup;
					var goods_give_item_id = [],select_give_goods_id = [],obj = '';
					for(let i = 0; i < ssn_shopGroup.presentList.length; i ++){
						goods_give_item_id.push(ssn_shopGroup.presentList[i].actualSpe);
						select_give_goods_id.push(ssn_shopGroup.presentList[i].goods_id);
					}
					if(this.search_text){
						param.keywords = this.search_text;
					}
					param.cat_id = this.cat_id;
					param.from = 'searchPage';
					if(param.cat_id){
						delete param.keywords;
					}
					if(this.main_order_goods_id){
						param.main_order_goods_id = this.main_order_goods_id;
					}
					if(this.active_id){
						param.activity_id = this.active_id
					}
					if(!this.active_id){
						param.select_main_goods_id = ssn_shopGroup.mainShop.goods_id?ssn_shopGroup.mainShop.goods_id:null;
						param.goods_main_item_id =  ssn_shopGroup.mainShop.actualSpe?ssn_shopGroup.mainShop.actualSpe:0;
						param.main_goods_num = this.commonData.ssn_shopGroup.mainShop.shopBuyNum;
						param.select_give_goods_id = select_give_goods_id.join(",");
						param.goods_give_item_id = goods_give_item_id.join(",");
					}
					if(this.isFristLoad){
						let bigId = common.getUrlParam("bigId")
						if(!this.cat_id && bigId){
							param.cat_id_1 = bigId;
							delete param.cat_id;
							delete param.keywords;
						}
					}
				}				
				this.params = Object.assign({},param);
				this.$eventBus.$emit('throwParams',param);
			},
			// 请求后台
			request(param = {}){
                history.clearData();
                this.canLoading = false;
                if(this.isFristLoad && (this.screenData.cat_id_1 || this.screenData.cat_id_2)){
                    this.isFristLoad = false;
                    delete this.params.cat_id_1;
                }
				let nowParam = Object.assign({},this.params,param);
                nowParam.page = this.pages;
				if(nowParam.cat_id_1 || nowParam.cat_id_2){
					if(nowParam.cat_id){
                        delete nowParam.cat_id;
                        delete this.params.cat_id;
						this.search_text = '请输入要搜索的内容';
					}
                }
				let that = this;
				this.dataService.getProList(nowParam).then(function(resp){
					that.dataService.handleResponse({
						data: resp,
						callback: function(data){
							that.canLoading = true;
							if(that.pages==1){
								that.isEnd = false;
								that.goods_list = [];
								that.recommend_list = [];
							}
							that.recommend_list = data.recommend_list;
							if(data.goods_list.length == 0){
								that.isEnd = true;
								return false;
							}
							for(let i = 0;i<data.goods_list.length;i++){
								if(!data.goods_list[i].other_goods){
									data.goods_list[i].other_goods = [];
								}
								data.goods_list[i].isMore = false;
							}
							that.goods_list = that.goods_list.concat(data.goods_list);
							if(data.goods_list.length==1&&that.pages==1){
								that.pages++;
								that.request(that.screenData);
							}
							that.$nextTick(()=>{
								if(that.$refs.scroll&&that.$refs.scroll.scroll){
									that.$refs.scroll.scroll.refresh();
								}
							})
						}
					})
				})
			},
			// $eventBus执行的方法
			eventBus(){
				// 筛选
				this.$eventBus.$on("screenWay",(param)=>{
                    // 删除进来时候的分类
                    if(param.cat_id_1 || param.cat_id_2){
                        delete this.params.cat_id_1;
                        delete this.params.cat_id_2;
                    }
                    document.querySelector('.no-shop').scrollTop = 0;
                    this.likeScroll = 0;
					this.pages = 1;
                    this.goods_list = [];
                    this.screenData = Object.assign({},param);
					this.request(this.screenData);
				});
				// 关闭提示框
				this.$eventBus.$on("closePopup",()=>{
					this.isPopUp = false;
				});
				// 回到顶部
				this.$eventBus.$on('scrollGoTop',()=>{
                    history.clearData();
					this.goTop();
				});
				// 确定规格时
				this.$eventBus.$on('confirm',()=>{
					this.pages = 1;
					this.initParams();
					this.request(this.screenData);
				})
			},
			// 返回上一页
			goBack(){
				if(this.pageName=='classifAll'){
					window.history.go(-1);
				}else{
					window.history.go(-2);
				}
			},
			// 点击搜索
			searchClick(){
				if(this.cat_id || this.pageName=='classifAll'){
					window.location.href = './search.html?tab_type=' + this.tab_type + "&goods_type=" + this.goods_type + "&search_text=" + this.search;
				}else{
					window.history.go(-1);
				}
			},
			// 点击切换商品列表样式
			cutStyle(){
				this.isOneLive = !this.isOneLive;
				if(this.isOneLive){
					this.$router.replace("/oneShop")
				}else{
					this.$router.replace("/twoShop")
				}
			},
			// 上拉刷新
			upBack(){
				if(this.canLoading){
					this.pages ++;
					this.request(this.screenData);
				}
			},
			// 下拉刷新
			downBack(){
				if(this.canLoading){
					this.pages = 1;
					// this.goods_list = [];
					this.isEnd = false;
					this.request(this.screenData);
				}
			}
		},
		components:{
			shopList,
			screenNew,
			specificationPopUp,
			popUp,
			scroll,
			localShopList,
			goTop,
			shopGroup,
			guessLike,
			localPro
		}
	}
</script>
<style lang="less">
  @import "searcResult.less";
  .no-shop{
    overflow: auto !important;
  }
</style>
