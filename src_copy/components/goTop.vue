<template>
    <img class="gotoTop" @click="goTop" src="../assets/goTop.png" alt="" v-show="goTopBtn">
</template>
<script>
export default {
    name:'goTop',
    data(){
        return {
            goTopBtn:false
        }
    },
    methods:{
        goTop(){
            this.$eventBus.$emit('scrollGoTop');
            this.goTopBtn = false;
        },
    },
    mounted(){
        // go top显示和隐藏
        this.$eventBus.$on('goTopHide',(val)=>{
            //   val  true 隐藏 false 显示
            if(val){
                this.goTopBtn = false;
            }else{
                this.goTopBtn = true;
            }
        })
    },
    destroyed(){
        this.$eventBus.$off('goTopHide');
    }
}
</script>
<style lang="less">
@import url('../less/common.less');
.gotoTop{
    position: fixed;
    .pxRem(right,16);
    .pxRem(bottom,112);
    .pxRem(width,64);
    .pxRem(height,64);
    z-index: 9999;
}
</style>
