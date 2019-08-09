<template>
<div class="container">
    <div class="header-top">
        <div class="back" @click="goBack">
            <div class="go-back"></div>
        </div>
        <div class="title">绑定银行卡</div>
    </div>
    <div class="my-bank">
        <div class="bank">
            <div class="bank-left">
                <img src="../../assets/gs-bank.png" alt="">
            </div>
            <div class="bank-right">
                <span class="user-name">{{bank.account_name}}</span>
                <span class="bank-name">{{bank.bank_name}}</span>
                <span class="bank-num">{{bank.bank_num}}</span>
            </div>
        </div>
        <div class="change-bank sure-btn" @click="goAddBank">更换银行卡</div>
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
                    area_id: localStorage.getItem("area_id")
                }).then(resp=>{
                    this.dataService.handleResponse({
                        data:resp,
                        callback:(data)=>{
                            this.bank = data;
                            console.log(data)
                        }
                    })
                })
                return false
            }
            this.dataService.getMyBindBank().then(resp=>{
                this.dataService.handleResponse({
                    data:resp,
                    callback:(data)=>{
                        this.bank = data;
                        console.log(data)
                    }
                })
            })
        },
        goAddBank(){
            location.href = './shopBindBank.html';
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
.my-bank{
    .pxRem(margin-left,60);
    .pxRem(margin-right,60);
    .pxRem(margin-top,80);
}
.bank{
    .flex();
    background: -webkit-linear-gradient(left,#ff9d32,#fe7a4a);
    .borderRadius(10);
    .pxRem(padding,30);
    .bank-left{
        .pxRem(width,60);
        .pxRem(height,60);
        .pxRem(margin-right,20);
        img{
            width:100%;
            height:100%;
        }
    }
    .bank-right{
        .flexGrow(1);
        .flex(column);
        color:@white-color;
    }
}
.sure-btn{
    .pxRem(margin-top,130);
    background: @red-color;
    color: @white-color;
    text-align: center;
    .pxRem(font-size,24);
    .pxRem(line-height,80);
    .borderRadius(10);
}
</style>
