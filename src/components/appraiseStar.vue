<template>
    <div class="star-cont">
        <span class="big-star" 
        v-for="i in defalut" 
        :key="i" 
        :class="{'active':i<=now}"
        @click="select(i)"></span>
    </div>
</template>
<script>
export default {
    props:{
        selectFn:{
            type:Function
        }
    },
    data(){
        return {
            defalut:5,
            now:5
        };
    },
    methods:{
        select(val){
            this.now = val;
            this.$emit('selectFn',val)
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
