<template>
<div class="container">
    <div class="header-top">
        <div class="back" @click="goBack">
            <div class="go-back"></div>
        </div>
        <div class="title">搜索结果</div>
    </div>
     <scroll ref="scroll" class="order-list" :isEnd="isEnd" :upBack="upBack" :downBack="downBack">
        <order-product 
        v-for="(item,index) in dataList" 
        :key="index"
        :data="item"></order-product>
        <no-data v-if="dataList.length<=0"></no-data>
    </scroll>

    <pop-up 
    v-if="pop.show" 
    :type="pop.type" 
    :content="pop.content" 
    :cancel="pop.cancel" 
    :confirm="pop.confim"
    @popupcancel="popupcancel"
    @popupconfirm="popupconfirm">
    </pop-up>
    
    <!-- 扫码领券 -->
    <chat></chat>
</div>
</template>
<script>
import orderProduct from '@/components/myOrder/orderPro';
import noData from '@/components/myFav/personalNoData'
import scroll from '@/components/scroll.vue'
import history from '@/js/history.js'
import popUp from '@/components/popUp.vue';
import chat from '@/components/myOrder/chat.vue';
export default {
    data(){
        return {
            page:1,
            dataList:[],
            isEnd:false,
            canLoading:false,
            orderId:'',
            pop:{
                show:false,
                type:2,
                content:'您确定要删除该订单吗？',
                cancel:'暂不',
                confirm:'确定'
            }
        }
    },
    computed:{
        search:function(){
            return decodeURIComponent(this.common.getUrlParam('search'))
        }
    },
    mounted(){
        history.init(this);
        let storage = history.getData();
        if(storage){
            this.historyBack(storage)
        }else{
            this.getList();
        }
        this.$eventBus.$on('delOrderPop',(data)=>{
            this.orderId = data;
            this.popShow();
        }).$on('closePopup',()=>{
            this.popStatus();
        })
    },
    methods:{
        goBack(){
            window.history.go(-2);
        },
        popupconfirm(){
            this.delOrder();
        },
        popupcancel(){
            this.popStatus();
        },
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
                keywords:this.search
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
        delOrder(data){
            this.dataService.delMyOrder({
                order_id:this.orderId
            }).then((resp)=>{
                this.dataService.handleResponse({
                    data:resp,
                    callback:(data)=>{
                        for(let i=0;i<this.dataList.length;i++){
                            let one = this.dataList[i];
                            if(one.order_id == this.orderId){
                                this.dataList.splice(i,1)
                            }
                        }
                        history.clearData();
                        this.delSucess();
                    }
                })
            })
        },
        popShow(){
            this.$nextTick(()=>{
                this.pop.show = true;
                this.pop.type = 2;
                this.pop.content = '您确定要删除该订单吗？';
            })
        },
        popStatus(){
            this.$nextTick(()=>{
                this.pop.show = false;
            })
        },
        delSucess(){
            this.pop.show = false;
            this.$nextTick(()=>{
                this.pop.show = true;
                this.pop.type = 1;
                this.pop.content = '取消订单成功';
            })
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
        popUp,
        chat
    },
}
</script>

<style lang="less">
@import url('../../less/header.less');
body{
    background: @background-color;
}
</style>
