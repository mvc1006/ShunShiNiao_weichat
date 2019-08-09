<template>
	<div class="container">
		<!-- 新手指引 -->
		<!-- <new-guidelines :list="activityList" :goods_type='1'></new-guidelines> -->
		<!-- 遮罩 -->
		<div class="shade"></div>
		<!-- 返回顶部 -->
		<go-top></go-top>
		<!-- 商品组弹窗 -->
		<!-- <shopGroup></shopGroup> -->
		<!-- 规格弹窗 -->
		<specificationPopUp v-if="commonData.isSpe" :isMainShop="isMainShop"></specificationPopUp>
		<!-- 页面弹窗提示 -->
		<popUp v-if="commonData.isPopUp" :type="commonData.popupType" :time="commonData.popupTime" :content="commonData.popupContent" :isMainShop="isMainShop"></popUp>
		<!-- 页面主要内容 -->
		<div class='cont-top'>
			<homeModule :is-main-shop="true" :isBuyPresent="isMainShop" :cate-list="cate_list" :is-one-live="isOneLive" :main-menu="mainMenu" :search_text="search_text"></homeModule>
			<scroll ref="scroll" :upBack="upBack" :downBack="downBack" :isEnd="isEnd">
				<!-- 轮播图 -->
				<banner v-if="banner_list.length > 0" :banner_list="banner_list"></banner>
				<!-- 活动入口 -->
				<activity-in :goods_type="1" :list="activityList"></activity-in>
				<h2 class="red">—&nbsp;&nbsp;主推荐&nbsp;&nbsp;—</h2>
				<!-- 商品列表 -->
				<shop-list v-if="!isOneLive" is-zero-buy="true" :isMainShop="isMainShop" :is-one-live="isOneLive" :shop-list="goods_list"></shop-list>
				<shopListNew v-else :isMainShop="isMainShop" :shop-list="goods_list" :isStore='false'></shopListNew>
			</scroll>
		</div>
		<!-- 底部tabBer -->
		<bottom :num="number" class="cont-bottom"></bottom>
	</div>
