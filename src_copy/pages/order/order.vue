<template>
<div class="container">
    <div class="header-top">
        <div class="back">
            <div class="go-back" @click="goBack"></div>
        </div>
        <div class="show-list-order">
            <ul class="order-list-tab">
                <router-link to="/line" tag="li" class="order-item-tab">源头订单</router-link>
                <router-link to="/local" tag="li" class="order-item-tab">本地订单</router-link>
            </ul>
        </div>
        <div class="add-new scale-big" @click="search">
            <div class="search-img"></div>
        </div>
    </div>
    <router-view></router-view>
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

import popUp from '@/components/popUp.vue';
import chat from '@/components/myOrder/chat.vue';
export default {
    data(){
        return {
            pop:{
                show:false,
                type:2,
                content:'您确定要删除该订单吗？',
                cancel:'暂不',
                confirm:'确定'
            }
        }
    },
    methods:{
        search(){
            window.location.href = './search.html?come=orderSearch'
        },
        goBack(){
            let come = this.common.getUrlParam('come');
            if(come == 'city'){
                history.back();
            }else{
                location.href = './personCenter.html'
            }
        },
        popupconfirm(){
            this.delOrder();
        },
        popupcancel(){
            this.popStatus();
        },
        popStatus(){
            this.$nextTick(()=>{
                this.pop.show = false;
            })
        },
        popShow(){
            this.$nextTick(()=>{
                this.pop.show = true;
                this.pop.type = 2;
                this.pop.content = '您确定要删除该订单吗？';
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
        delOrder(data){
            this.dataService.delMyOrder({
                order_id:this.orderId
            }).then((resp)=>{
                this.dataService.handleResponse({
                    data:resp,
                    callback:(data)=>{
                        this.$eventBus.$emit('delOrderSuccess',this.orderId)
                        this.delSucess();
                    }
                })
            })
        }
    },
    mounted(){
        this.$eventBus.$on('delOrderPop',(data)=>{
            this.orderId = data;
            this.popShow();
        }).$on('closePopup',()=>{
            this.popStatus();
        })
        this.common.goBack(this.goBack);
    },
    components:{
        popUp,
        chat,
    }
}
</script>


<style lang="less">
 @import url('../../less/header.less');
 body{
     background: @background-color;
 }
 .order-cont{
     .flexGrow(1);
     .flex(column);
     overflow: hidden;
 }
 .show-list-order{
     .flexGrow(1);
 }
 .order-list-tab{
     .flex();
     .alignItems(center);
     .justifyContent(center); 
 }
 .order-item-tab{
     color: @red-color;
     text-align: center;
     .pxRem(line-height,48);
     .pxRem(padding-left,20);
     .pxRem(padding-right,20);
     .border(2,@red-color);
     .pxRem(font-size,24);
    &:first-child{
        .pxRem(border-top-left-radius,12);
        .pxRem(border-bottom-left-radius,12);
    }
    &:last-child{
        .pxRem(border-top-right-radius,12);
        .pxRem(border-bottom-right-radius,12);
    }
     &.active{
         background: @red-color;
         color: @white-color;
     }
 }
 .second-list{
     .flex();
     .alignItems();
     .justifyContent(space-around);
     background: @white-color;
 }
.second-item{
    color: @simple-gray-color;
    .flexGrow(0);
    .pxRem(line-height,64);
    .pxRem(font-size,24);
    .pxRem(padding-left,20);
    .pxRem(padding-right,20);
    &.active{
        color: @red-color;
        .borderBottom(2,@red-color);
    }
}
.order-list{
    .pxRem(margin-top,16);
    .pxRem(margin-right,16);
    .pxRem(margin-bottom,16);
    .pxRem(margin-left,16);
}
.header-top,.second-tab{
    .flexShrink(0);
}
.scale-big{
    .pxRem(padding-left,20);
    .pxRem(padding-top,20);
    .pxRem(padding-bottom,20);
}

</style>
