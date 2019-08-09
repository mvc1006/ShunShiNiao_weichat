<template>
    <scroll ref="scroll" :upBack="upBack" :downBack="downBack" :isEnd="isEnd" :class="{'noList':goodList.length <= 0}">
        <goods :goodList="goodList" :notShowText="true"></goods>
        <no-data v-show="goodList.length<=0"></no-data>
    </scroll>
</template>
<script>
import goods from '@/components/myFav/personalProduct.vue'
import noData from '@/components/myFav/personalNoData.vue'
import scroll from '@/components/scroll';
import history from '@/js/history'
export default {
    data(){
        return {
            goodList:[],
            isEnd:false,
            canLoading:true,
            page:1
        }
    },
    components:{
        goods,
        noData,
        scroll,
    },
    methods:{
        getList(loading){
            history.clearData();
            let params = {
                page:this.page
            }
            this.canLoading = false;
            this.dataService.getHistory(params).then((resp)=>{
                this.dataService.handleResponse({
                    data:resp,
                    callback:(data)=>{
                        if(loading){
                            if(data.length>0){
                                this.goodList = this.goodList.concat(data);
                            }else{
                                this.isEnd = true;
                            }
                        }else{
                            this.goodList = [].concat(data);
                        }
                        this.$nextTick(()=>{
                            this.$refs.scroll.scroll.refresh();
                        })
                        this.canLoading = true;
                    }
                })
            })
        },
        getHistoryDel(){
            history.clearData();
            this.page = 1;
            this.goodList = [];
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
        history.init(this);
        let storage = history.getData();
        if(storage){
            this.historyBack(storage)
        }else{
            this.getList();
        }
    },
}
</script>
<style lang="less">
    .pro-cont{
        overflow: hidden;
    }
    .noList{
        >.scroll-top-text{
            display: none !important
        }
        .scroll-bottom-text{
            display: none !important
        }
    }
</style>