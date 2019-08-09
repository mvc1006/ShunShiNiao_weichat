<template>
  <div class="viewport">
    <span class="shopGroup"></span>
    <div class='cont-top'>
      <homeModule :is-main-shop="false" :cate-list="cate_list" :is-one-live="isOneLive" :main-menu="mainMenu" :detail-menu="detailMenu" :search_text="search_text"></homeModule>
      <!-- 商品列表 -->
      <shop-list :is-buy-present="false" :is-one-live="isOneLive" :shop-list="goods_list"></shop-list>
      <!-- 底部结算 -->
      <div class="footer"><div class="total">合计: <span>¥238.00</span></div> <div class="submit">提交订单</div></div>
    </div>
  </div>
</template>
<script>
  import shopList from '@/components/shopList';
  import homeModule from "@/components/homeModule"
  export default {
    name:'index',
    data(){
      return {
        isMainShop: true,
        isOneLive: true, // 是否为一排一个
        isBuyPresent: true, // 是否为主品区
        search_text: '家用电器微波炉', // 搜索中显示的文字
        mainMenu: 0,// 选择的是哪个主菜单
        detailMenu: 0, // 选择的是哪个详细菜单
        banner_list:[],  // 轮播图
        cate_list: [],   // 商品分类列表
        goods_list: [],   // 商品列表
        brand_list: [],   // 品牌列表
      }
    },
    mounted(){
      this.request();
      var that = this;
      this.$eventBus.$on("cutStyle", function () {
        that.cutStyle();
      });
      this.$eventBus.$on("cutMainMenu", function (num) {
        that.cutMainMenu(num);
      });
      this.$eventBus.$on("cutDetailMenu", function (num) {
        that.cutDetailMenu(num);
      });
      this.$eventBus.$on("moreClassify", function (num) {
        that.moreClassify(num);
      });
    },
    methods:{
      request(){
        var that = this;
        this.dataService.getProList().then(function(resp){
          that.dataService.handleResponse({
            data: resp,
            callback: function(data){
              that.goods_list = data.goods_list;
              that.banner_list = data.banner_list;//data.banner_list;
              that.cate_list = data.cate_list;
              that.brand_list = data.brand_list;
              that.$nextTick(function () {
                new Swiper(".banner",{
                  autoplay: true,
                  delay: 5000,
                  loop: true,
                  pagination : {
                    el:'.banner-paging',
                  }
                })
              });
            }
          })
        })
      },
      // 跳转搜索页面
      search(){
        window.location.href = './search.html'
      },
      // 点击切换商品列表样式
      cutStyle(){
        this.isOneLive = !this.isOneLive;
      },
      // 点击切换主分类
      cutMainMenu(num){
        this.mainMenu = num;
      },
      // 切换详细分类
      cutDetailMenu(num){
        this.detailMenu = num;
        var id = this.cate_list[num].cate_id;
      },
      // 跳转更对分类
      moreClassify(num){
        console.log("更多分类")
      },
    },
    components:{
      shopList,
      homeModule
    }
  }
</script>
<style lang="less">
  @import "complimentary.less";
</style>
