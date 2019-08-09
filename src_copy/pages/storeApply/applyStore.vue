<template>
  <div class="viewport">
    <div class="header">
      <span class="go-back" @click="goBack" v-if="process!='apply_success'"></span>
      <div v-if="process=='apply_store'">我的店铺</div>
      <div v-if="process=='apply_type'">申请店主</div>
      <div v-if="process=='store_data'">{{isLocal?'本地店主':'源头店铺'}}</div>
      <div v-if="process=='apply_success'">申请成功</div>
    </div>
    <!-- 申请店主 -->
    <div class="apply-store" v-if="process=='apply_store'">
      <img class="no_shopkeeper" src="../../assets/no_shopkeeper.png" alt="">
      <div>您还不是店主哦~</div>
      <div class="apply btn" @click="applyStore">申请开店</div>
    </div>
    <!-- 申请类型 -->
    <div class="apply-type" v-if="process=='apply_type'">
      <div class="apply-type-title">
        <span>请选择店铺类型</span>
        <img src="../../assets/apply_type_arrows.png" alt="">
      </div>
      <div class="apply-type-btn">
        <div class="btn" @click="storeData(true)">本地店铺</div>
        <div class="btn" @click="storeData(false)">源头店铺</div>
      </div>
    </div>
    <!-- 源头店铺 本地店铺 -->
    <div class="store-data" v-if="process=='store_data'">
      <div class="apply-data">
        <div class="apply-item">
          <img class="apply_star" src="../../assets/apply_star.png" alt="">
          <img class="apply-img" src="../../assets/shopkeeper_img.png" alt="">
          <input type="text" placeholder="姓名" v-model="username">
        </div>
        <div class="apply-item">
          <img class="apply_star" src="../../assets/apply_star.png" alt="">
          <img class="apply-img" src="../../assets/shopkeeper_tel.png" alt="">
          <input type="number" placeholder="联系电话" v-model="usertel">
        </div>
        <div class="apply-item">
          <img class="apply_star" src="../../assets/apply_star.png" alt="">
          <img class="apply-img" src="../../assets/company_name.png" alt="">
          <input type="text" placeholder="公司名称" v-model="shopname">
        </div>
        <div class="apply-item" v-if="isLocal">
          <img class="apply_star" src="../../assets/apply_star.png" alt="">
          <img class="apply-img" src="../../assets/detailed_stie.png" alt="">
          <input type="text" placeholder="详细地址" v-model="shopaddr">
        </div>
      </div>
      <div class="apply btn" @click="submit">提交申请</div>
    </div>
    <!-- 申请成功 -->
    <div class="apply-success" v-if="process=='apply_success'">
      <img class="apply-success-img" src="../../assets/apply_success.png" alt="">
      <div class="apply-success-content">您提交的申请已经火速到到达我们手中，请耐心等待吧~</div>
      <div class="apply" @click="backHome">返回首页</div>
    </div>
    <popUp v-if="isPopUp" :type="popupType" :time="popupTime" :content="popupContent"></popUp>
  </div>
</template>
<script>
  import common from '@/js/common';
  import popUp from '@/components/popUp.vue'
  export default {
      name:'index',
      data(){
          return {
            isPopUp: false, // 是否显示提示文字
            popupType: 1, // 弹窗显示类型
            popupTime: 3000, // 弹窗显示时间
            popupContent: "",// 弹窗显示文字
            process: '', // 开店流程
            isLocal: false,// 是否为本地店铺
            username:'', // 姓名
            usertel: '', // 联系方式
            shopname: '', // 店铺名称
            shoptype: '', // 店铺类型
            shopaddr: '', // 店铺地址
          }
      },
      mounted(){
        var that = this;
        var process = common.getUrlParam("process");
        this.process = process?process : "apply_store";
        this.isLocal = common.getUrlParam("isLocal")=='true'?true:false;
        // 关闭提示框
        this.$eventBus.$on("closePopup",function(){
          that.isPopUp = false;
        });
      },
      methods:{
        // 返回
        goBack(){
          history.back(-1);
        },
        // 申请开店
        applyStore(){
          window.location.href = './applyStore.html?process=apply_type';
        },
        // 填写开店信息
        storeData(Boole){
          window.location.href = './storeData.html?process=store_data&&isLocal=' + Boole;
        },
        // 提交申请
        submit(){
          console.log(this.isLocal)
          if(!this.username||!this.usertel||!this.shopname||(this.isLocal&&!this.shopaddr)){
            this.isPopUp = true;
            this.popupContent = '请填写必要信息';
            return false;
          }
          if(!(/^1\d{10}$/.test(this.usertel))){
            this.isPopUp = true;
            this.popupContent = '请输入正确手机号';
            return false;
          }
          var that = this;
          this.dataService.shopApply({
            username: this.username, // 姓名
            usertel: this.usertel, // 联系方式
            shopname: this.shopname, // 店铺名称
            shoptype: this.isLocal?2:1, // 店铺类型
            shopaddr: this.shopaddr, // 店铺地址
          }).then(function(resp){
            if(resp.data.code == 1000){
              that.isPopUp = true;
              that.popupContent = '提交成功';
              setTimeout(function(){
                window.location.href = './applySuccess.html?process=apply_success';
              },that.popupTime)
              return false;
            }
          });
          //
        },
        // 返回首页
        backHome(){
          window.location.href = './index.html';
        },
      },
      components:{
        popUp
      }
  }
</script>
<style lang="less">
  @import "applyStore.less";
</style>
