<template>
    <div class="container">
        <div class="header-top">
            <div class="back">
                <div class="go-back" @click="goBack"></div>
            </div>
            <div class="title">我的分享</div>
        </div>
        <good-list></good-list>
    </div>
</template>
<script>
import goodList from '@/components/myShareGoods.vue';
export default {
    name:'app',
    data(){
        return {

        }
    },
    methods:{
        goBack:function(){
            location.href = './personCenter.html'
        },
    },
    components:{
       goodList
    }
}
</script>
<style lang="less">
    @import url('../../less/header.less');
    body{
        background: @background-color;
    }
</style>

