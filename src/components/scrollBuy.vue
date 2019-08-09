<template>
    <transition name="fade">
        <div class="scroll-buy" v-show="isShow">
            <ul class="buy-info-list">
                <li class="buy-info-item" @click.stop="openDetails">
                    <img class="photo" :src="infoData.goods_pic" alt="">
                    <span class="info-details">{{infoData.order_desc}}</span>
                    <img class="next" v-if="infoData.goods_id != 0" src="../assets/next-white.png" alt="">
                </li>
            </ul>
        </div>
    </transition>
</template>

<script>
import dataService from '@/js/dataService'
export default {
    data(){
        return {
            infoData:{},
            timer:null,
            isShowTime:null,
            isShow:false
        }
    },
    methods:{
        getData(){
            this.nowNum = 0;
            dataService.getNewOrderInfo().then(resp=>{
                dataService.handleResponse({
                    data:resp,
                    callback:(data)=>{
                        this.infoData = data;
                        this.isShow = true;
                        this.showTimer();
                    }
                })
            })
        },
        openDetails(){
            if(this.infoData.goods_id == 0) return false;
            let { goods_id, goods_type , tab_type } = this.infoData;
            location.href = './sourceShopDetails.html?id='+goods_id + '&local=' +( goods_type==1 ? 0 : 1) +'&isBuyPresent=true';
        },
        getDataTimer(){
            this.timer = setInterval(() => {
                this.getData();
            }, 10000);
        },
        //  显示五秒隐藏
        showTimer(){
            this.isShowTime = setTimeout(() => {
                this.isShow = false;
            }, 5000);
        }
    },
    mounted(){
        this.getDataTimer();
        // this.getData();
        
    },
    beforeDestroy(){
        clearInterval(this.timer);
        clearTimeout(this.isShowTime);
    }
}
</script>

<style lang="less">
@import url('../less/common.less');
.scroll-buy{
    position: absolute;
    z-index: 9999;
    .pxRem(top,18);
    .pxRem(left,20);
    .pxRem(width,480);
    .pxRem(height,52);
    .borderRadius(26);
    background: rgba(0,0,0,0.5);
}
.buy-info-list{
    .pxRem(padding,2);
}
.buy-info-item{
    .flex();
    .alignItems();
    .photo{
        .pxRem(width,48);
        .pxRem(height,48);
        .borderRadius(24);
        .flexShrink(0);
        .flexGrow(0);
    }
    .info-details{
        .flexGrow(1);
        .pxRem(line-height,48);
        .pxRem(margin-left,16);
        .pxRem(margin-right,16);
        .pxRem(font-size,20);
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        color: @white-color;
    }
    .next{
        .pxRem(width,10);
        .pxRem(height,16);
        .pxRem(margin-right,20);
        .flexShrink(0);
        .flexGrow(0);
    }
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
