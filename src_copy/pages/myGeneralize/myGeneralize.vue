<template>
  <div class="viewport">
    <!-- 头部返回 -->
    <div class="header">
      <span class="go-back" @click="goBack"></span>
      <div>推广二维码</div>
    </div>
    <!-- 推广图片 -->
    <div class="generalize-img">
      <img :src="qimg" alt="">
    </div>
  </div>
</template>
<script>
  export default {
      name:'myTeam',
      data(){
          return {
            qimg: '',
          }
      },
      mounted(){
        this.request();
      },
      methods:{
        // 请求后台
        request(){
          var that = this;
          this.dataService.userTicket().then(function(resp){
            that.dataService.handleResponse({
              data: resp,
              callback: function(data){
                that.qimg = data.qimg;
              }
            })
          })
        },
        // 返回上一页
        goBack(){
          history.back(-1);
        },
      },
      components:{}
  }
</script>
<style lang="less">
  @import "myGeneralize.less";
</style>
