<template>
    <div class="container">
        <!-- 新手指引 -->
        <!-- <new-guidelines :list="activityList" :isClassfiy='true'></new-guidelines> -->
        <!-- 商品组 -->
        <go-top></go-top>
        <!-- 商品组弹窗 -->
        <!-- <shopGroup></shopGroup> -->
        <!-- 规格弹窗 -->
        <specificationPopUp v-if="commonData.isSpe" :isMainShop="isMain"></specificationPopUp>
        <!-- 页面弹窗提示 -->
        <popUp v-if="commonData.isPopUp" :type="commonData.popupType" :time="commonData.popupTime" :content="commonData.popupContent" :isMainShop="isMain"></popUp>
        <!-- 主内容区域 -->
        <div class="cont-top">
            <div class="header">
                <div class="header-logo">
                    <img src="../../assets/logo.png" alt="">
                </div>
                <div class="search-box">
                    <img src="../../assets/search.png" alt="">
                    <input type="search" @click="inputFocus" placeholder="请输入要搜索的内容">
                </div>
                <div class="place-box" @click="changeCity">
                    <img src="../../assets/serve_unselected.png" alt="">
                    <p>
                        {{getCity.city_name.substr(0,2)}}
                        <img src="../../assets/bottomArrows.png"/>
                    </p>
                </div>
            </div>
            <!-- <ul class="tab-list">
                <router-link class="tab-item" to="/main" tag="li">主商品</router-link>
                <router-link class="tab-item" to="goods" tag="li">赠品</router-link>
            </ul> -->
            <router-view></router-view>
        </div>
        <popUp 
        v-if="isChange" 
        :type="2" 
        :content="changeCont"
        @popupconfirm="popupconfirm"
        @popupcancel="popupcancel"></popUp>
        <!-- 底部tabBer -->
        <bottom :num="number" class="cont-bottom"></bottom>
    </div>
