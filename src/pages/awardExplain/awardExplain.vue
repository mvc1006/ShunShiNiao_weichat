<template>
    <div class="viewport">
        <div class="header">
            <span class="go-back" @click="goBack"></span>
            <div>抽奖活动</div>
        </div>
        <div class="mainBody">
            <div class="main-content" v-html="content"></div>
        </div>
        <div class="apply" v-if="is_apply==0" @click="apply">立即参加</div>
        <div class="apply" v-if="is_apply==1" @click="apply">查看报名详情</div>
    </div>
</template>
<script>
    export default {
        name:'app',
        data(){
            return {
                is_apply: '', // 是否申请过
                content: '', // 详细描述
            }
        },
        computed: {
            
        },
        mounted(){
           this.bigLotteryInfo(); 
        },
        methods:{
            goBack(){
                window.history.back();
            },
            // 申请报名
            apply(){
                location.href = './awardApply.html?is_apply=' + this.is_apply;
            },
            // 活动说明
            bigLotteryInfo(){
                this.dataService.bigLotteryInfo({}).then((resp)=>{
                    this.dataService.handleResponse({
                        data: resp,
                        callback: (data)=>{
                            this.is_apply = data.is_apply;
                            let hintContent = data.content.replace(/&lt;/g,"<");
                            hintContent = hintContent.replace(/&gt;/g,">");
                            hintContent = hintContent.replace(/&quot;/g,"'");
                            hintContent = hintContent.replace(/&amp;nbsp;/g," ");
                            hintContent = hintContent.replace(/white-space: nowrap;/g,"");
                            this.content = hintContent;
                        },
                    })
                })
            },
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
        color: @gray-text;
        .pxRem(font-size,24);
        .pxRem(padding-top,96);
        .pxRem(padding-bottom,96);
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
        .borderBottom(1);
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
    // 主体内容
    .mainBody{
        .pxRem(padding-left,20);
        .pxRem(padding-right,20);
        .pxRem(padding-top,30);
        .pxRem(padding-bottom,30);
    }
    .main-title{
        .pxRem(padding-top,24);
        .pxRem(line-height,60);
        .pxRem(font-size,28);
        color: @yellow-text;
    }
    .main-content{
        .pxRem(line-height,40);
        .pxRem(font-size,24);
    }
    // 申请报名
    .apply{
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        .pxRem(line-height,96);
        .pxRem(font-size,28);
        text-align: center;
        color: @white-color;
        background: #FF9629 !important;
    }
</style>

