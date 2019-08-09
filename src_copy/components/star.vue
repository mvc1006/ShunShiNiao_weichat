<template>
<div class="star-cont">
    <div class="star" v-for="n in all" :key="n" :class="{'active':addClass(n)}"></div>
</div>
    
</template>

<script>
export default {
    props:{
        num:{
            type:Number,
            default:5
        }
    },
    data(){
        return {
            all:5
        }
    },
    methods:{
        addClass(val){
            if(val<=this.num){
                return true;
            }else{
                return false;
            }
        }
    }
}
</script>

<style lang="less">
@import url('../less/common.less');
    .star-cont{
        .flex();
        .alignItems();
    }
    
</style>
