<template>
  <div>
    <!-- 头部返回 -->
    <div class="header">
      <span class="go-back" @click="goBack"></span>
      <div>图文详情</div>
    </div>
    <div v-html="textImage"></div>
  </div>
</template>
<script>
  export default {
      name:'index',
      props: ['textImage'],
      data(){
          return {

          }
      },
      mounted(){

      },
      methods:{
        goBack(){
          this.$eventBus.$emit("closeTextImage");
        },
      },
      components:{
      }
  }
</script>
<style lang="less">
  @import "../less/common";
  /* 头部 */
  .header{
  }
  .header>div{
    width: 100%;
    text-align: center;
  }
  .header>.go-back{
    position: absolute;
  .pxRem(left,30);
  .pxRem(width,16);
  }
</style>
