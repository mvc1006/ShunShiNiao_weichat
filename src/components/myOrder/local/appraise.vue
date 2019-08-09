<template>
<scroll ref="scroll" class="order-list" :isEnd="isEnd" :upBack="upBack" :downBack="downBack">
    <order-product 
    v-for="(item,index) in dataList" 
    :key="index"
    :data="item"></order-product>
    <no-data v-if="dataList.length<=0"></no-data>
</scroll>
</template>
<script>
import mixins from '../mixins.js'
export default {
    data(){
        return {
            goods_type:2,
            order_status:4
        }
    },
    mixins:[mixins],
}
</script>
