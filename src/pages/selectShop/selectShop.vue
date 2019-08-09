<template>
	<div class="viewport">
		<!-- 商品组弹窗 -->
		<shopGroup :share_main_order_goods_id='share_main_order_goods_id'></shopGroup>
		<!-- 规格弹窗 -->
		<specificationPopUp v-if="commonData.isSpe" :isMainShop="isMainShop" :share_main_order_goods_id='share_main_order_goods_id'></specificationPopUp>
		<!-- 页面弹窗提示 -->
		<popUp v-if="commonData.isPopUp" :type="commonData.popupType" :time="commonData.popupTime" :content="commonData.popupContent" :isMainShop="isMainShop"></popUp>
		<!-- 头部 -->
		<homeModule :is-main-shop="false" :selectPresent='share_main_order_goods_id' :is-buy-present="isMainShop" :cate-list="cate_list" :is-one-live="isOneLive" :main-menu="mainMenu" :search_text="search_text" :currentSite="currentSite" :isSelectShop="'selectShop'"></homeModule>
		<!-- 筛选 -->
		<component ref="screenNew" 
			:is="screen" 
			:screenReset="screenReset"
			:brand_list="brand_list" 
			:goods_type="isLoacl?'1':'2'" 
			:is_main="isMainShop ? '1':'2'">
		</component>
		<!-- 源头商品列表 -->
		<scroll v-if="goods_list.length > 0" ref="scroll" :upBack="upBack" :downBack="downBack" :isEnd="isEnd">
			<!-- 源头商品区域 -->
			<shop-list v-if="isLoacl" :selectPresent='share_main_order_goods_id' :isMainShop="isMainShop" :pageName="'selectShop'" :is-one-live="isOneLive" :shop-list="goods_list" :isLoacl='isLoacl'></shop-list>
			<!-- 本地商品列表 -->
			<div class="local-product" v-if="!isLoacl">
				<local-product :isMainShop="isMainShop" :selectPresent='share_main_order_goods_id' :isStore="false" :shopList="goods_list" :isBuyPresent="isMainShop"></local-product>
			</div>
		</scroll>
		<!--  没有符合的产品 -->
		<div class="no-shopList" v-if="goods_list.length == 0">
			<div class="no-content"></div>
			<div class="">已无符合要求的商品</div>
		</div>
		<!-- 底部结算 -->
		<div class="footer"><div class="submit" v-preventReClick @click.prevent="submit">提交订单</div></div>
	</div>
