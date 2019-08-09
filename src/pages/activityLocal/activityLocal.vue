<template>
    <div class="container">
        <!-- header -->
        <div class="header-top">
            <div class="back" @click="goBack">
                <div class="go-back"></div>
            </div>
            <div class="title">{{title}}</div>
            <!-- <div class="store-search" @click="search"></div> -->
        </div>
        <component
        :is="screen"
        ref="screenNew" 
        :screenReset="screenReset" 
        :goods_type="params.goods_type" 
        :is_main="'1'">
        </component>
        <!-- cont -->
        <scroll
        v-if="list.length>0"
        ref="scroll"
        :isEnd="isEnd"
        :upBack="upBack"
        :downBack="downBack">
            <div class="pro-list-cont">
                <div class="pro-list">
                    <local-pro :shopList='list' :isStore="false" :isMainShop="true" :showGive="type==1?false:true"></local-pro>
                </div>
            </div>
        </scroll>
        <div class="loading" v-if="!canLoading"></div>
        <no-data :text="'已无符合要求的商品'" v-else-if="list.length<=0"></no-data>
        <!-- 规格弹窗 -->
        <specificationPopUp v-if="commonData.isSpe" :isMainShop="true"></specificationPopUp>
        <!-- 页面弹窗提示 -->
        <popUp v-if="commonData.isPopUp" :type="commonData.popupType" :time="commonData.popupTime" :content="commonData.popupContent" :isMainShop="true"></popUp>
    </div>
</template>
<script>
import activityMixins from './activityMixins';
export default {
    mixins:[activityMixins]
}
</script>
<style lang="less">
    @import url('../../less/header.less');
    .pro-top{
        margin-bottom:0;
    }
    .goods-pro-cont{
        .borderTop(2);
    }
    .pro-list-cont{
        padding-top: 1px;
        background: @background-color;
    }
    .backHome{
        .pxRem(font-size,24);
        color: @red-color;
    }
</style>