</template>
<script>
import {mapGetters} from 'vuex';
import localStorageCorrelation from '@/js/localStorageCorrelation'
import bottom from '@/components/bottom';
import specificationPopUp from '../../components/specificationPopUp.vue';
// import shopGroup from "@/components/shopGroups.vue";
import popUp from '@/components/popUp';
import goTop from '@/components/goTop';
import newGuidelines from '@/components/newGuidelines';
import history from '@/js/history'
export default {
    name:'app',
    data(){
        return {
            number:1,
            isMain:true,
            classifyShow:false,
            isFirst:false,
            // goTopBtn:false
            isSelectShop: false,
            activityList: [],
            isClassfiy: true, // 是否有分类
            isChange:false,
            changeCont:''
        }
    },
    computed:{
        ...mapGetters(['getCity']),
        commonData(){
          return this.$store.state.commonData;
        }
    },
    mounted(){
        localStorageCorrelation.getLocalStorage(this);
        this.eventBusFun();
        this.isSHowChangeCity();
    },
    methods:{
        isSHowChangeCity(){
            const isFirst = sessionStorage.getItem('localFirst');
            const addrSession = sessionStorage.getItem('user-addr');
            if(addrSession){
                let data = JSON.parse(addrSession);
                if(!isFirst && !data.city_name.includes('济南')){
                    this.isChange = true;
                    this.changeCont = '当前定位城市：' + data.city_name + '。暂未开通本地好服务，是否切换到济南体验？';
                }
            }
        },
        popupconfirm(){
            sessionStorage.setItem('localFirst',1);
            this.changeCity();
            this.isChange = false;
        },
        popupcancel(){
            sessionStorage.setItem('localFirst',1);
            this.isChange = false;
        },
        // 执行evenbus事件
        eventBusFun(){
          var that= this;
          this.$eventBus.$on("goToPresent",function(data){
            that.isSpe = true;
            that.shopData = data;
          });
          this.$eventBus.$on('activityList',(data) => {
              this.activityList  = data.activityList;
          })
          // 关闭提示框
          this.$eventBus.$on("closePopup",function(){
            that.isPopUp = false;
          });
        },
        inputFocus(){
            let tabType = 1;
            if(!this.isMain){
                tabType = 2;
            }
            location.href = './search.html?goods_type=2&tab_type='+tabType;
        },
        changeCity(){
            history.clearData();
            location.href = './changeCity.html';
        }
    },
    created(){
      if(this.$route.path == '/main'){
        this.isMain = true;
      }else if(this.$route.path == '/goods'){
        this.isMain = false;
      }
    },
    watch: {
        $route:function(route) {
            if(route.path == '/main'){
                this.isMain = true;
            }else if(route.path == '/goods'){
                this.isMain = false;
            }
        },
    },
    components:{
        bottom,
        specificationPopUp,
        // shopGroup,
        popUp,
        goTop,
        newGuidelines
    }
}
</script>
<style lang="less">
    @import url('../../less/localService.less');
    .header{
        .flex();
        .alignItems();
        .flexShrink(0);
        .pxRem(padding-top,12);
        .pxRem(padding-right,16);
        .pxRem(padding-bottom,12);
        .pxRem(padding-left,16);
        background: @white-color;
        justify-content: space-between;
    }
    .header-logo{
        margin: 0 !important;
        .pxRem(width,64);
        .pxRem(height,64);
        .flexGrow(0);
    }
    .search-box{
        .borderRadius(12);
        background: #F2F1F0;
        .flexGrow(0);
        .flexShrink(0);
        .pxRem(height,72);
        .pxRem(padding-left,32);
        .pxRem(padding-right,12);
        .pxRem(width,546);
        box-sizing: border-box;
        .flex();
        .alignItems();
        img{
            .pxRem(width,24);
            .pxRem(height,24);
            .pxRem(margin-right,16);
            .flexGrow(0);
        }
        input{
            .flexGrow(1);
            .pxRem(line-height, 72);
            color: @gray-light-text;
            .pxRem(font-size,24);
            outline: none;
            border: 0;
            background: none;
        }
        .clear-search{
            .pxRem(min-width,40);
            .pxRem(line-height,40);
            text-align: center;
            .pxRem(font-size,36);
        }
    }

    .place-box{
        .flexShrink(0);
        text-align: center;
        .pxRem(width,60);
        .pxRem(font-size,16);
        img{
            .pxRem(width,32);
            .pxRem(height,32);
        }
        p{
            .pxRem(font-size,16);
            .flex();
            .alignItems(center);
            >img{
                .pxRem(width,16);
                height: auto;
                .pxRem(margin-left,8);
            }
        }
    }
    // .tab-list{
    //     .flexShrink(0);
    //     .flex();
    //     .pxRem(font-size,32);
    //     .pxRem(line-height,62);
    //     .border(1,@red-color);
    //     .pxRem(border-radius,60);
    //     .pxRem(margin,20);
    //     color: @red-color;
    //     background-color: @white-color;
    //     overflow: hidden;
    //     >li{
    //         width: 50%;
    //         text-align: center;
    //         border-bottom: 0;
    //     }
    //     >.active{
    //         border-bottom: none;
    //         background: @red-color;
    //         color: @white-color;
    //     }
    // }
    .tab-list{
        background: @white-color;
        .flex();
        .alignItems();
        .flexShrink(0);
        // .pxRem(margin-top,10);
        // .pxRem(margin-bottom,10);
    }
    .tab-item{
        list-style: none;
        .flexGrow(1);
        .pxRem(line-height,76);
        .pxRem(font-size,28);
        text-align: center;
        color: @gray-text;
        .borderBottom(6);
        width: 50%;
        color: @gray-text;
        &.active{
            .pxRem(font-size,32);
            font-weight: bold;
            color: @red-color;
            .borderBottom(6,@red-color);
        }
    }
    .cont-bottom{
      box-sizing: border-box;
    }
</style>
