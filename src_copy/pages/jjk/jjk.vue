<template>
    <div class="container">
        <div class="header-top">
            <div class="back" @click="goBack">
                <div class="go-back"></div>
            </div>
            <div class="title">尖叫卡</div>
            <!-- <div class="store-search" @click="search"></div> -->
        </div>
        <scroll ref="scroll" :upBack="upBack" :downBack="downBack" :isEnd="isEnd">
            <div class="pro-list-cont">
                <div class="pro-list">
                    <pro-item v-for="(item,index) in product" :showShopInfo="true" :key="index" :data="item" :showGive="false" :isMain="true"></pro-item>
                </div>
                <div class="loading" v-if="!canLoading"></div>
                <no-data v-else-if="product.length<=0"></no-data>
            </div>
        </scroll>
    </div>
</template>
<script>
import proItem from '@/components/localService/localProduct.vue';
import scroll from '@/components/scroll';
import history from '@/js/history'
export default {
    name:'jjk',
    data(){
        return {
            isEnd:false,
            canLoading:false,
            page:1,
            product:[],
            addrData:{},
            config:{
                goods_type:2,
                tab_type:1,
                activity_id:3
            }
        }
    },
    mounted(){
        history.init(this);
        this.getList();
        this.share();
    },
    computed:{
      commonData(){
        return this.$store.state.commonData
      }
    },
    methods:{
        selectWay(){
            let storage = history.getData();
            if(storage){
                this.historyBack(storage)
            }else{
                this.getProList();
            }
        },
        historyBack({items,scrollY,maxScroll}){
            this.addrData = items.addrData;
            this.product = items.product;
            this.config = items.config;
            
            this.canLoading = true;
            this.isEnd = items.isEnd;
            this.page = items.page;
            
            this.$nextTick(()=>{
                let time = setInterval(() => {
                    let scroll = this.$refs.scroll.scroll;
                    if(scroll){
                        scroll.refresh();
                        scroll.maxScrollY = maxScroll;
                        scroll.scrollTo(0,scrollY,0);
                        clearInterval(time);
                    }
                }, 100);
            })
        },
        share(){
            let url = location.origin;
          let title = '顺势鸟尖叫卡',
              des = '全民尖叫日，1元=100元（本地生活）',
              imgUrl = url+'/static/img/jjk.png';
          this.common.shareFun(title,des,imgUrl);
        },
        goBack(){
            window.location.href = './localService.html';
        },
        // 跳转搜索
        search(){
            window.location.href = './search.html?tab_type=1&goods_type=' + this.config.goods_type + '&isEmptyShopGroup=true&active_id=3';
        },
        async getAddr(){
            return this.dataService.getUserNowAddr();
        },
        async getList(){
            const addrSession = sessionStorage.getItem('user-addr');
            if(addrSession){
                let data = JSON.parse(addrSession);
                this.addrData = data;
                this.selectWay();
            }else{
                let addr = await this.getAddr();
                let data = addr.data;
                if(data.code == 1000){
                    sessionStorage.setItem('user-addr',JSON.stringify(data.data));
                    this.addrData = data.data;
                    this.selectWay();
                }
            }
        },
        getProList(append){
            history.clearData();
            this.canLoading = false;
            this.config.page = this.page;
            this.config.lng = this.addrData.lng;
            this.config.lat = this.addrData.lat;
            this.config.city_id = this.addrData.city_id;
            this.dataService.getProList(this.config).then((resp)=>{
                this.dataService.handleResponse({
                    data:resp,
                    callback:(data)=>{
                        if(append){
                            if(data.goods_list.length>0){
                                this.product = this.product.concat(data.goods_list)
                            }else{
                                this.isEnd = true;
                            }
                        }else{
                            this.classify = data.cate_list;
                            this.bannerList = data.banner_list;
                            this.product = data.goods_list;
                        }
                        this.$nextTick(()=>{
                            this.$refs.scroll.scroll.refresh();
                        })
                        this.canLoading = true;
                    }
                })
            })
        },
        upBack(){
            if(this.canLoading){
                this.page ++;
                this.getProList(true);
            }
        },
        downBack(){
            if(this.canLoading){
                this.page = 1;
                this.isEnd = false;
                this.getProList();
            }
        }
    },
    components:{
        proItem,
        scroll,
    }
}
</script>
<style lang="less">
@import url('../../less/header.less');
@import url('../../less/localService.less');
.pro-top{
    margin-bottom:0;
}
</style>
