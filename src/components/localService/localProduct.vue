<template>
    <div class="pro-item">
        <div class="shop-info" v-if="showShopInfo && data.is_overseas == 0">
            <shop-title :data="data"></shop-title>
        </div>
        <div class="pro-top" :class="(isMain && ![1].includes(data.activity_id)) && data.give_count_total ?'':'noBorder'" @click="openDetails(data)">
            <div class="left-img">
                <!--<img :src="data.thumb_img" alt>-->
                <img class="loot-all" v-if="!data.store_count" src="../../assets/loot-all.png" alt="">
                <span :style="{backgroundImage: 'url(' + data.thumb_img + ')'}"></span>
                <img v-if="isSelectMain(data.goods_id)" class="corner-marker" src="../../assets/corner_marker.png" alt="">
            </div>
            <div class="right-info">
                <!-- 名字  距离 -->
                <div class="info-top">
                    <div class="title" v-text="data.goods_name"></div>
                    <div class="distance" v-if="data.distance">{{data.distance}}</div>
                </div>
                <!-- 评级星星  -->
                <div class="info-center">
                    <star :num="data.goods_point"></star>
                    <div class="info-center-right" v-if="!isMain">[已售{{data.sales_sum}}]</div>
                    <div class="add-to-buy" :class="{'active':data.able_buy == 0}" v-if="isMain&&isGrey(data.activity_id)" @click.stop="openSpecification(data)" v-text="isGrey(data.activity_id)"></div>
                </div>

                <!-- 主产品区域显示 -->
                <div class="info-bottom" v-if="isMain">
                    <div class="pro-price">￥{{data.shop_price}} <span v-if="data.activity_id != 3 && data.shop_price!=data.market_price">￥{{data.market_price}}</span></div>
                    <div class="sell-num">[已售{{data.sales_sum}}]</div>
                </div>
                <!-- 赠品区域显示 -->
                <template v-else>
                    <div class="info-bottom">
                        <div class="pro-price give-price">平台在售价: <span class="disabled">￥{{data.shop_price}}</span></div>
                    </div>
                    <div class="info-bottom">
                        <div class="now-price">￥0.00</div>
                        <template v-if="!isHaveMain">
                            <div class="add-to-buy active" v-if="isSelectPresent(data.goods_id)" @click.stop="cancelSelect(data.goods_id)">取消选择</div>
                            <div class="add-to-buy" v-if="!isSelectPresent(data.goods_id)" @click.stop="openSpecification(data)">选为赠品</div>
                        </template>
                    </div>
                </template>
                
                <!--选择赠品提示-->
                <div class="shop-hint" v-if="isMain && ![1,3].includes(data.activity_id) && data.give_count"><img src="../../assets/hint.png">本主商品最多可选择{{data.give_count}}款赠品</div>
            </div>
        </div>
        <div v-if="(!commonData.isEmptyShopGroup)&&!isSelectMain(data.goods_id)&&isMain" @click.stop='openSpecification(data)' class="select-main">选为主商品</div>
        <div v-if="(!commonData.isEmptyShopGroup)&&isSelectMain(data.goods_id)&&isMain" @click.stop='openSpecification(data)' class="select-main active">已选为主商品</div>
        <div v-if="commonData.isEmptyShopGroup && showGive">
            <!-- 主产品区的赠品 -->
            <give-list  v-if="isMain"
            :isOneLive="true"
            :good="data"
            :isJjk='isJjk'></give-list>
            <!-- 赠品模块时 显示的提示语句 -->
            <div class="pro-tips" v-else>
                <img src="../../assets/hint.png" alt>
                <span>赠品需搭配主商品购买方可下单哦！</span>
            </div>
        </div>
    </div>
</template>

