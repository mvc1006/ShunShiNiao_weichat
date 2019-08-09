<template>
<div class="group-main-goods" @click="openDetails(data)">
    <div class="group-left-img">
        <img v-if="data.is_main==2" class="small-tag" src="../assets/corner_marker_present.png" alt="">
        <img :src="data.goods_pic" alt="">
    </div>
    <div class="group-right-info">
        <p class="title">{{data.goods_name}}</p>
        <p class="classify">{{data.spec_key_name}}</p>
        <p class="bottom main" v-if="data.is_main == 1">
            <span class="money2">￥{{data.goods_price}}</span>
            <span class="money">￥{{data.market_price}}</span>
            <span class="num">x{{data.goods_num}}</span>
        </p>
        <p class="bottom" v-else>
            <span class="money2">￥{{data.goods_price}}</span>
            <span class="money">￥0.00</span>
            <span class="num">x{{data.goods_num}}</span>
        </p>
    </div>
</div>
</template>
<script>
export default {
    props:{
        data:{
            type:Object,
            default:()=>{
                return {};
            }
        }
    },
    methods:{
        openDetails(data) {
            const local = data.goods_type == 1 ? 0 : 1;
            const isBuyPresent = data.is_main == 1 ? true : false;
            location.href =
                "./sourceShopDetails.html?id=" +
                data.goods_id +
                "&local=" +
                local +
                "&isBuyPresent=" +
                isBuyPresent;
        }
    }
}
</script>
<style lang="less">
@import url('../less/common.less');
.group-main-goods {
    .pxRem(padding-top, 16);
    .pxRem(padding-bottom, 16);
    .pxRem(padding-left, 16);
    .pxRem(padding-right, 16);
    background: @white-color;
    .pxRem(margin-top, 20);
    .flex();
    .group-left-img {
        position: relative;
        .flexGrow(0);
        .flexShrink(0);
        .pxRem(width, 160);
        .pxRem(height, 160);
        .borderRadius(8);
        overflow: hidden;
        .pxRem(margin-right, 16);
        >.small-tag{
            position: absolute;
            right: 0;
            .pxRem(width,44);
            .pxRem(height,44);
        }
    }
    .group-right-info {
        .flexGrow(1);
        .flex(column);
        .justifyContent(space-between);

        .title {
            .pxRem(font-size, 24);
            .pxRem(line-height, 36);
            color: @gray-text;
        }
        .classify {
            .pxRem(font-size, 20);
            color: @gray-light-text;
            .pxRem(line-height, 60);
        }
        .bottom {
            .flex();
            .alignItems();
            .money {
                color: @gray-light-text;
                color: @gray-light-text;
                .pxRem(font-size, 20);
            }
            .money2 {
                color: @red-color;
                .pxRem(font-size, 26);
                text-decoration: line-through;
                .pxRem(margin-right, 12);
            }
        }
        .main{
            .money {
                color: @gray-light-text;
                color: @gray-light-text;
                .pxRem(font-size, 26);
                text-decoration: line-through;
            }
            .money2 {
                color: @red-color;
                .pxRem(font-size, 26);
                .pxRem(margin-right, 12);
                text-decoration: none;
            }
        }
        
        .num {
            .pxRem(font-size, 24);
            color: @gray-text;
            .flexGrow(1);
            text-align: right;
        }
    }
}
</style>