</template>
<script>
import common from "@/js/common";
import localStorageCorrelation from '@/js/localStorageCorrelation'
// 页面中需要的插件
import shopList from '@/components/shopList';
import homeModule from "@/components/homeModule";
import shopGroup from "@/components/shopGroups";
import specificationPopUp from '@/components/specificationPopUp';
import popUp from '@/components/popUp';
import screenNew from "@/components/screenNew.vue";
import localProduct from '@/components/localShopList.vue';
import scroll from '@/components/scroll';
import history from '@/js/history'
export default {
    name:'index',
    data(){
      return {
		isFirstEnter: true,
		isMainShop: '', // 是否为主商品
		laterSelect: '', // 订单号
        // 主内容相关
        isLoacl: true, // 本地还是源头
        number: 0, // 底部菜单选择的是那个
        isOneLive: true, // 是否为一排一个
        search_text: '', // 搜索中显示的文字
        mainMenu: 0,// 选择的是哪个主菜单
        cate_list: [],   // 商品分类列表
        goods_list: [],   // 商品列表
        brand_list: [],   // 品牌列表
        currentSite: '', // 当前位置
        canLoading: true, // 是否加载完成
        isEnd: false, // 分页加载是否结束
        pages: 1, // 分页加载
        params: {},
        screen: '',
        address: {},
		screenParams: {},
		screenReset: {}
    }
	},
	computed:{
		// store 中的数据
		commonData(){
			return this.$store.state.commonData
		},
		// 领取赠品id
		share_main_order_goods_id(){
			return Number(common.getUrlParam('share_main_order_goods_id')) || false
		}
    },
    mounted(){
	  localStorageCorrelation.getLocalStorage(this);
	  this.isMainShop = common.getUrlParam("buyPresent") == 'true' ? true : false;
	  this.laterSelect = localStorage.getItem('main_order_goods_id');
      this.commonData.isActivity = common.getUrlParam("isActivity");
      let addr = sessionStorage.getItem('user-addr');
      this.address = JSON.parse(addr);
        history.init(this);
        let storage = history.getData();
        if(storage && !sessionStorage.getItem('select-give')){
            this.historyBack(storage)
        }else{
            sessionStorage.removeItem('select-give');
            history.clearData();
            // 正常的渲染流程
            if(this.$route.path=='/source'){
                this.cutMainMenu(0);
                this.isOneLive = true;
            }else if(this.$route.path=='/source/isOneLive'){
                this.cutMainMenu(0);
                this.isOneLive = false;
            }else if(this.$route.path=='/locality'){
                this.cutMainMenu(1)
            }
        }
        this.eventBus();
    },
    methods:{
		historyBack({items,scrollY,maxScroll,screen}){
            this.screenReset = screen;

            this.isFirstEnter = items.isFirstEnter;
            this.isMainShop = items.isMainShop;
            this.laterSelect = items.laterSelect;

            this.isLoacl = items.isLoacl;
            this.number = items.number;
            this.isOneLive = items.isOneLive;
            this.search_text = items.search_text;
            this.mainMenu = items.mainMenu;

            this.cate_list = items.cate_list;
            this.goods_list = items.goods_list;
            this.brand_list = items.brand_list;
            this.currentSite = items.currentSite;
            this.canLoading = true;
            this.isEnd = items.isEnd;
            this.pages = items.pages;
            this.params = items.params;
            this.screen = items.screen;
            this.address = items.address;
            this.screenParams = items.screenParams;
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
		request(){
			history.clearData();
			let newParam = Object.assign({},this.params,this.screenParams);
			var that = this;
			newParam.page = that.pages;
			
			this.dataService.getProList(newParam).then(function(resp){
			that.dataService.handleResponse({
				data: resp,
				callback: function(data){
                    if(that.pages==1){
                        that.isEnd = false;
                        that.goods_list = [];
                        that.cate_list = [];
                        that.brand_list = [];
                    }
                    if(data.goods_list.length == 0){
                        that.isEnd = true;
                    }
                    if(data.goods_list.length == 0&&that.isFirstEnter){
                        that.cutMainMenu(1);
                    }
                    that.isFirstEnter = false;
                    that.goods_list = that.goods_list.concat(data.goods_list);
                    that.cate_list = that.cate_list.concat(data.cate_list);
                    that.brand_list = that.brand_list.concat(data.brand_list);
                    that.search_text = data.recommend_search_word;
                    that.refreshScroll();
                    }
                })
			})
		},
		refreshScroll(){
			this.$nextTick(()=>{
				if(this.$refs.scroll&&this.$refs.scroll.scroll){
					this.$refs.scroll.scroll.refresh();
					if(this.pages == 1){
						let scroll = this.$refs.scroll.scroll;
						this.$refs.scroll.scroll.scrollTo(0,0);
	
					}
				}
			})
		},
		// 判断请求后台的数据
		transmitData(){
			if(this.share_main_order_goods_id){
				this.currentSite = this.address.city_name.slice(0,2);
				this.params.share_main_order_goods_id = this.share_main_order_goods_id;
				this.params.lat = this.address.lat;
				this.params.lng = this.address.lng;
				this.params.city_id = this.address.city_id;
				this.params.goods_type = this.mainMenu ==0 ? 1 : 2;
				this.params.tab_type = this.isMainShop ? 1 : 2;
			}else{
				var goods_give_item_id = [],select_give_goods_id = [],obj = '';
				for(let i = 0; i < this.commonData.ssn_shopGroup.presentList.length; i ++){
					goods_give_item_id.push(this.commonData.ssn_shopGroup.presentList[i].actualSpe);
					select_give_goods_id.push(this.commonData.ssn_shopGroup.presentList[i].goods_id);
				}
				this.currentSite = this.address.city_name.slice(0,2);
				this.params.lat = this.address.lat;
				this.params.lng = this.address.lng;
				this.params.city_id = this.address.city_id;
				this.params.goods_type = this.mainMenu ==0 ? 1 : 2;
				this.params.select_give_goods_id = select_give_goods_id.join(",");
				this.params.goods_give_item_id = goods_give_item_id.join(",");
				this.params.tab_type = this.isMainShop ? 1 : 2;
				if(!this.isMainShop){
					this.params.select_main_goods_id = this.commonData.ssn_shopGroup.mainShop.goods_id;
					this.params.goods_main_item_id =  this.commonData.ssn_shopGroup.mainShop.actualSpe?this.commonData.ssn_shopGroup.mainShop.actualSpe:0;
					this.params.main_goods_num = this.commonData.ssn_shopGroup.mainShop.shopBuyNum
				}
				this.params.from = 'selectPage';
				if(this.laterSelect){
					this.params.main_order_goods_id = this.laterSelect;
				}
			}
			this.$eventBus.$emit('throwParams',this.params);
			this.request()
      	},
		// 请求地理位置
		requestSite(){
			var that = this;
			this.params.page = this.pages;
			const addrSession = sessionStorage.getItem('user-addr');
			if(addrSession){
				let data = JSON.parse(addrSession);
				this.address = data;
				this.$store.dispatch('city',data);
				this.transmitData()
			}
		},
		// 执行eventBus里面的函数
		eventBus(){
			var that = this;
			// 筛选
			this.$eventBus.$on("screenWay",function(param){
				that.pages = 1;
				that.screenParams = Object.assign({},param);
				that.request()
			});
			// 点击切换商品列表样式
			this.$eventBus.$on("cutStyle", function () {
				that.isOneLive = !that.isOneLive;
				if(that.isOneLive){
					that.$router.replace("/source")
				}else{
					that.$router.replace("/source/isOneLive")
				}
			});
			// 点击切换主分类
			this.$eventBus.$on("cutMainMenu", function (num) {
				that.cutMainMenu(num);
			});
			// 关闭提示框
			this.$eventBus.$on("closePopup",function(){
				that.isPopUp = false;
			});
			// 确定规格时
			this.$eventBus.$on('confirm',function(){
				that.pages = 1;
				that.transmitData();
			})
		},
		// 点击切换主分类
		cutMainMenu(num){
			this.mainMenu = num;
			if(num==0){
				this.isLoacl = true;
				if(this.isOneLive){
					this.$router.replace("/source")
				}else{
					this.$router.replace("/source/isOneLive")
				}
			}else{
				this.isLoacl = false;
				this.$router.replace("/locality")
			}
			this.screen = 'screenNew'
			this.screenParams = {};
			this.pages = 1;
			this.$nextTick(()=>{
				this.transmitData();
			})
		},
		// 提交订单
		submit(e){
			if(e.target.disabled) return false;
			if(JSON.stringify(this.commonData.ssn_shopGroup.mainShop) == "{}" && this.commonData.ssn_shopGroup.presentList.length <= 0){
				localStorageCorrelation.openPopUp(this,{popupContent:'没有商品不能下单哦'});
				return false;
			}
			if(!this.share_main_order_goods_id && JSON.stringify(this.commonData.ssn_shopGroup.mainShop) == "{}"){
				localStorageCorrelation.openPopUp(this,{popupContent:'没有主商品不能下单哦'});
				return false;
			}
			window.location.href = './confirmOrder.html?share_main_order_goods_id=' + this.share_main_order_goods_id;
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
    components:{
        shopList,
        homeModule,
        screenNew,
        localProduct,
        shopGroup,
        specificationPopUp,
        popUp,
        scroll
    }
}
</script>
<style lang="less">
  @import "selectShop.less";
</style>
