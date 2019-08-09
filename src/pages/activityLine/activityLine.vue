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
                    <source-pro :shopList='list' :isOneLive='true' :isMainShop='true'></source-pro>
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
import activityMixins from '../activityLocal/activityMixins';
export default {
    data(){
        return{
            params:{
                activity_id:1,
                goods_type:'1'
            }
        }
    },
    mixins:[activityMixins],
    methods:{
        share(){
          let url = location.origin;
          let title = this.type == 1?'一元起秒杀':'顺势鸟血本卖',
              des = this.type == 1?'全国好货—低至1元':'买一送N，承包你的生活用品（源头好货）',
              imgUrl = this.type == 1?(url+'/static/img/specialOffer.png'):(url+'/static/img/moneySelling.png');
          this.common.shareFun(title,des,imgUrl);
        },
        goBack(){
            window.location.href = './index.html';
        },
        // 跳转搜索
        search(){
            window.location.href = './search.html?tab_type=1&goods_type=' + this.params.goods_type + '&isEmptyShopGroup=true'
        },
    }
}
</script>
<style lang="less">
    @import url('../../less/header.less');
    body{
        background: @background-color;
    }
    .pro-top{
        margin-bottom:0;
    }
    .goods-pro-cont{
        .borderTop(2);
    }
  .backHome{
    .pxRem(font-size,24);
    color: @red-color;
  }
</style>
