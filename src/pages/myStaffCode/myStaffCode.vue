<template>
    <div class="container viewport">
        <!-- 头部 -->
        <div class="header">
            <span class="go-back" @click="goBack"></span>
            <div class="header-title">我的粉丝</div>
            <span class="generalize" @click="openPopUp">推广码</span>
        </div>
        <!-- 全部粉丝数量 -->
        <div class="staffAll">全部粉丝 ({{staffNum}})</div>
        <scroll ref="scroll" :isEnd="isEnd" :upBack="upBack" :downBack="downBack">
            <!-- 粉丝列表 -->
            <div class="staff-list">
                <div class="staff-item" v-for="(staff,index) in staffList" :key="index">
                    <div class="staff-img">
                        <img :src="staff.avatar" alt="">
                    </div>
                    <div class="staff-data">
                        <div class="staff-name" v-text="staff.nickname"></div>
                        <div class="staff-time" v-text="staff.time"></div>
                    </div>
                </div>
            </div>
        </scroll>
        <!-- 推广码弹窗 -->
        <div class="popup-generalize" v-if="isGeneralize" @click="closePopUp">
            <div class="popup-gen-area" @click.stop>
                <div v-text="shop_name"></div>
                <div class="popup-img"><img :src="qrcode_pic" alt=""></div>
                <div v-text="worker_name"></div>
            </div>
        </div>
    </div>
</template>
<script>
import scroll from '@/components/scroll.vue';
export default {
    name:'app',
    data(){
        return {
            isGeneralize: false,
            canLoading:false, // 是否可加载  等待api请求完成
            isEnd:false, // 滚动加载是否结束
            page: 1, // 分页加载
            staffList: [], // 粉丝列表
            qrcode_pic: '', // 推广图片
            staffNum: 0, // 粉丝数量
            shop_name: '', // 店铺名称
            worker_name:'' ,// 员工名称
        }
    },
    computed:{
        
    },
    mounted(){
        this.request();
    },
    methods:{
        // 请求数据
        request(){
            this.dataService.workerMembers({
                page: this.page
            }).then(resp=>{
                this.dataService.handleResponse({
                    data:resp,
                    callback:(data)=>{
                        if(data.list.length <= 0){
                            this.isEnd = true;
                        }
                        if(this.page == 1){
                            this.staffList = [];
                        }
                        this.staffList = this.staffList.concat(data.list);
                        this.qrcode_pic = data.qrcode_pic;
                        this.staffNum = data.count;
                        this.shop_name = data.shop_name;
                        this.worker_name = data.worker_name 
                    }
                })
            })
        },
        // 返回
        goBack(){
            window.history.go(-1);
        },
        // 打开弹窗
        openPopUp(){
            this.isGeneralize = true;
        },
        // 关闭弹窗
        closePopUp(){
            this.isGeneralize = false
        },
        // 下拉刷新
        upBack(){
            if(this.canLoading){
                this.page ++;
            }
        },
        // 上拉加载
        downBack(){
            if(this.canLoading){
                this.page = 1;
                this.isEnd = false;
            }
        },
    },
    components:{
        scroll
    }
}
</script>
<style lang="less">
    @import url('../../less/common');
    .viewport{
        max-width: 720px;
        margin: 0 auto;
        .pxRem(font-size,24);
        color: @gray-text;
        background: @background-color;
    }
    // 头部
    .header{
        position: relative;
        .pxRem(font-size,28);
        text-align: center;
        .pxRem(line-height,96);
        .flexShrink(0);
        .flex();
        .alignItems(center);
        .justifyContent(center);
        background: @white-color;
        >.go-back{
            position: absolute;
            .pxRem(left,30);
        }
        >.generalize{
            position: absolute;
            .pxRem(right,16);
            color: @red-color;
        }
    }
    // 全部粉丝
    .staffAll{
        .pxRem(margin-top,20);
        .pxRem(padding-left,20);
        .pxRem(padding-right,20);
        .pxRem(line-height,82);
        .flexShrink(0);
        background: #F1DBE2;
        font-weight: bold;
    }
    // 粉丝列表
    .staff-list{
        background: @white-color;
    }
    .staff-item{
        .pxRem(padding-top,24);
        .pxRem(padding-bottom,24);
        .pxRem(padding-left,20);
        .pxRem(padding-right,20);
        .flex();
        .alignItems(center);
        .borderBottom(1,@border-color);
    }
    .staff-img{
        .pxRem(width,80);
        .pxRem(height,80);
        border-radius: 50%;
        overflow: hidden;
        >img{
            max-width: 100%;
        }
    }
    .staff-data{
        .pxRem(padding-left,22);
        .pxRem(font-size,28);
    }
    .staff-time{
        .pxRem(font-size,22);
        color: @gray-light-text;
    }
    // 推广码弹窗
    .popup-generalize{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, .3);
        .flex();
        .alignItems(center);
        .justifyContent(center);
    }
    .popup-gen-area{
        .pxRem(width,560);
        .pxRem(padding-top,60);
        .pxRem(padding-bottom,60);
        .pxRem(padding-left,100);
        .pxRem(padding-right,100);
        .pxRem(border-radius,8);
        .pxRem(font-size,36);
        text-align: center;
        background: @white-color;
        box-sizing: border-box;
    }
    .popup-img{
        .pxRem(margin-top,48);
        .pxRem(margin-bottom,48);
        >img{
            display: block;
            margin: 0 auto;
        }
    }
</style>

