<template>
<div class="order-cont">
    <div class="second-tab">
        <ul class="second-list">
            <router-link tag="li" class="second-item" to="/line/all">全部</router-link>
            <router-link tag="li" class="second-item" to="/line/pay">待付款</router-link>
            <router-link tag="li" class="second-item" to="/line/payed">待发货</router-link>
            <router-link tag="li" class="second-item" to="/line/receiving">待收货</router-link>
            <router-link tag="li" class="second-item" to="/line/appraise">待评价</router-link>
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

