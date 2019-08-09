<template>
	<div class="viewport container">
		<!-- 头部 -->
		 <div class="header">
			<span class="go-back" @click="goBack"></span>
			<div v-text="activity_id == 5 ? '活动礼包' : '新人专享'"></div>
			<div class="store-search" @click="search"></div>
		</div>
		<!-- 排序方式 -->
        <component 
        :is="screen"
         ref="screenNew" 
        :screenReset="screenReset" 
        :is_main='"1"' 
        :goods_type='"2"'>
        </component>
		<!-- 横向滚动 -->
		<div class="rollArea" v-if="acrossList.length > 0 && activity_id == 6">
			<div class="acrossRoll">
				<div class="across-item" ref="" v-for="(asross,index) in acrossList" :key="index">
					<img :src="asross.avatar" alt="">
					<span class="across-name" v-text="asross.nickname"></span>
					<span class="across-phone" v-text="asross.order_desc"></span>
				</div>
			</div>
		</div>
		<scroll ref="scroll" :upBack="upBack" :downBack="downBack" :isEnd="isEnd" v-if="product.length > 0">
			<!-- 商品列表 -->
            <div class="pro-list-cont">
                <div class="pro-list">
                    <pro-item v-for="(item,index) in product" :showShopInfo="false" :key="index" :data="item" :showGive="true" :isMain="true"></pro-item>
                </div>
                <div class="loading" v-if="!canLoading"></div>
            </div>
        </scroll>
		<!-- 没有订单 -->
        <div class="not-available" v-if="product.length == 0">
			<img src="../../assets/no_shopkeeper.png" alt="">
			<div class="text">暂无相关数据</div>
        </div>
		<!-- 规格弹窗 -->
		<specificationPopUp v-if="commonData.isSpe" :isMainShop="true"></specificationPopUp>
		<!-- 页面弹窗提示 -->
		<popUp v-if="commonData.isPopUp" :type="commonData.popupType" :time="commonData.popupTime" :content="commonData.popupContent" :isMainShop="true"></popUp>
	</div>
