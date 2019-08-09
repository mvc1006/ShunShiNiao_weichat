<template>
<div class="left-btn-group">
    <div class="left-btn" v-if="!isIndex" @click="goIndex">
        <img src="../assets/city-home-btn.png" alt="">
        <span>活动<br/>首页</span>
    </div>
    <div class="left-btn" @click="goOrder">
        <img src="../assets/city-order-btn.png" alt="">
        <span>我的<br/>订单</span>
    </div>
</div>
</template>
<script>
export default {
    props:{
        isIndex:{
            type:Boolean,
            default:false
        }
    },
    computed:{
        pid:function(){
            return this.common.getUrlParam('pid') || '';
        }
    },
    data(){
        return {}
    },
    methods:{
        goIndex(){
            location.href = './cityConcat.html?pid='+this.pid;
        },
        goOrder(){
            this.dataService.isFollow().then(resp=>{
                this.dataService.handleResponse({
                    data:resp,
                    callback:(data)=>{
                        location.href = data.jump_url ? data.jump_url : './order.html?come=city#/local/all';
                    }
                })
            })
        }
    }
}
</script>

<style lang="less">
@import url('../less/header.less');
.left-btn-group{
    position: fixed;
    right: 0;
    .pxRem(bottom,400);
}
.left-btn{
    .pxRem(height,54);
    .pxRem(margin-bottom,24);
    background: @white-color;
    .pxRem(border-top-left-radius,54);
    .pxRem(border-bottom-left-radius,54);
    .border(4);
    border-right:0;
    .flex();
    .alignItems();
    img{
        .pxRem(margin-left,10);
        .pxRem(width,42);
        .pxRem(height,42);
    }
    span{
        .pxRem(line-height,26);
        .pxRem(font-size,20);
        .pxRem(margin-left,16);
        .pxRem(margin-right,16);
    }
}
</style>
