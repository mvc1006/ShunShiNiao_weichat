<template>
   <div class="container">
        <div class="header-top">
            <div class="back" @click="goBack">
                <div class="go-back"></div>
            </div>
            <div class="title">绑定我的提现微信</div>
        </div>
        <div class="tips-text">* 为确保资金安全,绑定的提现微信需已完成实名认证</div>
        <div class="bind-write">
            <ul class="info-list">
                <li class="info-item">
                    <span class="img ico-must-write" style="visibility:hidden"></span>
                    <span class="write-text">
                        <img class="wechat-photo " :src="chatInfo.avatar" alt="">
                    </span>
                    <span class="wechat-name">{{chatInfo.nickname}}</span>
                </li>
                <li class="info-item">
                    <span class="img ico-must-write"></span>
                    <span class="write-text">姓名</span>
                    <span class="img-input">
                        <input type="text" placeholder="请输入微信支付实名认证的姓名" v-model="name">
                    </span>
                </li>
                <li class="info-item">
                    <span class="img ico-must-write"></span>
                    <span class="write-text">手机号</span>
                    <span class="img-input">
                        <input type="number" placeholder="请输入提现通知手机号" v-model="tel">
                    </span>
                </li>
            </ul>

            <div class="sure-btn"
            :class="{'disabled':!name || !tel}"
            @click="submit">确定</div>
        </div>
        <popUp v-if="isPopUp" :type="1" :time="'3000'" :content="popContent"></popUp>
    </div>
</template>

<script>
  import popUp from '@/components/popUp.vue'
export default {
    name:'app',
    data(){
        return {
            isPopUp: false,
            popContent:'',
            name:'',
            tel:'',
            chatInfo:{}
        }
    },
    mounted(){
        this.common.goBack(this.goBack);
        this.$eventBus.$on("closePopup",()=>{
            this.isPopUp = false;
        })
        this.getWechatInfo();
    },
    methods:{
        goBack(){
            location.href = './shopIncome.html';
        },
        onchange(val){
            this.bankName = val;
        },
        submit(){
            let regSpace = /\s+/g;
            let regTel = /^1\d{10}$/;
            if(!this.name.replace(regSpace,'')){
                this.isPopUp = true;
                this.popContent = '名字不能为空';
                return;
            }
            if(!this.tel.replace(regSpace,'')){
                this.isPopUp = true;
                this.popContent = '请输入手机号';
                return;
            }
            if(!regTel.test(this.tel)){
                this.isPopUp = true;
                this.popContent = '请输入正确手机号';
                return;
            }
            let params = {
                account_name:this.name,
                account_mobile:this.tel,
                bank_type:1
            }
            this.bind(params);
        },
        bind(params){
            if(this.isTrading){
                params.area_id = localStorage.getItem("area_id");
                this.dataService.areaerSetBankAccount(params).then(resp=>{
                    let data = resp.data;
                    if(data.code == 1000){
                        location.href = './shopMyWechat.html'
                    }else{
                        this.isPopUp = true;
                        this.popContent = data.msg;
                    }
                })
                return false
            }
            this.dataService.bindBank(params).then(resp=>{
                let data = resp.data;
                if(data.code == 1000){
                    location.href = './shopMyWechat.html'
                }else{
                    this.isPopUp = true;
                    this.popContent = data.msg;
                }
            })
        },
        getWechatInfo(){
            this.dataService.getBindWechatInfo().then(resp=>{
                this.dataService.handleResponse({
                    data:resp,
                    callback:(data)=>{
                        this.chatInfo = data;
                    }
                })
            })
        }
    },
    computed: {
        isTrading(){
          return localStorage.getItem('isTrading')=="true"?true:false;
        }
    },
    components:{
      popUp
    }

}
</script>
<style lang="less">
@import url('../../less/header.less');
body{
    background: @background-color;
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
