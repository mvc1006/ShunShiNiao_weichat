<template>
<div class="container">
    <scroll
    v-if="list.length>0"
    ref="scroll"
    :isEnd="isEnd"
    :upBack="upBack"
    :downBack="downBack">
        <banner class="banner" :banner_list="bannerList" v-if="bannerList.length>0"></banner>
        <div class="product-cont">
            <h2>最新活动</h2>
            <ul class="city-list">
                <li class="city-item" v-for="(item,index) in list" :key="index" @click="openDetails(item)">
                    <img :src="item.act_pic" alt="">
                    <p class="title">{{item.name}}</p>
                    <p class="price-num">
                        <span class="price">￥{{item.price}}</span>
                        <span class="num">已抢{{item.sale_num}}件</span>
                    </p>
                </li>
                <li class="city-item" v-if="list.length<=1">
                    <img src="../../assets/city-more.jpg" alt="">
                    <p class="title" style="font-size:16px">更多城市联盟活动，敬请期待中~~~</p>
                </li>
            </ul>
        </div>
    </scroll>
    <div class="loading" v-if="!canLoading"></div>
    <no-data v-else-if="list.length<=0"></no-data>
    <city-btn-group :isIndex="true"></city-btn-group>
</div>
</template>
<script>
import scroll from '@/components/scroll';
import banner from '@/components/banner';
import noData from '@/components/myFav/personalNoData.vue'
import cityBtnGroup from '@/components/cityBtnGroup'
export default {
    name:'city-concat',
    data(){
        return {
            isEnd:false,
            page:1,
            list:[],
            bannerList:[],
            canLoading:false
        }
    },
    created(){
        this.getList();
        this.share();
    },
    mounted(){
        this.$eventBus.$on("scrollStart",() => {
            let group = document.getElementsByClassName('left-btn-group')[0];
            group.style.right = - group.clientWidth + 'px'
            // console.log(.clientWidth);
        });
        this.$eventBus.$on("scrollEnd",() => {
            let group = document.getElementsByClassName('left-btn-group')[0];
            group.style.right = 0
        });
    },
    computed:{
        pid:function(){
            return this.common.getUrlParam('pid') || '';
        }
    },
    methods:{
        getList(){
            this.canLoading = false;
            this.dataService.getCityConcatList({
                page:this.page
            }).then(resp=>{
                this.dataService.handleResponse({
                    data:resp,
                    callback:(data)=>{
                        if(this.page == 1){
                            this.bannerList = data.banner_list;
                        }
                        if(data.data.length>0){
                            this.list = this.list.concat(data.data);
                        }else{
                            this.isEnd = true;
                        }
                        this.$nextTick(()=> {
                            try {
                                this.$refs.scroll.scroll.refresh()
                            } catch (error) {
                                
                            }
                        });
                        this.canLoading = true;
                    }
                })
            })
        },
        openDetails(data){
            location.href = './cityConcatDetails.html?act_id='+data.act_id + '&pid='+this.pid
        },
        upBack(){
            if(this.canLoading){
                this.page ++;
                this.getList();
            }
        },
        downBack(){
            if(this.canLoading){
                this.page = 1;
                this.list = [];
                this.isEnd = false;
                this.getList();
            }
        },
        share(){
            let title = '顺势鸟城市联盟';
            let desc = '我报名了济南免单霸王卡活动，快来和我一起参与吧！（限量100名）';
            let imgUrl = location.origin + '/static/img/storeLogo.png';
            this.common.shareFun(title,desc,imgUrl);
        }
    },
    components:{
        scroll,
        noData,
        banner,
        cityBtnGroup
    }
}
</script>
<style lang="less">
    @import url('../../less/common.less');
    body{
        background: @background-color;
    }
    .cont-top-banner{
        .flexGrow(0);
    }
    .product-cont{
        .pxRem(padding,25);
        h2{
            .pxRem(font-size,28);
            .pxRem(padding-left,20);
            .pxRem(margin-bottom,24);
            .borderLeft(6,@red-color);
            color: @red-color;
        }
    }
    .city-list{
        .flex();
        // .alignItems();
        .flexWrap(wrap);
        .justifyContent(space-between);
    }
    .city-item{
        .pxRem(width,320);
        .pxRem(margin-bottom,30);
        background: @white-color;
        .borderRadius(8);
        >img{
            width:100%;
            .borderRadius(8);
            .pxRem(height,300);
        }
        .title{
            color:@gray-text;
            .pxRem(line-height,50);
            .pxRem(padding-left,20);
            .pxRem(padding-right,20);
        }
        .price-num{
            .flex();
            .justifyContent(space-between);
            .pxRem(line-height,50);
            .pxRem(padding-left,20);
            .pxRem(padding-right,20);
        }
        .price{
            .pxRem(font-size,24);
            color:@red-color;
            .flexGrow(1);
        }
        .num{
            .flexGrow(0);
            .flexShrink(0);
            .pxRem(font-size,24);
            color:@gray-light-text;
        }
    }
    .left-btn-group{
        transition: right 500ms;
    }
</style>

