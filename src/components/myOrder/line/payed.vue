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
            goods_type:1,
            order_status:2
        }
    },
    mixins:[mixins]
}
</script>
