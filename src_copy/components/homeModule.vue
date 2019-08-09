<template>
  <div class='homeModule'>
    <!-- 顶部搜索区域 -->
    <div class="header">
      <span v-if="isMainShop" class="header-logo"></span>
      <span v-if="!isMainShop" class="go-back" @click="goBack"></span>
      <div class="header-input" @click="search">
        <img src="../assets/search.png">
        <span v-if="search_text">{{search_text}}</span>
        <span v-else>请输入搜索内容~</span>
      </div>
      <div class="place-box" v-if="isMainShop||mainMenu==0">
        <img @click="cutStyle" v-if="!isOneLive" class="header-style" src="../assets/cutStyle.png" alt="">
        <img @click="cutStyle" v-if="isOneLive" class="header-style" src="../assets/cutStyleOne.png" alt="">
      </div>
      <div class="place-box" v-if="!isMainShop&&mainMenu==1" @click="changeCity">
        <img src="../assets/serve_unselected.png" alt="">
        <p>{{currentSite}}<img src="../assets/bottomArrows.png"/></p>
      </div>
    </div>
    <!-- 主分类 -->
    <div class="main-classify" :class="{'home': isMainShop}">
      <template v-if="isMainShop">
        <!-- <div :class="mainMenu==0?'active':''" @click="cutMainMenu(0)">主商品</div>
        <div :class="mainMenu==1?'active':''" @click="cutMainMenu(1)">赠品</div> -->
      </template>
      <template v-else>
        <div :class="mainMenu==0?'active':''" @click="cutMainMenu(0)">{{isBuyPresent==true?'源头主品':'源头赠品'}}</div>
        <div :class="mainMenu==1?'active':''" @click="cutMainMenu(1)">{{isBuyPresent==true?'本地主品':'本地赠品'}}</div>
      </template>
    </div>
    <!-- 详细分类 -->
    <div class="detail-classify" v-if="cateList.length>0">
      <div class="detail-list">
        <div class="detail-item active" @click="cutDetailMenu(index)">推荐</div>
        <div class="detail-item" v-for="(item,index) in cateList" :key="index" @click="cutDetailMenu(index)">{{item.name}}</div>
      </div>
      <div @click="cutDetailMenu()" class="more-classify"><img src="../assets/advance.png" alt=""></div>
    </div>
  </div>
</template>
<script>
import history from '@/js/history'
  export default {
    name:'homeModule',
    // 参数说名: 是否为主品,是否为首页,一行显示几个,搜索框中内容,选择的是第几个菜单,选择的是第几个详情菜单,详细菜单列表,当前位置
    props: ["isBuyPresent","isMainShop","isOneLive","search_text","mainMenu","cateList","currentSite",'selectPresent'],
    data(){
      return {
        detailMenu: 0,
      }
    },
    methods:{
      // 返回上一页
      goBack(){
        window.history.go(-1);
      },
      // 跳转搜索页面
      search(){
        console.log(this.selectPresent);
        if(Number(this.selectPresent)){
          window.location.href = './search.html?share_main_order_goods_id=' + this.selectPresent + "&goods_type=" + (this.isMainShop?1:this.mainMenu==0?1:2) + '&tab_type=2'
          return false
        }
        // 是否为本地  是否为主品
        window.location.href = './search.html?tab_type=' + (this.isBuyPresent?1:2) + "&goods_type=" + (this.isMainShop?1:this.mainMenu==0?1:2) + '&isEmptyShopGroup='+this.commonData.isEmptyShopGroup
      },
      // 点击切换商品列表样式
      cutStyle(){
        this.$eventBus.$emit("cutStyle");
      },
      // 切换城市
      changeCity(){
        history.clearData();
        location.href = './changeCity.html';
        // this.$eventBus.$emit("changeCity");
      },
      // 点击切换主分类
      cutMainMenu(num){
        this.$eventBus.$emit("cutMainMenu",num);
      },
      // 切换详细分类
      cutDetailMenu(num){
        this.$eventBus.$emit("cutDetailMenu",num);
        var id = num || num == 0 ?  this.cateList[num].id:this.cateList[0].id;
        this.detailMenu = num;
        let title = this.isBuyPresent?3:4;
        sessionStorage.removeItem('classifyAddress');
        if(!num && num != 0){
          window.location.href = './classifyAll.html?id='+id+"&title="+title+'&goods_type=1';
          return false;
        }
        location.href = 'searcResult.html?goods_type=1&tab_type='+(this.isBuyPresent?1:2) +'&page=classifAll&bigId='+id;
      },
    },
    computed:{
      commonData(){
        return this.$store.state.commonData
      }
    },
    components:{}
  }
</script>
<style lang='less'>
  @import "../less/common";
  .homeModule{
    background: @background-color;
    >div{
      background: @white-color;
    }
  }
  /* 头部 */
  .header{
    .flex();
    .justifyContent(space-between);
    .alignItems();
    .pxRem(padding,16);
    .pxRem(padding-top,12);
    .pxRem(padding-bottom,12);
  }
  .header-logo{
    .pxRem(width,64);
    .pxRem(height,64);
    margin: 0 !important;
  }
  .header-input{
    .flex();
    .alignItems();
    .pxRem(width,546);
    .pxRem(line-height,72);
    .pxRem(height,72);
    .pxRem(font-size,24);
    .pxRem(border-radius,12);
    background: #F2F1F0;
    color: @gray-light-text;
  }
  .header-input>img{
    .pxRem(margin-left,32);
    .pxRem(margin-right,16);
    .pxRem(width,24);
    .pxRem(height,24)
  }

  .place-box{
    flex-shrink: 0;
    flex-grow: 0;
    .pxRem(font-size,16);
    text-align: center;
    .flex();
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    align-content: center;
    .pxRem(width,60);
    >img{
      .pxRem(width,32);
      .pxRem(height,32);
    }
    >p{
      width: 100%;
      .flex();
      .alignItems(center);
      >img{
        .pxRem(width,16);
        .pxRem(margin-left,8);
      }
    }
    >.header-style{
      .pxRem(width,48);
      .pxRem(height,48);
     }
  }
  /* 主分类 */
  .main-classify{
    .flex();
    .pxRem(font-size,28);
    color: @gray-text;
    &.home{
      overflow: hidden;
      >div{
        .borderBottom(3);
      }
      >.active{
        font-weight: bold;
        .pxRem(font-size,32);
        .borderBottom(3,@red-color,solid);
      }
    }
  }
  .main-classify>div{
    .pxRem(height,82);
    .pxRem(line-height,76);
    flex-grow: 1;
    width: 50%;
    text-align: center;
    .borderBottom(4);
  }
  .main-classify>.active{
    font-weight: bold;
    .pxRem(font-size,32);
    .borderBottom(4,@red-color,solid);
    color: @red-color;
  }
  /* 详细分类 */
  .detail-classify{
    position: relative;
  }
  .detail-list{
    display: -webkit-box;
    display: box;
    overflow-x: scroll;
    .pxRem(margin-right,60);
    .pxRem(padding,14);
  }
  .more-classify{
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    .flex();
    .alignItems();
    .pxRem(padding-left,22);
    .pxRem(padding-right,22);
    background: rgba(255,255,255,.8);
  }
  .more-classify>img{
    .pxRem(width,16);
    .pxRem(height,28)
  }
  .detail-item{
    line-height: 1;
    .pxRem(font-size,24);
    .pxRem(padding,8);
    .pxRem(border-radius,6);
    color: @gray-text;
    .pxRem(margin-right,16);
    font-weight: bold;
  }
  .detail-item.active{
    background: @red-color;
    color: @white-color;
  }
</style>
