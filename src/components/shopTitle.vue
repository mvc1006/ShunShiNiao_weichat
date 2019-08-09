<template>
    <div class="goods-title" @click="openStore(data)" v-if="!data.is_overseas">
        <template>
            <div class="title-ico store-ico"></div>
            <div class="title-store-name">{{data.shop_name}}</div>
            <div class="title-next-ico next-ico"></div>
        </template>
        <div class="right-info" v-if="rightInfo && data.order_status == 6">交易关闭</div>
        <div class="right-info" v-if="rightInfo && data.order_status == 4">交易完成</div>
    </div>
</template>
<script>
export default {
    name:'shop-title',
    props:{
        data:{
            type:Object,
            default:()=>{}
        },
        rightInfo:{
            type:Boolean,
            default:()=>false
        }
    },
    data(){
        return {};
    },
    methods:{
        openStore(data){
            let local = data.goods_type == 1 ?true:false
            location.href = './storeMerchant.html?shop_id='+data.shop_id + '&local='
            + local + "&shop_name=" + encodeURIComponent(data.shop_name)
        },
    }
}
</script>

<style lang="less" scoped>
@import url('../less/common.less');
.goods-title{
    .flex();
    .alignItems();
    .pxRem(margin-bottom,20);
    .title-store-name{
        .pxRem(font-size,26);
        color: @gray-text;
        .pxRem(margin-left,16);
        .pxRem(margin-right,16);
        .pxRem(line-height,26);
    }
    .title-next-ico{
        .pxRem(width,10);
        .pxRem(height,16);
    }
    .right-info{
        .flexGrow(1);
        color:@red-color;
        text-align: right;
    }
}
</style>
