<template>
    <div class="container">
        <div class="header-top">
            <div class="back" @click="goBack">
                <div class="go-back"></div>
            </div>
            <div class="title">收支明细</div>
        </div>
        
        <ul class="tab-list">
            <router-link tag="li" to="/all" class="tab-item">全部</router-link>
            <router-link tag="li" to="/come" class="tab-item">收入</router-link>
            <router-link tag="li" to="/out" class="tab-item">支出</router-link>
        </ul>
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    name:'app',
    data(){
        return {
            isBind:false,
            data:{}
        }
    },
    methods:{
        goBack(){
            location.href = './shopIncome.html';
        }
    },
    mounted(){
        this.common.goBack(this.goBack);
    },
}
</script>


<style lang="less">
@import url('../../less/header.less');
body{
    background: @background-color;
}
.tab-list{
    background: @white-color;
    .flex();
    .alignItems();
    .justifyContent(space-around);
    .flexShrink(0);
}
.tab-item{
    .pxRem(line-height,60);
    .pxRem(padding-left,40);
    .pxRem(padding-right,40);
    color: @gray-text;
    .borderBottom(4);
    border-color: transparent;
    &.active{
        color:@red-color;
        border-color: @red-color;
    }
}

</style>
