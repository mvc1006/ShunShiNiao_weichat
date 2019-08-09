<template>
  <div class="shop-present" v-if="good.give_list && good.give_list.length>0" @click.stop="openSpecification(good)">
    <!-- 赠品头部 -->
    <div class="shop-present-title">
      <div><span :class="isOneLive?'shop-present-big-img':'shop-present-small-img'"></span>赠品</div>
      <div class="shop-present-num">共{{good.give_count_total || give_count_total}}款赠品可选择<!--<img class="shop-present-arrow" src="../assets/red_right_arrows.png" alt="">--></div>
    </div>
    <!-- 赠品列表 -->
    <div class="shop-present-list">
        <template v-if="isOneLive">
            <div class="shop-present-item" v-for="(give,index) in giveList" :key="index">
                <span :style="{backgroundImage: 'url(' + give.thumb_img + ')'}"></span>
                <img class="corner_marker" src="../assets/corner_marker_present.png" alt="">
            </div>
        </template>
        <template v-else>
            <div class="shop-present-item" v-for="(give,index) in giveList" :key="index">
                <span :style="{backgroundImage: 'url(' + give.thumb_img + ')'}"></span>
                <img class="corner_marker" src="../assets/corner_marker_present.png" alt="">
            </div>
        </template>
      <div class="shop-present-item fill" v-for="i in 4"></div>
    </div>
  </div>
</template>
<script>
  export default {
    name:'complimentary',
    // isOneLive true  显示一列  false 显示两列   
    //  good 商品信息
    props: ["isOneLive","good",'give_count_total'],
    data(){
      return {

      }
    },
    computed:{
        giveList:function(){
            let showNum = this.isOneLive ? 5 : 3;
            if(!this.good.give_list) return [];
            return this.good.give_list.slice(0,showNum)
        }
    },
    mounted(){
    },
    methods:{
      // 跳转赠品选择页面
      openSpecification(good){
        this.$eventBus.$emit("openSpecification",good);
      },
    },
  }
</script>
<style lang="less">
  @import "../less/common";
  /* 赠品头部 */
  .shop-present-title{
    .flex();
    .justifyContent(space-between);
    .alignItems();
    .pxRem(font-size,28);
    .pxRem(padding-top,20);
    .pxRem(padding-bottom,24);
    line-height: 1;
    color: @red-color;
  }
  .shop-present-title>div{
    .flex();
    .alignItems();
  }
  .shop-present-title>div:first-child{
    .pxRem(min-width,100);
    .flexShrink(0);
  }
  .shop-present-title>div:last-child{
    justify-content: flex-end;
    .flexGrow(1)
  }
  .shop-present-num{
    .pxRem(font-size,24)
  }
  .shop-present-small-img{
   .pxRem(margin-right,10);
  }
  .shop-present-img{
    .pxRem(width,28);
    .pxRem(height,28);
    .pxRem(margin-right,8)
  }
  .shop-present-arrow{
    .pxRem(height,16);
    .pxRem(margin-left,8)
  }
  /* 赠品列表 */
  .shop-present-list{
     .flex();
     .justifyContent(space-between);
     .flexWrap(wrap)
  }
  .shop-present-item{
    position: relative;
    .pxRem(width,120);
    .pxRem(height,120);
    .pxRem(border-radius,8);
    overflow: hidden;
    >span{
       display: block;
       .pxRem(width,120);
       .pxRem(height,120);
       background-position: center;
       background-size: auto 100%;
       background-repeat: no-repeat;
     }
  }
  .shop-present-item.fill{
    height: 0 !important;
  }
  .shop-present-item>.corner_marker{
    position: absolute;
    right: 0;
    top: 0;
    .pxRem(width,46);
    .pxRem(height,46)
  }
</style>
