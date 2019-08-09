<template>
<div class="topActivity">
    <div class="guideHint">
        <img src="../../assets/hintLanguage.gif" alt="">
        <img src="../../assets/guideHint.png" @click="openGuide" alt="">
    </div>  
    <div class="activity">
        <div class="activity-list" v-for="(item,pIndex) in list" :key="pIndex" @click="link(pIndex)">
            <div class="activity-title">
                {{item.title_1}}
                <img v-if="pIndex == 0" src="../../assets/seckill-img.png" alt="">
                <img v-if="pIndex == 1" src="../../assets/principal-img.png" alt="">
            </div>
            <div class="activity-explain" v-text="item.title_2"></div>
            <div class="activity-area">
                <div class="activity-item" v-for="(good,index) in item.goods" :key="index">
                    <div class="activity-img">
                        <img v-if="good.store_count <= 0" src="../../assets/loot-all.png" alt="">
                        <span :style="{backgroundImage: 'url(' + good.img + ')'}"></span>
                    </div>
                    <div class="activity-price">
                        <span>¥{{good.price}}</span>
                    </div>
                </div>
                <div class="activity-item" v-for="index in (2 - item.goods.length)" :key="index">
                    <div class="activity-img">
                        <img class="comingSoon" src="../../assets/comingSoon.png" alt="">
                    </div>
                    <div class="activity-price"></div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>
<script>
export default {
    props:{
        goods_type:{
            type:Number,
            default:1
        },
        list:{
            type:Array,
            default:() => {
                return []
            }
        }
    },
    data(){
        return {}
    },
    methods:{
        link(index){
            let url = ''
            if(this.goods_type == 1){
                url = './activityLine.html?type=' + (Number(index) + 1)
            }else{
                url = './activityLocal.html?type=' + (Number(index) + 1)
            }
            location.href = url;
            // 源头活动 1  本地活动 2
            // let name = this.goods_type == 1?'activityLine':'activityLocal';
            // location.href = './'+name+'.html?type='+type;
        },
        // 打开指南
        openGuide(){
            location.href = './operationGuide.html'
        }
    }
}
</script>
<style lang="less">
    @import url('../../less/common.less');
    .activity{
        .pxRem(padding,20);
        .flex();
        .justifyContent(space-between);
    }
    .activity-list{
        .pxRem(width,330);
        .pxRem(padding-left,20);
        .pxRem(padding-right,20);
        .pxRem(padding-top,20);
        background: @white-color;
        .pxRem(border-radius,20);
        box-sizing: border-box;
    }
    .activity-title{
        .pxRem(font-size,28);
        color: @red-color;
        >img{
            .pxRem(width,30);
        }
    }
    .activity-explain{
        .pxRem(font-size,20);
        color: @gray-light-text;
    }
    .activity-area{
        .flex();
        .justifyContent(space-between);
    }
    .activity-item{
        .pxRem(width,138);
    }
    .activity-img{
        position: relative;
        .pxRem(border-radius,12);
        overflow: hidden;
        >img{
            .pxRem(width,92);
            .pxRem(height,92);
            position: absolute;
            .pxRem(left,23);
            .pxRem(top,23);
        }
        >span{
            display: block;
            .pxRem(width,138);
            .pxRem(height,138);
            background-repeat: no-repeat;
            background-position: center;
            background-size: 100%;
        }
        >.comingSoon{
            position: static;
            .pxRem(width,138);
            .pxRem(height,138);
        }
    }
    .activity-price{
        .flex();
        .justifyContent(center);
        .alignItems(center);
        .pxRem(padding-top,16);
        .pxRem(padding-bottom,24);
        .pxRem(font-size,26);
        color: @red-color;
        >.activity-snap{
            .pxRem(padding-left,6);
            .pxRem(padding-right,6);
            .pxRem(font-size,18);
            color: @white-color;
            background: @red-color;
            .pxRem(border-radius,4);
        }
    }
    // 提示指南
    .guideHint{
        .pxRem(padding,20);
        .pxRem(padding-bottom,0);
        .flex();
        .justifyContent(space-between);
        >img{
            .pxRem(height,80);
        }
    }
</style>
