<template>
<div class="order-list">
    <order-product 
    v-for="(item,index) in dataList" 
    :key="index"
    :data="item"></order-product>
    <no-data v-if="dataList.length<=0"></no-data>
</div>
</template>
<script>
import mixins from '../mixins.js'
export default {
    data(){
        return {
            goods_type:2,
            order_status:3
        }
    },
    mixins:[mixins],
}
</script>
