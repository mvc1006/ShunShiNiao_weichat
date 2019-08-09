<template>
    <div class="viewport">
        <!-- 头部 -->
        <div class="header">
            <span class="go-back" @click="goBack"></span>
            <div>招聘岗位</div>
        </div>
        <!-- 报名内容 -->
        <div class="applyList">
            <div class="applyItem" v-for="(station,index) in stationList" :key="index">
                <div class="applyName">
                    <img :src="station.logo" alt="">
                    <div class="investment-area">
                        <div class="investment-name">{{station.name}}</div>
                        <div class="investment-content">{{station.profile}}</div>
                    </div>
                </div>
                <div class="applyContent" @click='lookPostDetails(station.id)'>查看详情</div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name:'app',
        data(){
            return {
                stationList: [],
            }
        },
        computed: {
            
        },
        mounted(){
            this.request();
        },
        methods:{
            // 返回上一页
            goBack(){
                window.history.back();
            },
            // 请求岗位数据
            request(){
                this.dataService.jobList({
                    hire_business_id: this.hire_business_id,
                }).then((resp) => {
                    this.dataService.handleResponse({
                        data: resp,
                        callback: (data)=>{
                            this.stationList = data;
                        },
                    })
                })
            },
            // 查看岗位详情
            lookPostDetails(num){
                location.href = './circleCollaborate.html?postDetails=' + num;
            }
        },
        components:{}
    }
</script>
<style lang="less">
    @import url('../../less/header.less');
    *{
        box-sizing: border-box;
    }
    body{
        background: @background-color;
    }
    .viewport{
        max-width: 720px;
        margin: 0 auto;
        background-size: 100%;
        height: 100%;
        color: @gray-text;
        .pxRem(font-size,24);
        .pxRem(padding-top,96);
        >div{
            background: @white-color;
        }
    }
    /* 头部 */
    .header{
        position: fixed;
        width: 100%;
        left: 0;
        top: 0;
        .pxRem(line-height,56);
        .pxRem(font-size,28);
        .pxRem(padding,20);
        .flex();
        .alignItems();
        .justifyContent(space-between);
        background: @white-color;
        z-index: 99999;
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
    // 招聘类型
    .applyList{
        .pxRem(margin-top,16);
    }
    .applyItem{
        .flex();
        .justifyContent(space-between);
        .alignItems();
        .pxRem(padding-left,16);
        .pxRem(padding-right,16);
        .pxRem(padding-top,20);
        .pxRem(padding-bottom,20);
        .borderBottom(1);
    }
    .applyName{
        .flex();
        .alignItems();
        overflow: hidden;
        >img{
            .pxRem(width,88);
            .pxRem(height,88);
        }
    }
    .investment-area{
        .pxRem(margin-left,20);
        overflow: hidden;
    }
    .investment-name{
        .pxRem(font-size,28);
    }
    .investment-content{
        color: @gray-light-text;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    .applyContent{
        .flexShrink(0);
        .pxRem(padding-left,16);
        .pxRem(padding-right,16);
        .pxRem(line-height,48);
        .pxRem(border-radius,30);
        .pxRem(font-size,20);
        .border(1,@red-color);
        color: @red-color;
    }
</style>

