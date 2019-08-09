import {mapGetters} from 'vuex'
import shopListNew from '../shopListNew';
import classify from './classify.vue';
import banner from '../banner.vue';
import scroll from '../scroll';
import noData from '../myFav/personalNoData.vue'
import activityIn from '@/components/activity/activityIn';
import history from '@/js/history'
export default {
    data() {
        return {
            bannerList:[],
            classify:[],
            product:[],
            activityList:[],
            config:{
                goods_type:2,
                tab_type:1,
            },
            page:1,
            canLoading:false,
            isEnd:false, // 分页加载是否结束
        }
    },
    computed:{
        ...mapGetters(['getCity']),
        commonData(){
          return this.$store.state.commonData;
        }
    },
    methods:{
        historyBack({items,scrollY,maxScroll}){
            this.bannerList = items.bannerList;
            this.classify = items.classify;
            this.product = items.product;
            this.activityList = items.activityList;
            this.config = items.config;
            this.canLoading = true;
            this.isEnd = items.isEnd;
            this.page = items.page;
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
        selectWay(data){
            this.config.lng = data.lng;
            this.config.lat = data.lat;
            this.config.city_id = data.city_id;
            let storage = history.getData();
            if(storage){
                this.historyBack(storage)
            }else{
                this.getProList();
            }
        },
        async getList(){
            if(this.getCity.city_id){
                this.selectWay(this.getCity);
            }else{
                const addrSession = sessionStorage.getItem('user-addr');
                if(addrSession){
                    let data = JSON.parse(addrSession);
                    this.$store.dispatch('city',data);
                    this.selectWay(data);
                }
            }
        },
        getProList(append){
            history.clearData();
            this.canLoading = false;
            this.config.page = this.page;
            this.config.from = 'homePage';
            this.dataService.getProList(this.config).then((resp)=>{
                this.dataService.handleResponse({
                    data:resp,
                    callback:(data)=>{
                        if(append){
                            if(data.goods_list.length>0){
                                this.product = this.product.concat(data.goods_list)
                            }else{
                                this.isEnd = true;
                            }
                        }else{
                            this.classify = data.cate_list;
                            this.bannerList = data.banner_list;
                            this.product = data.goods_list;
                            // this.activityList = data.act_banner_list;
                            this.activityList = data.act_info_list;
                        }
                        this.$nextTick(()=>{
                            this.$refs.scroll.scroll.refresh();
                        })
                        this.canLoading = true;
                        let transferData = {
                            activityList: this.activityList,
                            classify: this.classify
                        }
                        this.$eventBus.$emit("activityList",transferData)
                    }
                })
            })
        },
        upBack(){
            if(this.canLoading){
                this.page ++;
                this.getProList(true);
            }
        },
        downBack(){
            if(this.canLoading){
                this.page = 1;
                this.isEnd = false;
                this.getProList();
            }
        }
    },
    components:{
        shopListNew,
        classify,
        banner,
        scroll,
        noData,
        activityIn
    },
    mounted(){
        history.init(this);
        this.getList();
        this.$eventBus.$on('scrollGoTop',()=>{
            let scroll = this.$refs.scroll.scroll;
            history.clearData();
            scroll.scrollTo(0,0,500)
        })
    },
    destroyed(){
        this.$eventBus.$off('scrollGoTop')
    }
}