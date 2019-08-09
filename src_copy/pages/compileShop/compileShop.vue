<template>
  <div class="viewport">
    <!-- 头部返回 -->
    <div class="header">
      <span class="go-back" @click="goBack"></span>
      <div>编辑商品</div>
      <span class="save" @click="saveShop">保存</span>
    </div>
    <!-- 商品图片 -->
    <div class="shop-img">
      <img :src="gimg" alt="">
    </div>
    <!-- 商品名称 -->
    <div class="shop-name">
      <span>标题</span>
      <span>{{gname}}</span>
      <!--<input type="text" v-model="gname" placeholder="请输入标题">-->
    </div>
    <!-- 商品价格 -->
    <div class="shop-price-data">
      <div class="shop-module-item">
        <span>商品折扣</span><input type="number" v-model="grebate" @input="grebateChange"><span class="price-unit">%</span>
      </div>
      <div class="shop-module-item">
        <span>平台在售价: </span><input type="number" v-model="sprice"><span class="price-unit">元</span>
      </div>
      <div class="shop-module-item">
        <span>市场指导价</span><input type="number" v-model="mprice"><span class="price-unit">元</span>
      </div>
    </div>
    <!-- 库存 -->
    <div class="shop-inventory">
      <div class="shop-module-item">
        <span>库存</span><input type="number" v-model="store">
      </div>
      <div class="shop-module-item" v-if="mainMenu!=0">
        <span>每日库存</span><input type="number" v-model="daystore">
      </div>
    </div>
    <!-- 限购 -->
    <div class="restriction">
      <div class="restriction-title">商品限购（件）</div>
      <div class="restriction-type">
        <div class="restriction-item">
          <span>每人限购 (0为不限购)</span><input type="number" v-model="ebuy">
        </div>
        <div class="restriction-item">
          <span>每人每日限购 (0为不限购)</span><input type="number" v-model="dbuy">
        </div>
        <div class="restriction-item">
          <span>每人每笔限购 (0为不限购)</span><input type="number" v-model="pbuy">
        </div>
      </div>
    </div>
    <!-- 使用时间 -->
    <!--<div class="employ-time">
      <span class="title">产品使用时间</span>
      <span class="time">上午</span>
      <input type="number" v-model="amHour">
      <span>:</span>
      <input type="number" v-model="amMinute">
      <span>~</span>
      <span class="time">下午</span>
      <input type="number" v-model="pmHour">
      <span>:</span>
      <input type="number" v-model="pmMinute">
    </div>-->
    <!-- 底部按钮 -->
    <div class="footer-btn">
      <div class="delete" @click="deleteShop">删除</div>
      <div class="operation" @click="operation">{{typeMenu==0?'下架':'上架'}}</div>
    </div>
    <popUp v-if="isPopUp" :type="popup.type" :content="popup.content" :time="popup.time" :cancel="popup.cancel" :confirm="popup.confirm" @popupconfirm="popupconfirm" @popupcancel="popupcancel"></popUp>
  </div>
