import noData from './personalNoData'
import scroll from '@/components/scroll';
import history from '@/js/history'
export default {
    data(){
        return {
            list:[],
            key:'',
            isEnd:false,
            canLoading:true,
            page:1,
            type:2
        }
    },
    components:{
        noData,
        scroll
    },
    methods:{
        getList(loading){
            history.clearData();
            const params = {
                type:this.type,
                page:this.page,
                keywords:this.key
            }
            this.dataService.getFavList(params).then((resp)=>{
                this.dataService.handleResponse({
                    data:resp,
                    callback:(data)=>{
                        if(loading){
                            if(data.length>0){
                                this.list = this.list.concat(data);
                            }else{
                                this.isEnd = true;
                            }
                        }else{
                            this.list = [].concat(data);
                        }
                        this.$nextTick(()=>{
                            this.$refs.scroll.scroll.refresh();
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
        historyBack({items,scrollY,maxScroll}){
            this.goodList = items.goodList;
            this.canLoading = true;
            this.page = items.page;
            this.isEnd = items.isEnd;
            this.key = items.key;
            this.type = items.type;

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
    },
    mounted(){
        this.key = decodeURIComponent(this.common.getUrlParam('search'));
        history.init(this);
        let storage = history.getData();
        if(storage){
            this.historyBack(storage)
        }else{
            this.getList();
        }
    }
}