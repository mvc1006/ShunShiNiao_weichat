<template>
<div class="pro-cont">
    <div class="goods-item"
        v-for="(item,index) in goodList"
        :key="index"
        @click="goodsClickIn(item)">
        <div class="left-select" v-show="showCheck">
            <input type="checkbox" :checked="item.checked">
        </div>
        <div class="left-img">
            <img class="pro-img" :src="item.thumb_img" alt="">
            <img class="left-tag-main" v-if="item.tab_type == 1" src="../../assets/orderMain.png" alt="">
            <img class="left-tag-give" v-else-if="item.tab_type == 2" src="../../assets/corner_marker_present.png" alt="">
        </div>
        <ul class="right-info">
            <li class="title" v-text="item.goods_name"></li>
            <li class="fav-num" v-if="!notShowText" v-text="item.favor_count + '人收藏'"></li>
            <li class="price-tag">
                <div class="price" :class="{'not':item.tab_type == 2}">￥{{item.market_price}}</div>
                <div class="now-price" v-if="item.tab_type == 2">￥0.00</div>
                <div class="tag">
                    <div class="tag-box" v-if="item.goods_type == 2">
                        <img src="../../assets/fav_goods_tag2.png" alt="">
                    </div>
                    <div class="tag-box" v-else-if="item.goods_type == 1">
                        <img src="../../assets/fav_goods_tag1.png" alt="">
                    </div>
                </div>
            </li>
        </ul>
    </div>
</div>
</template>
<script>
export default {
    props:{
        goodList:{
            type:Array,
            default:()=>{
                return []
            }
        },
        showCheck:false,
        goodsClick:{
            type:Function
        },
        notShowText:{
            type:Boolean,
            default:false
        }
    },
    data(){
        return {};
    },
    methods:{
        goodsClickIn(item){
            if(this.showCheck){
                this.goodsClick(item);
            }else{
                this.$eventBus.$emit('goDetails');
                const isBuyPresent = (item.tab_type == 1)?true:false;
                const local = (item.goods_type == 1)?0:1;
                location.href = './sourceShopDetails.html?id='+item.goods_id + '&local='+local+'&isBuyPresent='+isBuyPresent;
            }
        }
    }
}
</script>

<style lang="less">
@import url('../../less/common.less');
.pro-cont{
    .flexGrow(1);
    .pxRem(padding-left,20);
    .pxRem(padding-right,20);
    // .pxRem(padding-bottom,16);
    // .pxRem(padding-top,16);
    overflow: scroll;
}
.goods-item{
    .flex();
    .alignItems(flex-start);
    background: @white-color;
    .borderRadius(8);
    .pxRem(padding-top,16);
    .pxRem(padding-bottom,16);
    .pxRem(margin-top,16);
}
.left-select{
    .alignSelf(center);
    .pxRem(margin-left,16);
    .pxRem(width,32);
    .pxRem(height,32);
}
.left-img{
    .flexGrow(0);
    .flexShrink(0);
    .pxRem(margin-left,16);
    .pxRem(margin-right,16);
    .pxRem(width,200);
    .pxRem(height,200);
    position: relative;
    .borderRadius(8);
    overflow: hidden;
    .pro-img{
        .pxRem(width,200);
        .pxRem(height,200);
    }
    .left-tag-main{
        .pxRem(width,44);
        .pxRem(height,44);
        position:absolute;
        top: 0;
        .pxRem(right,8);
        
    }
    .left-tag-give{
        .pxRem(width,46);
        .pxRem(height,46);
        position:absolute;
        top: 0;
        right: 0;
    }
}

.right-info{
    .flex(column);
    .pxRem(height,200);
    .justifyContent(space-around);
    .flexGrow(1);
    .title{
        .pxRem(font-size,24);
        color: @gray-text;
        .pxRem(line-height,36);
    }
    .fav-num{
        .pxRem(font-size,20);
        color: @gray-light-text;
    }
    .price-tag{
        .flex();
        .alignItems();
        .price{
            .pxRem(font-size,26);
            color: @red-color;
            .pxRem(margin-right,10);
            &.not{
                text-decoration: line-through;
            }
        }
        .now-price{
            .pxRem(font-size,20);
            color: @gray-text;
        }
        .tag{
            position: relative;
            .flexGrow(1);

        }
        .tag-box{
            .pxRem(width,76);
            .pxRem(height,50);
                position: absolute;
            .pxRem(top,-30);
            .pxRem(right,-6);
            img{
                width: 100%;
                height: 100%;
            }
        }
    }
}
</style>