</template>
<script>
  	import localStorageCorrelation from '@/js/localStorageCorrelation';
	import screenNew from '@/components/screenNew';
	import proItem from '@/components/localService/localProduct.vue';
	import scroll from '@/components/scroll';
	import specificationPopUp from '@/components/specificationPopUp';
    import popUp from '@/components/popUp';
    import history from '@/js/history'
	export default {
		name:'index',
		data(){
			return {
				isEnd:false,
				canLoading:false,
				page:1,
				product: [],
				type_data: 'buy_power', // 排序类型
				addr: {}, // 地理位置
                acrossList: [],
                screenParams:{},
                screen:'screenNew',
                params:{},
                screenReset:{}
			}
		},
		// 初始化函数
		mounted(){
			localStorageCorrelation.getLocalStorage(this);
			this.$eventBus.$on("screenWay",(params) => {
                this.screenParams = Object.assign({},params);
                this.product = [];
                this.isEnd = false;
                this.page = 1;
                this.$nextTick(()=>{
                    this.request();
                })
			});
			// 关闭提示框
			this.$eventBus.$on("closePopup",() => {
				this.isPopUp = false;
			});
			// 显示提示弹窗
			this.$eventBus.$on("openPopUp",(popup) => {
				localStorageCorrelation.openPopUp(that,popup)
            });
            
            history.init(this);
			this.init();
            document.getElementsByTagName("title")[0].innerHTML =  this.activity_id == 5 ? '活动礼包' : '新人专享'
		},
		computed:{
			commonData(){
				return this.$store.state.commonData;
			},
			activity_id(){
				return Number(this.common.getUrlParam('activity_id')) || 6
			},
		},
		// 定义函数
		methods:{
            historyBack({items,scrollY,maxScroll,screen}){
                this.screenReset = screen;
                this.isEnd = items.isEnd;
                this.canLoading = true;
                this.page = items.page;
                this.product = items.product;
                this.type_data = items.type_data;
                this.addr = items.addr;
                this.screen = ''
                this.acrossList = items.acrossList;
                this.screenParams = items.screenParams;
                this.params = items.params;
                this.$nextTick(()=>{
                    this.screen = 'screenNew'
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
			goBack(){
				if(window.history.length <= 1){
					window.location.href = './localService.html';
            		return false
            	}
				window.history.back(-1);
			},
			// 跳转搜索
			search(){
				window.location.href = './search.html?tab_type=1&goods_type=2&isEmptyShopGroup=true&active_id=' + this.activity_id
			},
			// 获取位置
			async init(){
                // this.screen = 'screenNew'
				const addrSession = sessionStorage.getItem('user-addr');
				if(addrSession){
					let data = JSON.parse(addrSession);
                    this.addr = data;
                    let storage = history.getData();
                    if(storage){
                        this.historyBack(storage)
                    }else{
                        this.initParams();
                        this.request();
                    }
					if(this.activity_id == 6){
						this.newerOrderFlow();
					}
				}
			},
            //请求列表数据
            initParams(){
                this.params = {
					tab_type: 1,
					goods_type: 2,
					activity_id: this.activity_id,
					city_id: this.addr.city_id,
					lng: this.addr.lng,
					lat: this.addr.lat,
					dlf_id: localStorage.getItem("dlf_id"),
				}
                this.$eventBus.$emit('throwParams',this.params)
            },
			request(){
                let param = Object.assign({},this.params ,this.screenParams);
                param.page = this.page;
				this.dataService.getProList(param).then((resp)=>{
					this.dataService.handleResponse({
						data:resp,
						callback:(data)=>{
							if(this.page == 1){
								this.product = [];
							}
							if(data.goods_list.length>0){
								this.product = this.product.concat(data.goods_list);
							}else{
								this.isEnd = true;
							}
							this.$nextTick(()=>{
								if(this.$refs.scroll&&this.$refs.scroll.scroll){
									this.$refs.scroll.scroll.refresh();
								}
							})
							this.canLoading = true;
						}
					})
				})
			},
			// 获取新人下单记录
			newerOrderFlow(){
				this.dataService.newerOrderFlow().then((resp)=>{
					this.dataService.handleResponse({
						data:resp,
						callback:(data)=>{
							this.acrossList = data;
							this.$nextTick(() => {
								setTimeout(() => {
									let winWidth = window.screen.width;
									let acrossRoll = document.getElementsByClassName("acrossRoll")[0];
									if(!acrossRoll) return false;
									let items = acrossRoll.children,itemWidth = 0;
									for(let i = 0; i < items.length; i++){
										itemWidth += items[i].clientWidth
									}
									if(itemWidth<=winWidth) return false;
									let marginLeft = itemWidth;
									acrossRoll.innerHTML = acrossRoll.innerHTML + acrossRoll.innerHTML;
									acrossRoll.style.marginLeft =  - marginLeft + "px";
									setInterval(() => {
										marginLeft ++;
										acrossRoll.style.marginLeft = - marginLeft + 'px';
										if(marginLeft >= itemWidth * 2 - winWidth){
											marginLeft = itemWidth - winWidth
										}
									},10)
								},50)
							})
						}
					})
				})
			},
			upBack(){
				if(this.canLoading){
					this.page ++;
					this.request();
				}
			},
			downBack(){
				if(this.canLoading){
					this.page = 1;
					this.isEnd = false;
					this.request();
				}
        	}
		},
		components:{
			screenNew,
			proItem,
			scroll,
			specificationPopUp,
			popUp
		}
	}
</script>
<style lang="less">
	@import '../../less/common';
	body{
		background: @background-color;
	}
	.viewport{
		max-width: 720px;
		width: 100%;
		margin: 0 auto;
		.pxRem(padding-top,96);
		.pxRem(font-size,24);
		color: @gray-text;
		box-sizing: border-box;
	}
	// 头部
	.header{
		position: fixed;
		width: 100%;
		left: 0;
		top: 0;
		.pxRem(line-height,56);
		.pxRem(font-size,28);
		.pxRem(padding,20);
		.flex();
		.alignItems();
		.justifyContent(space-between);
		.borderBottom(1);
		background: @white-color;
		z-index: 99999;
		>div{
			width: 100%;
			text-align: center;
		}
		>.go-back{
			position: absolute;
			.pxRem(left,30);
			.pxRem(width,16);
		}
		.store-search{
			position: absolute;
			.pxRem(right,60);
			.pxRem(width,50);
		}
	}
	// 横向滚动
	.rollArea{
		.flexShrink(0);
		overflow: hidden;
		.pxRem(margin-top,16);
		.pxRem(margin-bottom,16);
		background: @yellow-bg-light;
	}
	.acrossRoll{
		.flex();
		>.across-item{
			.flexShrink(0);
			.flex();
			.alignItems();
			.pxRem(padding-left,8);
			.pxRem(padding-right,8);
			.pxRem(line-height,88);
			.pxRem(font-size,20);
			>img{
				.pxRem(width,48);
				.pxRem(height,48);
				border-radius:50%;
			}
			>.across-name{
				.pxRem(margin-left,8);
				.pxRem(max-width,100);
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			>.across-phone{
				.pxRem(margin-left,8);
				color: @red-color;
			}
		}
	}
	.pro-item{
		margin-top: 0 !important;
	}
	/* 没有订单 */
	.not-available{
		.pxRem(padding-top,50);
		background: transparent !important;
		>img{
			.pxRem(width,218);
			display: block;
			margin: 0 auto;
		}
		>.text{
			text-align: center;
			.pxRem(margin-top,30);
			.pxRem(font-size,24);
			color: @gray-light-text;
		}
	}
</style>
