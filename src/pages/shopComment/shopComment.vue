<template>
    <div class="viewport">
      <!-- 头部返回 -->
      <div class="header">
        <span class="go-back" @click="goBack"></span>
        <span>评论详情</span>
      </div>
      <!-- 暂无评论 -->
      <div class="no-comment" v-if="comment_list.length == 0">
        <img src="../../assets/present_empty.png" alt="">
        <span>暂无评论</span>
      </div>
      <!-- 评价列表 -->
      <evaluate v-if="comment_list.length>0" :comment_list="comment_list"></evaluate>
    </div>
</template>
<script>
  // 页面中的插件
  import evaluate from "@/components/evaluate";
  import common from "@/js/common";
  export default {
      name:'shopComment',
      data(){
          return {
            isBuyPresent: '',  // 是否为主品
            goods_id: '',  // 商品id
            pages: 1,  // 当期页数
            comment_list: [], // 评论列表
          }
      },
      mounted(){
        this.isBuyPresent = common.getUrlParam("buyPresent");
        this.goods_id = common.getUrlParam("id");
        this.request();
      },
      methods:{
        // 请求后台
        request(){
          var that = this;
          this.dataService.goodsCommentList({
            goods_id: this.goods_id,
            is_main: this.isBuyPresent=='true'?1:2,
            page:this.pages
          }).then(function(resp){
            that.dataService.handleResponse({
              data: resp,
              callback: function(data){
                console.log(data);
                that.comment_list = that.initComminList(data);
              }
            })
          }).catch(function(err){
            console.log(err)
          })
        },
        initComminList(data){
          for(let i=0;i<data.length;i++){
            const one = data[i];
            if(one.content.length>100){
              one.text = one.content.substr(0,100)+'...';
              one.btnText  = '全文';
              this.$set(one,'showAll',true);
            }else{
              one.text = one.content;
              this.$set(one,'showAll',false);
            }
          }
          return data;
        },
        // 返回
        goBack(){
          history.back(-1);
        },
      },
      components:{
        evaluate,
      }
  }
</script>
<style lang="less">
  @import "shopComment.less";
</style>
