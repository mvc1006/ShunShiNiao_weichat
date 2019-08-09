<template>
<div class="order-cont">
    <div class="pay-hint"><img src="../../../assets/hintTrumpet.png">未付款订单将在次日凌晨1点关闭，请及时付款哦～</div>
    <scroll ref="scroll" class="order-list" :isEnd="isEnd" :upBack="upBack" :downBack="downBack">
        <order-product 
        v-for="(item,index) in dataList" 
        :key="index"
        :data="item"></order-product>
        <no-data v-if="dataList.length<=0"></no-data>
    </scroll>
</div>
</template>
<script>
import mixins from '../mixins.js'
export default {
    data(){
        return {
            goods_type:1,
            order_status:''
        }
    },
    mixins:[mixins]
}
</script>
<style lang="less">
    @import url('../../../less/common');
    .pay-hint{
        .flexShrink(0);
        .flex();
        .alignItems();
        .pxRem(line-height,64);
        .pxRem(padding-left,16);
        .pxRem(padding-right,16);
        .pxRem(font-size,22);
        color: @yellow-text;
        background: @yellow-background;
        >img{
            .pxRem(width,20);
            .pxRem(margin-right,8);
        }
    }
</style>