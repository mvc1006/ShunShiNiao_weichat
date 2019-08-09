<template>
    <div class="viewport">
        <div class="header">
            <span class="go-back" @click="goBack"></span>
            <div v-text="title"></div>
        </div>
        <div class="mainBody">
            <!-- <div class="main-title" v-text="title"></div> -->
            <div class="main-content" v-html="content"></div>
        </div>
        <div class="apply" v-if="circleType!=4&&is_apply==0" @click="apply">申请报名</div>
        <div class="apply" v-if="circleType==4&&is_apply==0" @click="lookPost">查看招聘岗位</div>
        <div class="apply" v-if="postDetails&&is_apply==0" @click="apply">立即应聘</div>
        <div class="apply" v-if="is_apply==1" @click="apply">查看报名详情</div>
    </div>
</template>
<script>
    export default {
        name:'app',
        data(){
            return {
                hire_business_id: '', // 合作类型id
                is_apply: '', // 是否申请过
                content: '', // 详细描述
                title: '', // 标题  
            }
        },
        computed: {
            // 招商类型
            circleType(){
                if(this.common.getUrlParam("circleType") == 'null') return false;
                return Number(this.common.getUrlParam("circleType"));
            },
            // 招聘类型
            postDetails(){
                if(this.common.getUrlParam("postDetails") == 'null') return false;
               return Number(this.common.getUrlParam("postDetails")); 
            },
        },
        mounted(){
            if(this.circleType){
                this.circleRequest()
            }else{
                this.postRequest()
            }
        },
        methods:{
            goBack(){
                window.history.back();
            },
            // 申请报名
            apply(){
                let parem = this.circleType?'circleType=' + this.circleType:'postType=' + this.postDetails
                location.href = './circleApply.html?'+parem + '&hire_business_id=' + this.hire_business_id + '&is_apply=' + this.is_apply;
            },
            // 查看岗位
            lookPost(){
                location.href = './invitePost.html?';
            },
            // 请求图文详情(招商)
            circleRequest(){
                this.dataService.bizInfo({
                    hire_type: this.circleType
                }).then((resp)=>{
                    this.dataService.handleResponse({
                        data: resp,
                        callback: (data)=>{
                            let content = '';
                            if(data.content){
                                content = data.content.replace(/&lt;/g,"<");
                                content = content.replace(/&gt;/g,">");
                                content = content.replace(/&quot;/g,"'");
                                content = content.replace(/&amp;nbsp;/g," ");
                            }
                            this.hire_business_id = data.id
                            this.is_apply = data.is_apply;
                            this.content = content;
                            this.title = data.title;
                            document.getElementsByTagName('title')[0].innerHTML = data.title;
                        },
                        callback1001:(data) => {
                            setTimeout(() => {
                                this.goBack();
                            },3000)
                        }
                    })
                })
            },
            // 请求图文详情(招聘)
            postRequest(){
                this.dataService.jobDetail({
                    hire_jobs_id: this.postDetails
                }).then((resp)=>{
                    this.dataService.handleResponse({
                        data: resp,
                        callback: (data)=>{
                            let content = '';
                            if(data.content){
                                content = data.content.replace(/&lt;/g,"<");
                                content = content.replace(/&gt;/g,">");
                                content = content.replace(/&quot;/g,"'");
                                content = content.replace(/&amp;nbsp;/g," ");
                            }
                            this.hire_business_id = data.id
                            this.is_apply = data.is_apply;
                            this.content = content;
                            this.title = data.name;
                            document.getElementsByTagName('title')[0].innerHTML = data.name;
                        },
                        callback1001:(data) => {
                            setTimeout(() => {
                                this.goBack();
                            },3000)
                        }
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
        background: @red-color !important;
    }
</style>

