<template>
  <div class="viewport">
    <!-- 头部返回 -->
    <div class="header">
      <span class="go-back" @click="goBack"></span>
      <div>我的团队</div>
    </div>
    <scroll ref="scroll" :upBack="upBack" :downBack="downBack" :isEnd="isEnd" v-if="fansList.length>0">
      <div class="team-area">
        <!-- 粉丝数量 -->
        <div class="fans-num">全部粉丝（{{fansTotal}}人）</div>
        <!-- 团队列表 -->
        <div class="team-list">
          <div class="team-item" v-for="(fansItem, index) in fansList" :key="index">
            <div class="team-head">
              <img :src="fansItem.avatar" alt="">
            </div>
            <div class="team-data">
              <div class="team-name">{{fansItem.nickname}}</div>
              <div class="team-time">{{fansItem.ctime}}</div>
            </div>
          </div>
        </div>
      </div>
    </scroll>
    <div class="noShopList" v-if="fansList.length == 0">
      <img src="../../assets/no_shopkeeper.png" alt="">
      <div>暂无相关团队</div>
    </div>
    <!-- 推广图片 -->
    <div class="generalize-img" v-if="false">
      <img src="../../assets/fav_goods.png" alt="">
    </div>
  </div>
</template>
<script>
  import scroll from '@/components/scroll';
  export default {
      name:'myTeam',
      data(){
          return {
            canLoading:true, // 是否加载完成
            isEnd:false, // 分页加载是否结束
            pages: 1, // 分页加载
            fansTotal: 0,// 粉丝总数
            fansList: [], // 粉丝列表
          }
      },
      mounted(){
        this.request();
      },
      methods:{
        // 返回上一页
        goBack(){
          history.back(-1);
        },
        request(){
          var that = this;
          this.dataService.myMembers({page: this.pages}).then(function(resp) {
            that.dataService.handleResponse({
              data: resp,
              callback: function(data){
                if(data.data.length==0){
                  that.isEnd = true;
                }
                if(that.pages==1){
                  that.fansList = [];
                }
                that.fansTotal = data.total;
                that.fansList = that.fansList.concat(data.data);
              }
            })
          })
        },
        // 上拉刷新
        upBack(){
          if(this.canLoading){
            this.pages ++;
            this.request();
          }
        },
        // 下拉刷新
        downBack(){
          if(this.canLoading){
            this.pages = 1;
            this.isEnd = false;
            this.request();
          }
        }
      },
      components:{
        scroll
      }
  }
</script>
<style lang="less">
  @import "myTeam.less";
</style>