</template>
<script>
  import Vue from 'vue';
  import common from "@/js/common";
  import popUp from "@/components/popUp.vue"
  export default {
      name:'index',
      props:['goods_id','typeMenu',"mainMenu"],
      data(){
          return {
            isPopUp: false, // 是否显示弹窗
            isDeleteShop: false, // 是否点击删除商品
            popup: {
              type: 2,
              time: 3000,
              content: '你要删除这个商品吗?',
              cancel: '取消',
              confirm: '确定'
            },// 弹窗相关
            shop_id: '', // 店铺id
            gname: '',// 商品标题
            gimg: '', // 商品图片
            grebate: 100,// 商品折扣
            sprice: '',// 商品销售价
            mprice: '',// 商品销售价
            store: '', // 库存
            daystore: '', // 每日供给库存
            ebuy: '',// 每人限购
            dbuy: '',// 每日限购
            pbuy: '', // 每笔限购
            amHour: '',// 上午小时
            amMinute: '',// 上午分钟
            pmHour: '',// 下午小时
            pmMinute: '',// 下午分钟
          }
      },
      mounted(){
        var that = this;
        this.$eventBus.$on('closePopup',function(){
          that.popupcancel();
        })
      },
      methods:{
        // 初始化请求后台
        request(params){
          var that = this;
          this.dataService.goodsInfo(params).then(function(resp){
            that.dataService.handleResponse({
              data: resp,
              callback: function(data){
                that.gname = data.gname;
                that.gimg = data.gimg;
                that.grebate = data.grebate;
                that.sprice = data.sprice;
                that.mprice = data.mprice;
                that.store = data.store;
                that.ebuy = data.ebuy;
                that.dbuy = data.dbuy;
                that.pbuy = data.pbuy;
              }
            })
          });
        },
        // 折扣修改
        grebateChange(){
          if(this.grebate=='') return false;
          if(this.grebate>100){
            this.grebate = 100
          }else if(this.grebate<=0){
            this.grebate = 1
          }
        },
        // 保存商品
        saveShop(){
          var that = this;
          this.dataService.editGoods({
            shop_id: 5,
            goods_id: this.goods_id,
            is_main: this.mainMenu==0?1:2,
            grebate: this.grebate,
            sprice: this.sprice,
            mprice: this.mprice,
            store: this.store,
            ebuy: this.ebuy,
            dbuy: this.dbuy,
            pbuy: this.pbuy,
            daystore: this.daystore,
            stime: this.amHour + ':' + this.amMinute,
            etime: this.pmHour + ':' + this.pmMinute
          }).then(function(resp){
            if(resp.data.code == '1000'){
              that.isPopUp = true;
              that.$set(that.popup,'type',1);
              that.$set(that.popup,'content',resp.data.msg);
              setTimeout(function(){
                that.$eventBus.$emit("closeDetails",true);
              },that.popup.time+10);
            }
          });
        },
        // 上架下架商品
        operation(){
          this.isDeleteShop = false;
          this.isPopUp = true;
          this.$set(this.popup,'type',2);
          this.$set(this.popup,'content',this.typeMenu==0?'您是否下架该商品？':'您是否上架该商品？');
        },
        operationFun(){
          this.dataService.onsaleGoods({
            shop_id: 5,
            goods_id: this.goods_id,
            is_main: this.mainMenu==0?1:2,
            is_on_sale: this.typeMenu==0?2:1,
          }).then((resp) => {
            if(resp.data.code == '1000'){
              this.isPopUp = true;
              this.$set(this.popup,'type',1);
              this.$set(this.popup,'content',resp.data.msg);
              setTimeout(() => {
                this.$eventBus.$emit("closeDetails",true);
              },this.popup.time);
            }
          });
        },
        // 返回
        goBack(){
          this.$eventBus.$emit("closeDetails",false);
        },
        // 点击删除
        deleteShop(){
          this.isDeleteShop = true;
          this.isPopUp = true;
          this.$set(this.popup,'type',2);
          this.$set(this.popup,'content',"您要删除这个商品吗?");
        },
        deleteShopFun(){
          this.dataService.delGoods({
            shop_id: '1',
            goods_id: this.goods_id,
            is_main: this.typeMenu==0?1:2
          }).then((resp) => {
            if(resp.data.code == '1000'){
              this.isPopUp = true;
              this.$set(this.popup,'type',1);
              this.$set(this.popup,'content','删除成功');
              setTimeout(() => {
                this.$eventBus.$emit("closeDetails",true);
              },this.popup.time);
            }
          });
        },
        // 弹窗确定
        popupconfirm(){
          if(this.isDeleteShop){
            this.deleteShopFun();
          }else{
            this.operationFun();
          }
        },
        // 弹窗取消
        popupcancel(){
          this.isPopUp = false;
        }
      },
      components:{
        popUp
      }
  }
</script>
<style lang="less" scoped>
  @import "compileShop.less";
</style>
