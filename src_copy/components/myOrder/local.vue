<template>
<div class="order-cont">
    <div class="second-tab">
        <ul class="second-list">
            <router-link tag="li" class="second-item" to="/local/all">全部</router-link>
            <router-link tag="li" class="second-item" to="/local/pay">待付款</router-link>
            <router-link tag="li" class="second-item" to="/local/payed">待使用</router-link>
            <router-link tag="li" class="second-item" to="/local/appraise">待评价</router-link>
        </ul>
    </div>
    <router-view></router-view>
</div>
</template>
<script>
export default {
    
}
</script>
<style lang="less">

</style>
