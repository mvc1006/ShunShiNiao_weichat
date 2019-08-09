<template>
  <div class="shop-present" v-if="good.give_list && good.give_list.length>0" @click.stop>
    <!-- 赠品头部 -->
    <div class="shop-present-title">
      <div><span :class="isOneLive?'shop-present-big-img':'shop-present-small-img'"></span>赠品</div>
      <div class="shop-present-num">共{{good.give_count_total || give_count_total}}款赠品可选择<!--<img class="shop-present-arrow" src="../assets/red_right_arrows.png" alt="">--></div>
    </div>
    <!-- 赠品列表 -->
    <div class="shop-present-list">
        <template v-if="isOneLive">
            <div class="shop-present-item" v-for="(give,index) in giveList" :key="index" @click="JumpShopDetails(index)" v-if="index < shopGiveNum">
                <span :style="{backgroundImage: 'url(' + give.thumb_img + ')'}"></span>
                <img class="corner_marker" src="../assets/corner_marker_present.png" alt="">
                <div class="shop-present-shade" @click.stop='lookAll' v-if="index == 4 && giveList.length > shopGiveNum">
                  <div><span>5+</span><br />查看全部</div>
                </div>
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
        shopGiveNum: 5,
      }
    },
    computed:{
        giveList:function(){
            let give_list = this.good.give_list;
            let showNum = this.isOneLive ? give_list.length : 3;
            if(!give_list) return [];
            return give_list.slice(0,showNum)
        },
        isJjk(){
          let activity_id = this.good.activity_id
          if(activity_id == 3) {return true}else{return false};
        }
    },
    mounted(){
      
    },
    methods:{
      // 跳转赠品选择页面
      openSpecification(good){
        this.$eventBus.$emit("openSpecification",good);
      },
      // 跳转商品详情页
			JumpShopDetails(num){
        if(!this.isJjk) return false;
				var id = this.giveList[num].goods_id;
        // 是否为本地  是否是主品  当钱商品id  是否清除商品组
        this.$eventBus.$emit('goDetails');
				window.location.href = './sourceShopDetails.html?local='+ (this.giveList[num].goods_type == 2 ? 1 : 0) +'&isMainShop=false&id=' + id + '&isJjk=' + this.isJjk;
      },
      // 查看全部
      lookAll(){
        this.shopGiveNum = this.good.give_list.length
      }
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
  .shop-present-shade{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .4);
    .flex();
    .justifyContent(center);
    .alignItems(center);
    line-height: 1.2;
    text-align: center;
    .pxRem(font-size,20);
    color: @white-color;
    span{
      .pxRem(font-size,28);
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
