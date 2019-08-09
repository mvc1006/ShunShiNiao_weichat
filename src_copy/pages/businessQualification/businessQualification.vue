<template>
    <div class="viewport">
      <!-- 头部返回 -->
      <div class="header">
        <span class="go-back" @click="goBack"></span>
        <div>商家资质</div>
      </div>
      <!-- 资质信息 -->
      <div class="aptitude-list">
        <div class="aptitude-item"><span class="store-name">单位名称</span><span class="store-content">{{store_data.company_name}}</span></div>
        <div class="aptitude-item"><span class="store-name">法定代表人</span><span class="store-content">{{store_data.corp_name}}</span></div>
        <div class="aptitude-item"><span class="store-name">许可证号</span><span class="store-content">{{store_data.license_no}}</span></div>
        <div class="aptitude-item"><span class="store-name">经营范围</span><span class="store-content">{{store_data.business_area}}</span></div>
        <div class="aptitude-item"><span class="store-name">有效期</span><span class="store-content">{{store_data.license_end_time}}</span></div>
      </div>
      <!-- 资质图片 -->
      <div class="aptitude-img">
        <div class="aptitude-title">商家从业资质</div>
        <div class="aptitude-img-list">
          <img  v-gallery="'aptitude'" v-for="(item,index) in store_data.license" :key="index" :src="item" alt="">
        </div>
      </div>
    </div>
</template>
<script>
  import common from '@/js/common'
  export default {
      name:'businessQualification',
      data(){
          return {
            store_data: {}
          }
      },
      mounted(){
        var that = this;
        this.dataService.shopInfo({
          goods_type: common.getUrlParam("goods_type"),
          shop_id: common.getUrlParam("store_id"),
        }).then(function(resp){
          that.dataService.handleResponse({
            data: resp,
            callback: function(data){
              that.store_data = data;
            }
          })
        })
      },
      methods:{
        // 返回
        goBack(){
          history.back(-1);
        },
      },
      components:{}
  }
</script>
<style lang="less">
  @import "businessQualification.less";
</style>
