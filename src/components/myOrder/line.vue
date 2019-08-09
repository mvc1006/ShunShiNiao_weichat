<template>
<div class="order-cont">
    <div class="second-tab">
        <ul class="second-list">
            <router-link tag="li" class="second-item" to="/line/all">全部 ({{source.all}})</router-link>
            <router-link tag="li" class="second-item" to="/line/pay">待付款 ({{source.wait_pay}})</router-link>
            <router-link tag="li" class="second-item" to="/line/payed">待发货 ({{source.paid}})</router-link>
            <router-link tag="li" class="second-item" to="/line/receiving">待收货 ({{source.shipping}})</router-link>
            <router-link tag="li" class="second-item" to="/line/appraise">待评价 ({{source.wait_comment}})</router-link>
        </ul>
    </div>
    <router-view></router-view>
</div>
</template>
<script>
export default {
    data(){
        return {
            source: {},
        }
    },
    mounted(){
        this.dataService.orderCount().then(resp=>{
            this.dataService.handleResponse({
                data:resp,
                callback:(data)=>{
                    this.source = data.source;
                }
            })
        })
    }
}
</script>
<style lang="less">

</style>

