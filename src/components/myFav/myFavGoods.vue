<template>
    <scroll ref="scroll" :upBack="upBack" :downBack="downBack" :isEnd="isEnd">
        <goods :goodList="goodList" :showCheck="getManage" :goodsClick="goodsClick"></goods>
        <no-data v-show="goodList.length<=0"></no-data>
    </scroll>  
</template>

<script>
import goods from './personalProduct.vue'
import noData from './personalNoData.vue'
import {mapGetters} from 'vuex';
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
        scroll
    },
    computed:{
        ...mapGetters(['getManage','getCheckedAll']),
    },
    methods:{
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
        getList(loading){
            history.clearData();
            this.canLoading = false;
            const params = {
                type:1,
                page:this.page
            }
            this.dataService.getFavList(params).then((resp)=>{
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
        // 管理的时候点击事件 checkbox
        goodsClick(item){
            if(item.checked){
                this.$set(item,'checked',false);
                if(this.getCheckedAll){
                    this.$store.dispatch('checkedAll');
                }
            }else{
                this.$set(item,'checked',true);
                let btn = true;
                for(let i=0;i<this.goodList.length;i++){
                    let one = this.goodList[i];
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
    },
    mounted(){
        history.init(this);
        let storage = history.getData();
        if(storage){
            this.historyBack(storage)
        }else{
            this.getList();
        }
        this.$eventBus.$on('checkedAll',(val)=>{
            for(let i=0;i<this.goodList.length;i++){
                let one = this.goodList[i];
                this.$set(one,'checked',this.getCheckedAll)
            }
        }).$on('del',()=>{
            let checkId = [];
            for(let i=this.goodList.length-1;i>=0;i--){
                let one = this.goodList[i];
                if(one.checked){
                    checkId.push(one.favor_id);
                    this.goodList.splice(i,1)
                }
            }
            if(checkId.length>0){
                history.clearData();
                this.dataService.delMyFav({
                    type:1,
                    favor_id:checkId.join(',')
                }).then(resp=>{
                    this.dataService.handleResponse({
                        data:resp,
                        callback:()=>{
                            this.$eventBus.$emit('delSuccess')
                        }
                    })
                })
            }else{
                alert('请选择要取消的产品');
            }
        })
    },
    destroyed(){
        console.log('goods-destroyed')
        this.$eventBus.$off('checkedAll');
        this.$eventBus.$off('del');
    }
}
</script>

