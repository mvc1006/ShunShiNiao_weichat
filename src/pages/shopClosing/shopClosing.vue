<template>
    <div class="container">
        <div class="header-top">
            <div class="back" @click="goBack">
                <div class="go-back"></div>
            </div>
            <div class="title">{{title}}</div>
        </div>
        
        <scroll ref="scroll" :isEnd="isEnd" :upBack="upBack" :downBack="downBack" >
            <ul class="list-cont" v-if="data.length>0">
                <li class="list-item" v-for="(item,index) in data" :key="index">
                    <div class="left-img">
                        <img :src="item.goods_pic" alt="">
                    </div>
                    <div class="center">
                        <p class="name">{{item.user_nickname}}</p>
                        <p class="time">{{item.create_time}}</p>
                    </div>
                    <div class="right-price">
                        ￥{{common.toFixed(item.amount || 0)}}
                    </div>
                </li>
            </ul>
            <no-data v-else></no-data> 
        </scroll>
    </div>
</template>

<script>
import scroll from '@/components/scroll.vue'
import noData from '@/components/incomeDetails/noData.vue'
export default {
    name:'app',
    data(){
        return {
            data:[],
            isEnd:false,
            canLoading:true,
            page:1
        }
    },
    computed:{
        type:function(){
            return this.common.getUrlParam('type');
        },
        title:function(){
            let type = this.common.getUrlParam('type');
            if(type == 0){
                return '交易中';
            }else{
                return '结算中';
            }
        }
    },
    methods:{
        goBack(){
            history.back();
        },
        upBack(){
            if(this.canLoading){
                this.page++ ;
                this.getData(true);
            }
        },
        downBack(){
            if(this.canLoading){
                this.page = 1 ;
                this.isEnd = false;
                this.getData();
            }
        },
        getData(load){
            this.canLoading = false;
            this.dataService.shopClosing({
                page:this.page,
                settle_status:this.type
            }).then(resp=>{
                this.dataService.handleResponse({
                    data:resp,
                    callback:(data)=>{
                        if(load){
                            if(data.length>0){
                                this.data = this.data.concat(data);
                            }else{
                                this.isEnd = true;
                            }
                        }else{
                            this.data = [].concat(data);
                        }
                        this.$nextTick(()=>{
                            this.$refs.scroll.scroll.refresh();
                        })
                        this.canLoading = true;
                    }
                })
            })
        },
        openDetails(data){
            console.log(data)
        }
    },
    created(){
        this.getData();
    },
    components:{
        scroll,
        noData
    }

}
</script>


<style lang="less">
@import url('../../less/header.less');
body{
    background: @background-color;
}
.list-cont{
    .pxRem(margin-top,20);
    .pxRem(padding-left,30);
    .pxRem(padding-right,30);
    background: @white-color;
}
.list-item{
    .borderBottom(2);
    .pxRem(padding-top,20);
    .pxRem(padding-bottom,20);
    &:last-child{
        border:0;
    }
    .flex();
    .alignItems();
}
.left-img{
    .pxRem(width,100);
    .pxRem(height,100);
    .borderRadius(8);
    overflow: hidden;
    img{
        width:100%;
        height: 100%;
    }
}
.center{
    .flexGrow(1);
    .pxRem(margin-left,20);
    .pxRem(margin-right,20);
    .name{
        color: @gray-text;
    }
    .time{
        color: @gray-light-text;
    }
}
.right-price{
    color: @gray-text;
}

</style>
