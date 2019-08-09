import localPro from '@/components/shopList.vue';
import scroll from '@/components/scroll.vue';
import noData from '@/components/myFav/personalNoData.vue';
import history from '@/js/history'
export default {
    data(){
        return{
            page:1,
            canLoading:false, // 是否可加载  等待api请求完成
            isEnd:false, // 滚动加载是否结束
            is_overseas:1,
            list:[],
            userAddr: '', // 地址信息

        }
    },
    mounted(){
        history.init(this);
        let storage = history.getData();
        if(storage){
            this.historyBack(storage)
        }else{
            this.userAddr = JSON.parse(sessionStorage.getItem('user-addr'));
            this.getList();
        }
        // this.share();
    },
    methods:{
        // share(){
        //   let url = location.origin;
        //   let title = this.type == 1?'特价秒杀':'顺势鸟血本卖',
        //       des = this.type == 1?'乐享济南—低至1元（本地生活）':'两人餐低至9.9元（本地生活）',
        //       imgUrl = this.type == 1?(url+'/static/img/specialOffer.png'):(url+'/static/img/moneySelling.png');
        //   this.common.shareFun(title,des,imgUrl);
        // },
        goBack(){
            window.location.href = './localService.html';
        },
        historyBack({items,scrollY,maxScroll}){
            this.list = items.list;
            this.userAddr = items.userAddr;
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
        getList(){
            history.clearData();
            this.canLoading = false;
            this.dataService.getProList({
                is_overseas:this.is_overseas,
                page:this.page,
                city_id: this.userAddr.city_id
            }).then(resp=>{
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
                this.page++;
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
        scroll,
        noData
    }
}