import localPro from '@/components/localShopList.vue';
import sourcePro from "../../components/shopList.vue";
import localStorageCorrelation from '@/js/localStorageCorrelation'
import scroll from '@/components/scroll.vue';
import screenNew from '@/components/screenNew.vue';
import noData from '@/components/myFav/personalNoData.vue';
import specificationPopUp from '@/components/specificationPopUp.vue';
import popUp from '@/components/popUp.vue'
import history from '@/js/history'
export default {
    data(){
        return{
            isHistoryEmpty: false, // 是否有历史记录
            isMainShop: true,
            page:1,
            canLoading:false, // 是否可加载  等待api请求完成
            isEnd:false, // 滚动加载是否结束
            params:{
                activity_id:1,
                goods_type:'2'
            },
            list:[],
            addr:{},
            screen:'screenNew',
            screenParams:{},
            screenReset:{}
        }
    },
    computed:{
        type:function(){
            // type 1 特价 type 2 血本卖
            return this.common.getUrlParam('type') || 1;
        },
        title:function(){
            if(this.type == 2){
                return '血本卖';
            }else{
                return '特价专区';
            }
        },
        commonData(){
          return this.$store.state.commonData
        }
    },
    mounted(){
        this.commonData.isActivity = this.type;
        this.isMainShop = this.type == 2?true:false;
        localStorageCorrelation.getLocalStorage(this);
        history.init(this);
        this.init();
        this.$eventBus.$on('screenWay',(params)=>{
            this.screenParams = Object.assign({},params);
            this.page = 1;
            this.list = [];
            this.isEnd = false;
            this.$nextTick(()=>{
                this.getList();
            })
        })
        if(window.history.length<=1){
          this.isHistoryEmpty = true;
        }
        this.share();
        document.title = this.title;
    },
    methods:{
        share(){
          let url = location.origin;
          let title = this.type == 1?'特价秒杀':'顺势鸟血本卖',
              des = this.type == 1?'乐享济南—低至1元（本地生活）':'两人餐低至9.9元（本地生活）',
              imgUrl = this.type == 1?(url+'/static/img/specialOffer.png'):(url+'/static/img/moneySelling.png');
          this.common.shareFun(title,des,imgUrl);
        },
        goBack(){
            window.location.href = './localService.html';
        },
        // 跳转搜索
        search(){
            window.location.href = './search.html?tab_type=1&goods_type=' + this.params.goods_type + '&isEmptyShopGroup=true&active_id=' + this.params.activity_id
        },
        selectWay(){
            let storage = history.getData();
            if(storage){
                this.historyBack(storage)
            }else{
                this.getList();
            }
        },
        historyBack({items,scrollY,maxScroll,screen}){
            this.screenReset = screen;
            this.screen = '';
            this.isHistoryEmpty = items.isHistoryEmpty;
            this.isMainShop = items.isMainShop;
            this.addr = items.addr;
            this.list = items.list;
            this.params = items.params;
            this.screenParams = items.screenParams;
            this.canLoading = true;
            this.isEnd = items.isEnd;
            this.page = items.page;
            this.$nextTick(()=>{
                this.screen = 'screenNew';
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
        async init(){
            const addrSession = sessionStorage.getItem('user-addr');
            if(addrSession){
                let data = JSON.parse(addrSession);
                this.addr = data;
                this.initParams();
                this.selectWay();
            }
        },
        initParams(){
            this.params.activity_id = this.type;
            this.params.lng = this.addr.lng;
            this.params.lat = this.addr.lat;
            this.params.city_id = this.addr.city_id;
            this.$eventBus.$emit('throwParams',this.params)
        },
        getList(){
            history.clearData();
            this.canLoading = false;
            let nowParams = Object.assign({},this.params,this.screenParams);
            nowParams.page = this.page;
            this.dataService.getProList(nowParams).then(resp=>{
                this.dataService.handleResponse({
                    data:resp,
                    callback:(data)=>{
                        if(this.page == 1){
                            this.list = [].concat(data.goods_list)
                        }else{
                            if(data.goods_list.length>0){
                                this.list = this.list.concat(data.goods_list)
                            }else{
                                this.isEnd = true;
                            }
                        }
                        this.$nextTick(()=>{
                            if(this.$refs.scroll && this.$refs.scroll.scroll){
                                this.$refs.scroll.scroll.refresh();
                            }
                        })
                        this.canLoading = true;
                    }
                })
            })
        },
        upBack(){
            if(this.canLoading){
                this.page ++;
                this.getList(true);
            }
        },
        downBack(){
            if(this.canLoading){
                this.page = 1;
                this.isEnd = false;
                this.getList();
            }
        },
    },
    components:{
        localPro,
        screenNew,
        scroll,
        noData,
        specificationPopUp,
        popUp,
        sourcePro
    },
    destroyed(){
        this.$eventBus.$off('screenWay');
    }
}