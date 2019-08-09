<template>
    <div class="container">
        <div class="header-top">
            <div class="back" @click="goBack">
                <div class="go-back"></div>
            </div>
            <div class="title">最近浏览</div>
            <div class="empty" @click="getHistoryDel">清空</div>
        </div>
        <good-list ref="goodList"></good-list>
        <popUp v-if="isPopUp" :type='1' :time='3000' :content='"浏览记录已清空"'></popUp>
    </div>
</template>
<script>
import goodList from '@/components/readHistory/historyGoods.vue';
import popUp from "@/components/popUp.vue"
export default {
    name:'app',
    data(){
        return {
            isPopUp: false,
        }
    },
    mounted(){
        this.$eventBus.$on("closePopup",()=>{
            this.isPopUp = false;
            this.$refs.goodList.getHistoryDel();
        });
    },
    methods:{
        goBack:function(){
            history.back();
        },
        // 清空浏览记录
        getHistoryDel(){
            this.dataService.getHistoryDel().then((resp)=>{
                if(resp.data.code==1000){
                    this.isPopUp = true;
                }
            })
        }
    },
    components:{
       goodList,
       popUp
    }
}
</script>
<style lang="less">
    @import url('../../less/header.less');
    body{
        background: @background-color;
        .pxRem(font-size,24) !important;
    }
    // .header-top{
    //     position: relative;
    //     .back{
    //         position: absolute;
    //         height: 100%;
    //     }
    //     .empty{
    //         position: absolute;
    //         .pxRem(right, 20);
    //     }
    // }
</style>

