<template>
    <div class="in-come-no-data">
        <img src="../../assets/income-no-data.png" alt="">
        <p>暂无记录</p>
    </div>
</template>
<script>
export default {
    
}
</script>

<style lang="less">
@import url('../../less/common.less');
.in-come-no-data{
    margin:0 auto;
    text-align: center;
    .pxRem(margin-top,100);
    img{
        .pxRem(width,170);
        .pxRem(height,170);
    }
    p{
        color:@gray-light-text;
        .pxRem(line-height,80);
        .pxRem(font-size,24);
    }
}
</style>

