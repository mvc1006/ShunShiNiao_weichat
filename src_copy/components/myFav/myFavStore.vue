<template>
    <scroll ref="scroll" :upBack="upBack" :downBack="downBack" :isEnd="isEnd">
        <store-list :storeList="storeList" :showCheck="getManage" :storeSelect="storeSelect"></store-list>
        <no-data v-show="storeList.length<=0"></no-data>
    </scroll>  
</template>

<script>
import storeList from './personalStore'
import noData from './personalNoData'
import {mapGetters} from 'vuex';
import scroll from '@/components/scroll';
import history from '@/js/history'
export default {
    data(){
        return {
            storeList:[],
            isEnd:false,
            canLoading:true,
            page:1
        }
    },
    components:{
        storeList,
        noData,
        scroll,
    },
    computed:{
        ...mapGetters(['getManage','getCheckedAll']),
    },
    methods:{
        getList(loading){
            history.clearData();
            const params = {
                page:this.page,
                type:2
            }
            this.canLoading = false;
            this.dataService.getFavList(params).then((resp)=>{
                this.dataService.handleResponse({
                    data:resp,
                    callback:(data)=>{
                        if(loading){
                            if(data.length>0){
                                this.storeList = this.storeList.concat(data);
                            }else{
                                this.isEnd = true;
                            }
                        }else{
                            this.storeList = [].concat(data);
                        }
                        this.$nextTick(()=>{
                            this.$refs.scroll.scroll.refresh();
                        })
                        this.canLoading = true;
                    }
                })
            })
        },
        storeSelect(item){
            if(item.checked){  
                this.$set(item,'checked',false);
                if(this.getCheckedAll){
                    this.$store.dispatch('checkedAll');
                }
            }else{
                this.$set(item,'checked',true);
                let btn = true;
                for(let i=0;i<this.storeList.length;i++){
                    let one = this.storeList[i];
                    if(!one.checked){
                        btn = false;
                        break;
                    }
                }
                if(btn){
                    this.$store.dispatch('checkedAll');
                }
            }
        },
        upBack(){
            if(this.canLoading){
                this.page ++;
                this.getList(true)
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
            this.storeList = items.storeList;
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
        this.$eventBus.$on('checkedAll',()=>{
            for(let i=0;i<this.storeList.length;i++){
                let one = this.storeList[i];
                this.$set(one,'checked',this.getCheckedAll)
            }
        }).$on('del',()=>{
            let checkId = [];
            for(let i=this.storeList.length-1;i>=0;i--){
                let one = this.storeList[i];
                if(one.checked){
                    checkId.push(one.favor_shop_id);
                    this.storeList.splice(i,1)
                }
            }
            if(checkId.length>0){
                history.clearData();
                this.dataService.delMyFav({
                    type:2,
                    favor_shop_id:checkId.join(',')
                }).then(resp=>{
                    this.dataService.handleResponse({
                        data:resp,
                        callback:()=>{
                            this.$eventBus.$emit('delSuccess');
                        }
                    })
                })
            }else{
                alert('请选择要取消的店铺');
            }
        })
    },
    destroyed(){
        this.$eventBus.$off('checkedAll');
        this.$eventBus.$off('del');
    }
}
</script>