</template>
<script>
  import Swiper from "swiper";
  import localStorageCorrelation from '@/js/localStorageCorrelation';
  // 页面中需要的插件
  import newGuidelines from '@/components/newGuidelines';
  import banner from '@/components/banner';
  import bottom from '@/components/bottom';
  import shopList from '@/components/shopList';
  import shopListNew from '@/components/shopListNew';
  import homeModule from "@/components/homeModule";
  // import shopGroup from "@/components/shopGroups";
  import specificationPopUp from '@/components/specificationPopUp';
  import popUp from '@/components/popUp';
  import scroll from '@/components/scroll';
  import goTop from '@/components/goTop';
  import activityIn from '@/components/activity/activityIn';
  import history from '@/js/history'
  export default {
      name:'index',
      data(){
          return {
            isMainShop: true,
            // 主内容相关
            number: 0, // 底部菜单选择的是那个
            isOneLive: true, // 是否为一排一个
            search_text: '', // 搜索中显示的文字
            mainMenu: 0,// 选择的是哪个主菜单
            banner_list:[],  // 轮播图
            cate_list: [],   // 商品分类列表
            goods_list: [],   // 商品列表
            brand_list: [],   // 品牌列表
            canLoading:true, // 是否加载完成
            isEnd:false, // 分页加载是否结束
            pages: 1, // 分页加载
            activityList:[]
          }
      },
      // 初始化函数
      mounted(){
        // 回退
        history.init(this);
        let storage = history.getData();
        if(storage){
            this.historyBack(storage)
        }else{
            // 正常的渲染流程
            if(this.$route.path=='/main'){
            this.cutMainMenu(0);
            this.getAddress();
            }else if(this.$route.path=='/give'){
            this.cutMainMenu(1);
            }
        }
        this.eventBus();
        localStorageCorrelation.getLocalStorage(this);
      },
      computed:{
        commonData(){
          return this.$store.state.commonData
        }
      },
      // 定义函数
      methods:{
        historyBack({items,scrollY,maxScroll}){
            this.activityList = items.activityList;
            this.banner_list = items.banner_list;
            this.brand_list = items.brand_list;
            this.canLoading = true;
            this.cate_list = items.cate_list;
            this.goods_list = items.goods_list;
            this.isEnd = items.isEnd;
            this.isMainShop = items.isMainShop;
            this.isOneLive = items.isOneLive;
            this.mainMenu = items.mainMenu;
            this.number = items.number;
            this.pages = items.pages;
            this.search_text = items.search_text;
            this.refreshList();
            this.$nextTick(()=>{
                let scroll = this.$refs.scroll.scroll;
                scroll.maxScrollY = maxScroll;
                scroll.scrollTo(0,scrollY,0);
            })
        },
        async getAddress(){
          const addrSession = sessionStorage.getItem('user-addr');
          history.clearData();
          if(addrSession){
            let data = JSON.parse(addrSession);
            this.getLocalData(data)
          }
        },
        // 请求后台
        request(addr){
          var that = this;
          let params = {
            tab_type: this.isMainShop?1:2,
            goods_type: 1,
            page: this.pages,
            city_id:addr.city_id,
            from : 'homePage',
          };
          this.dataService.getProList(params).then(function(resp){
            that.dataService.handleResponse({
              data: resp,
              callback: function(data){
                if(data.goods_list.length == 0){
                  that.isEnd = true
                }
                if(that.pages == 1){
                    that.banner_list = [];
                    that.cate_list = [];
                    that.activityList = [];
                    that.$nextTick(()=>{
                        that.banner_list = [].concat(data.banner_list);
                        that.cate_list = that.cate_list.concat(data.cate_list);
                        // that.activityList = data.act_banner_list;
                        that.activityList = data.act_info_list
                    })
                    that.search_text = data.recommend_search_word?data.recommend_search_word:'请输入搜索内容';
                }
                that.goods_list = that.goods_list.concat(data.goods_list);
                that.refreshList();
                that.setLocalData(params,data);
              }
            })
          })
        },
        // 设置 缓存
        setLocalData(params,data){
            let name = 'indexData' + params.goods_type + params.tab_type + params.city_id;
            let localData = localStorage.getItem(name) ? JSON.parse(localStorage.getItem(name)) : '', // 取数据 为的是添加page用
                setLocal = {};
            if(localData){
                localData.proList[params.page] = data.goods_list;
                localStorage.setItem(name,JSON.stringify(localData))
            }else{
                let time = new Date().getTime();
                setLocal.time = time;
                setLocal.banner_list = data.banner_list; // banner
                setLocal.cate_list = data.cate_list; // 分类
                setLocal.proList = {} // 产品
                setLocal.act_banner_list = data.act_banner_list;
                setLocal.act_info_list = data.act_info_list
                setLocal.proList[params.page] = data.goods_list;
                localStorage.setItem(name,JSON.stringify(setLocal))
            }
        },
        // 取缓存数据
        getLocalData(addrData){
            let name = 'indexData' + 1 + (this.isMainShop?1:2) + addrData.city_id;
            let localData = localStorage.getItem(name) ? JSON.parse(localStorage.getItem(name)) : '';
            if(!localData){
                this.request(addrData);
            }else{
                let time = new Date().getTime(),
                    localTime = Number(localData.time);
                if(localTime + 2*60*60*1000>time){
                    if(this.pages == 1){
                        this.banner_list = [];
                        this.activityList = [];
                        this.cate_list = [];
                        this.$nextTick(()=>{
                          console.log(localData)
                            this.banner_list = [].concat(localData.banner_list);
                            // this.activityList = localData.act_banner_list;
                            this.activityList = localData.act_info_list;
                            this.cate_list = this.cate_list.concat(localData.cate_list);
                        })
                        this.goods_list = this.goods_list.concat(localData.proList[this.pages]);
                    }else{
                        if(localData.proList[this.pages]){
                            this.goods_list = this.goods_list.concat(localData.proList[this.pages]);
                        }else{
                            this.request(addrData);
                        }
                    }
                    this.refreshList();
                }else{
                    localStorage.setItem(name,'');
                    this.request(addrData);
                }
            }
        },
        refreshList(){
            this.$nextTick(()=> {
                this.$refs.scroll.scroll.refresh();
            });
        },
        // 执行eventBus里面的函数
        eventBus(){
          var that = this;
          // 点击切换商品列表样式
          this.$eventBus.$on("cutStyle", function () {
            that.isOneLive = !that.isOneLive;
          });
          // 点击切换主分类
          this.$eventBus.$on("cutMainMenu", function (num) {
            that.cutMainMenu(num);
            that.$refs.scroll.scroll.scrollTo(0,0);
          });
          // 关闭提示框
          this.$eventBus.$on("closePopup",function(){
            that.isPopUp = false;
          });
          // 显示提示弹窗
          this.$eventBus.$on("openPopUp",function(popup){
            localStorageCorrelation.openPopUp(that,popup)
          });
          // 回到顶部
          this.$eventBus.$on('scrollGoTop',()=>{
            let scroll = this.$refs.scroll.scroll;
            scroll.scrollTo(0,0,500);
            history.clearData();
          })
        },
        // 点击切换主分类
        cutMainMenu(num){
          if(this.mainMenu == num) return false;
          this.pages = 1;
          this.mainMenu = num;
          this.cate_list = [];
          this.goods_list = [];
          if(num == 0){
            this.isMainShop = true;
            this.$router.push('main');
            this.getAddress();
          }else{
            this.isMainShop = false;
            this.$router.push('give');
            this.getAddress();
          }
        },
        // 上拉刷新
        upBack(){
          if(this.canLoading){
            this.pages ++;
            this.getAddress();
          }
          
        },
        // 下拉刷新
        downBack(){
          if(this.canLoading){
            this.pages = 1;
            this.cate_list = [];
            this.goods_list = [];
            this.isEnd = false;
            this.getAddress();
          }
        }
      },
      components:{
          bottom,
          shopList,
          shopListNew,
          homeModule,
          // shopGroup,
          specificationPopUp,
          popUp,
          scroll,
          goTop,
          activityIn,
          banner,
          newGuidelines
      }
  }
</script>
<style lang="less">
  @import "index.less";
  @import "../../less/swiper.min.css";
</style>