<script>
import star from "../star.vue";
import localStorageCorrelation from '@/js/localStorageCorrelation';
import giveList from '@/components/complimentary';
import shopTitle from '@/components/shopTitle.vue';
export default {
    props: {
        isMain: {
            // 默认显示主产品区域
            type: Boolean,
            default: true
        },
        showGive:{
            //  默认为正常产品 显示赠品区 活动时 传入false
            type: Boolean,
            default: true
        },
        data: {
            type: Object,
            default: () => {
                return {};
            }
        },
        pageName: {
          type: String,
          default:() => {
            return '';
          }
        },
        showShopInfo:{
            type: Boolean,
            default: false
        },
        isJjk: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
        };
    },
    mounted(){
        this.$eventBus.$on('openSpecification',(good)=>{
            //this.openSpecification(good)
        })
    },
    methods: {
        openDetails(data) {
            const local = (data.goods_type == 1)?0:1;
            this.$eventBus.$emit('goDetails');
            if(this.isMain && data.activity_id != 0){
                location.href = './sourceShopDetails.html?id='+data.goods_id + '&local='+local+'&isBuyPresent=true&activity_id=' + data.activity_id + '&isJjk=' + this.isJjk;
            }else{
                location.href = './sourceShopDetails.html?id='+data.goods_id + '&local='+local+'&isBuyPresent='+this.isMain+'&isMainShop='+this.isMain+'&isEmptyShopGroup='+this.commonData.isEmptyShopGroup
            }
        },
        addToBuy(data){
            if(data.added){
                this.$set(data,'added',false);
                this.$set(data,'addName','选为赠品');
            }else{
                this.$set(data,'added',true);
                this.$set(data,'addName','取消选择');
            }
        },
        // 选择规格
        openSpecification(data){
            if(data.able_buy == 0){return false}
            if(this.commonData.ssn_shopGroup.mainShop.goods_id == data.goods_id&&this.isMainShop) {
              switch(this.commonData.isActivity){
                  case 1:
                  case 3:
                    window.location.href = "./confirmOrder.html"
                  break;
                  case 2:
                    window.location.href = './selectShop.html?buyPresent=false';
                  break;
                  default:
                    window.location.href = './selectShop.html?buyPresent=false&id='+data.goods_id;
                  break;
              }
              return false;
            }
            this.commonData.shopData = data;
            this.commonData.isSpe = true;
        },
        // 文字显示
        isGrey(id){
            return id == 1 ? '立即购买' : (id == 5 || id == 6) ? '立即领取' : ''
        },
        // 取消选择为赠品
        cancelSelect(id){
          var that = this;
          this.commonData.ssn_shopGroup.presentList.forEach(function(item,index){
            if(item.goods_id == id){
              that.commonData.ssn_shopGroup.presentList.splice(index,1);
            }
          })
          localStorageCorrelation.setLocalStorage(that);
        },
        // 是否已经选择为赠品
        isSelectPresent(id){
          var isTrue = false;
          if(!this.commonData.ssn_shopGroup.presentList) return false;
          this.commonData.ssn_shopGroup.presentList.forEach(function(item){
            if(item.goods_id == id){
              isTrue = true;
            }
          });
          return isTrue;
        },
        // 判断是否选择为主品
        isSelectMain(id){
          return this.commonData.ssn_shopGroup.mainShop.goods_id == id;
        }
    },
    computed:{
        commonData(){
            return this.$store.state.commonData;
        },
        isHaveMain(){ // 是否存在主商品
            return JSON.stringify(this.commonData.ssn_shopGroup.mainShop) == "{}";
        }
    },
    components: {
        star,
        giveList,
        shopTitle
    }
};
</script>
<style lang="less">
@import "../../less/common.less";
@import "../../less/localService.less";
.pro-item {
    // .pxRem(padding-top, 60);
    // .pxRem(padding-right, 20);
    // .pxRem(padding-bottom, 30);
    // .pxRem(padding-left, 20);
    // .borderTop(2, @border-color);
    .pxRem(padding-top, 20);
    .pxRem(padding-right, 20);
    .pxRem(padding-bottom, 30);
    .pxRem(padding-left, 20);
    .pxRem(margin-left,16);
    .pxRem(margin-right,16);
    .pxRem(margin-top,16);
    .borderRadius(8);
    background: @white-color;
    overflow: hidden;
}
.info-top {
    .flex(row);
    .alignItems(flex-start);
    .title {
        color: @gray-text;
        .pxRem(font-size, 28);
        .flexGrow(1);
    }
    .distance {
        color: @simple-gray-color;
        text-align: right;
        .flexGrow();
        .pxRem(min-width, 100);
        .pxRem(font-size, 24);
    }
}
.info-bottom {
    .flex();
    .alignItems(flex-end);
    .pro-price {
        color: @red-color;
        text-align: left;
        .pxRem(font-size, 36);
        &.give-price{
            .pxRem(font-size, 24);
            color: @gray-light-text;
        }
        >.disabled {
            color: @red-color;
            .pxRem(font-size, 24);
            text-decoration: line-through;
        }
         >span{
            color: @gray-light-text;
            text-decoration: line-through;
            .pxRem(font-size,24)
          }
    }
    .now-price {
        color: @gray-text;
        text-align: left;
        // .pxRem(margin-left, 16);
        .pxRem(font-size, 24);
        .flexGrow(1);
    }
    .sell-num {
        color: @simple-gray-color;
        text-align: right;
        .pxRem(font-size, 24);
        .flexGrow(1);
    }
}
.add-to-buy{
    .flexGrow(0);
    .alignSelf(flex-end);
    .pxRem(width,100);
    .pxRem(line-height,40);
    .border(2,@red-color);
    .borderRadius(4);
    color: @red-color;
    text-align: center;
    .pxRem(font-size,16);
    &.active{
        .border(2,@simple-gray-color);
        color:@simple-gray-color;
    }
    &.disabled{
        background: rgba(@red-color, 0.5);
    }
}
.goods-pro-tips {
    .flex();
    .alignItems();
    .goods-text {
        .pxRem(font-size, 28);
        color: @red-color;
        .pxRem(margin-right, 16);
        .pxRem(margin-left, 10);
    }
    .goods-select-num {
        .pxRem(font-size, 24);
        color: @red-color;
        .flexGrow(1);
        text-align: right;
    }
    .shop-present-arrow{
        .pxRem(width,16);
        .pxRem(height,20);
        .pxRem(margin-left,4);
        .flexGrow(0);
        background: url(../../assets/red_right_arrows.png) no-repeat center center;
        background-size: 100%;

    }

}
.pro-tips {
    .pxRem(margin-top,10);
    .flex();
    img {
        .pxRem(width, 28);
        .pxRem(height, 28);
        .flexGrow(0);
    }
    span {
        .flexGrow(1);
        .pxRem(font-size, 24);
        .pxRem(margin-left, 10);
        color: @gray-light-text;
    }
}
.info-center{
    .flex();
    .alignItems();
    .justifyContent(space-between);
    .info-center-right{
        .flexGrow(1);
        text-align: right;
        .pxRem(font-size,24);
    }
}

.select-main{
  text-align: center;
  .pxRem(line-height,55);
  .pxRem(font-size,24);
  .pxRem(padding-top,12);
  color: @red-color;
}
.select-main.active{
  color: @gray-light-text;
}
// 商品提示
   .shop-hint {
   .flex();
   .alignItems(baseline);
   .pxRem(font-size, 20);
     color: @gray-text;
   .pxRem(padding-bottom, 8)
   }
.shop-hint > img {
.pxRem(width, 28);
.pxRem(height, 28);
.pxRem(margin-right, 8)
}
.shop-info{
    .pxRem(margin-bottom,28)
}

</style>
