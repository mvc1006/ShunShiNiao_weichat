<template>
<div class="container">
    <div class="header-top">
        <div class="back" @click="goBack">
            <div class="go-back"></div>
        </div>
        <div class="title">绑定的我的提现微信</div>
    </div>
    <div class="tips-text">* 为确保资金安全,绑定的提现微信需已完成实名认证</div>
    <div class="bind-write">
        <ul class="info-list">
            <li class="info-item">
                <span class="write-text">
                    <img class="wechat-photo " :src="bank.avatar" alt="">
                </span>
                <span class="wechat-name">{{bank.nickname}}</span>
            </li>
            <li class="info-item">
                <span class="write-text">姓名</span>
                <span class="img-input">{{bank.account_name}}</span>
            </li>
            <li class="info-item">
                <span class="write-text">手机号</span>
                <span class="img-input">{{bank.account_mobile}}</span>
            </li>
        </ul>
        <div class="change-bank sure-btn" @click="goAddBank">更换提现的微信号</div>
    </div>
</div>
</template>
<script>
export default {
    name:'app',
    data(){
        return {
            bank:{}
        }
    },
    methods:{
        goBack(){
            location.href = './shopIncome.html';
        },
        getData(){
            if(this.isTrading){
                this.dataService.areaerBankAccountInfo({
                    area_id: localStorage.getItem("area_id"),
                    bank_type:1
                }).then(resp=>{
                    this.dataService.handleResponse({
                        data:resp,
                        callback:(data)=>{
                            this.bank = data;
                        }
                    })
                })
                return false
            }
            this.dataService.getMyBindBank({
                bank_type:1
            }).then(resp=>{
                this.dataService.handleResponse({
                    data:resp,
                    callback:(data)=>{
                        this.bank = data;
                    }
                })
            })
        },
        goAddBank(){
            location.href = './shopBindWechat.html';
        }
    },
    mounted(){
        this.common.goBack(this.goBack);
    },
    created(){
        this.getData();
    },
    computed: {
        isTrading(){
          return localStorage.getItem('isTrading')=="true"?true:false;
        }
    },

}
</script>

<style lang="less">
@import url('../../less/header.less');
body{
    background: @white-color;
}
.tips-text{
    .pxRem(padding-left,30);
    .pxRem(padding-right,30);
    .pxRem(line-height,80);
    .pxRem(font-size,24);
    .flexGrow(0);
    .flexShrink(0);
    color: @red-color;
}
.bind-write{
    .pxRem(padding-left,100);
    .pxRem(padding-right,100);
    .pxRem(padding-top,50);
    .pxRem(padding-bottom,50);
    background: @white-color;
}
.info-item{
    .flex();
    .alignItems();
    .pxRem(padding-top,30);
    .pxRem(padding-bottom,30);
    .borderBottom(2);
    .img{
        .flexGrow(0);
        .flexShrink(0);
        .pxRem(margin-right,10);
    }
    .img-input{
        .flexGrow(1);
        .pxRem(height,40);
        input{
            border:0;
            width: 100%;
            color:@gray-text;
            .pxRem(padding-left,10);
            .pxRem(padding-right,10);
            .pxRem(line-height,40);
        }
    }
}
.write-text{
    .pxRem(font-size,26);
    color: @gray-text;
   .pxRem( min-width,130)
}
.wechat-photo{
    .pxRem(width,66);
    .pxRem(height,66);
    .borderRadius(33);
}
.sure-btn{
    .pxRem(margin-left,60);
    .pxRem(margin-right,60);
    .pxRem(margin-top,130);
    background: @red-color;
    color: @white-color;
    text-align: center;
    .pxRem(font-size,24);
    .pxRem(line-height,80);
    .borderRadius(10);
    &.disabled{
        background: rgba(@red-color, 0.3)
    }
}
::-webkit-input-placeholder,
:-moz-placeholder ,
::-moz-placeholder,
:-ms-input-placeholder {
   color:  @gray-text
}
</style>
