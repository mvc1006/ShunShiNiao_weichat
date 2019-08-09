<template>
    <scroll ref="scroll" :isEnd="isEnd" :upBack="upBack" :downBack="downBack">
        <list v-for="(item,key) in dataList" :key="key" :data="item" :time="key"></list>
        <no-data v-if="Object.keys(dataList).length<=0"></no-data>
    </scroll>
</template>
<script>
import list from './list.vue'
import scroll from '@/components/scroll.vue'
import noData from './noData.vue'
export default {
    data(){
        return {
            isEnd:false,
            canLoading:true,
            page:1,
            dataList:{}
        }
    },
    methods:{
        upBack(){
            if(this.canLoading){
                this.page++ ;
                this.getData(true);
            }
        },
        downBack(){
            if(this.canLoading){
                this.page = 1 ;
                this.isEnd = false;
                this.getData();
            }
        },
        getData(load){
            this.canLoading = false;
            this.dataService.incomeDetails({
                page:this.page
            }).then(resp=>{
                this.dataService.handleResponse({
                    data:resp,
                    callback:(data)=>{
                        if(load){
                            if(data.length>0){
                                this.dataList = Object.assign(this.dataList,data)
                            }else{
                                this.isEnd = true;
                            }
                        }else{
                            this.dataList = Object.assign({},data)
                        }
                        this.$nextTick(()=>{
                            this.$refs.scroll.scroll.refresh();
                        })
                        this.canLoading = true;
                    }
                })
            })
        }
    },
    created(){
        this.getData();
    },
    components:{
        list,
        scroll,
        noData
    }

}
</script>
<style lang="less">

</style>
