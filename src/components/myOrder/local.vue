<template>
<div class="order-cont">
    <div class="second-tab">
        <ul class="second-list">
            <router-link tag="li" class="second-item" to="/local/all">全部 ({{local.all}})</router-link>
            <router-link tag="li" class="second-item" to="/local/pay">待付款 ({{local.wait_pay}})</router-link>
            <router-link tag="li" class="second-item" to="/local/payed">待使用 ({{local.paid}})</router-link>
            <router-link tag="li" class="second-item" to="/local/appraise">待评价 ({{local.wait_comment}})</router-link>
        </ul>
    </div>
    <router-view></router-view>
</div>
</template>
<script>
export default {
    data(){
        return {
            local: {},
        }
    },
    mounted(){
        this.dataService.orderCount().then(resp=>{
            this.dataService.handleResponse({
                data:resp,
                callback:(data)=>{
                    this.local = data.local;
                }
            })
        })
    }
}
</script>
<style lang="less">

</style>
