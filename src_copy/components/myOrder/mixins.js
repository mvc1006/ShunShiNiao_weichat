import orderProduct from './orderPro';
import noData from '@/components/myFav/personalNoData'
import scroll from '@/components/scroll.vue'
import history from '@/js/history.js'
export default {
    data(){
        return {
            page:1,
            dataList:[],
            isEnd:false,
            canLoading:false,
            goods_type:2,
            order_status:1
        }
    },
    methods:{
        historyBack({items,scrollY,maxScroll}){
            this.dataList = items.dataList;
            this.order_status = items.order_status;
            this.goods_type = items.goods_type;
            this.canLoading = true;
            this.page = items.page;
            this.isEnd = items.isEnd;
 
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
        getList(load){
            history.clearData();
            this.dataService.getOrderList({
                page:this.page,
                goods_type:this.goods_type,
                order_status:this.order_status
            }).then(resp=>{
                this.dataService.handleResponse({
                    data:resp,
                    callback:(data)=>{
                        if(load){
                            if(data.length>0){
                                this.dataList = this.dataList.concat(data);
                            }else{
                                this.isEnd = true;
                            }
                        }else{
                            this.dataList = [].concat(data);
                        }
                        this.$nextTick(()=>{
                            this.$refs.scroll.scroll.refresh();
                        })
                        this.canLoading = true;
                    }
                })
            })
        },
        delOrder(id){
            for(let i=0;i<this.dataList.length;i++){
                let one = this.dataList[i];
                if(one.order_id == id){
                    this.dataList.splice(i,1)
                }
            }
            history.clearData();
        },
        upBack(){
            if(this.canLoading){
                this.page++;
                this.getList(true)
            }
        },
        downBack(){
            if(this.canLoading){
                this.page = 1;
                this.getList();
                this.isEnd = false;
            }
        },
    },
    components:{
        orderProduct,
        noData,
        scroll,
    },
    mounted(){
        history.init(this);
        let storage = history.getData();
        if(storage){
            this.historyBack(storage)
        }else{
            this.getList();
        }
        if(!this.order_status || this.order_status == 1){
            this.$eventBus.$on('delOrderSuccess',(data)=>{
                this.delOrder(data)
            })
        }
    }
}