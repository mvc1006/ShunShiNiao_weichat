<template>
    <div class="no-data-text" v-text="text"></div>
</template>
<script>
export default {
    props:{
        text:{
            type:String,
            default:'空空如也~~'
        }
    }
}
</script>

<style lang="less">
@import url('../../less/common.less');
.no-data-text{
    color: @gray-light-text;
    .pxRem(font-size,24);
    text-align: center;
    .pxRem(margin-top,100)
}
</style>