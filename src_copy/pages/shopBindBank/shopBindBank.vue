<template>
   <div class="container">
        <div class="header-top">
            <div class="back" @click="goBack">
                <div class="go-back"></div>
            </div>
            <div class="title">绑定银行卡</div>
        </div>
        <div class="tips-text">{{tips}}</div>
        <div class="bind-write" v-if="!isBankList">
            <ul class="info-list">
                <li class="info-item">
                    <span class="img ico-must-write"></span>
                    <span class="img ico-name"></span>
                    <span class="img-input">
                        <input type="text" placeholder="姓名" v-model="name">
                    </span>
                </li>
                <li class="info-item">
                    <span class="img ico-must-write"></span>
                    <span class="img ico-bank-num"></span>
                    <span class="img-input">
                        <input type="number" placeholder="请输入银行卡号" v-model="bankNum">
                    </span>
                </li>
                <li class="info-item">
                    <span class="img ico-must-write"></span>
                    <span class="img ico-bank-name"></span>
                    <span class="img-input">
                        <select id="select" placeholder="请选择开户行" :value="bankName" @change="onchange($event.target.value)">
                            <option value="" class="">请选择开户行</option>
                            <option value="工商银行">工商银行</option>
                            <option value="建设银行">建设银行</option>
                            <option value="中国银行">中国银行</option>
                            <option value="农业银行">农业银行</option>
                        </select>
                    </span>
                </li>
                <li class="info-item">
                    <span class="img ico-must-write"></span>
                    <span class="img ico-tel"></span>
                    <span class="img-input">
                        <input type="number" placeholder="请输入银行预留手机号" v-model="tel">
                    </span>
                </li>
            </ul>

            <div class="sure-btn"
            :class="{'disabled':!name || !bankNum || !bankName || !tel}"
            @click="submit">确定</div>
            <div class="bank-support" @click="findBankList">支持银行列表</div>
        </div>
        <div class="bank-list-box" v-else>
            <ul class="bank-list">
                <li class="bank-item">
                    <span class="ico">
                        <img src="../../assets/gs-bank.png" alt="">
                    </span>
                    <span class="name">工商银行</span>
                </li>
                <li class="bank-item">
                    <span class="ico">
                        <img src="../../assets/js-bank.png" alt="">
                    </span>
                    <span class="name">建设银行</span>
                </li>
                <li class="bank-item">
                    <span class="ico">
                        <img src="../../assets/zg-bank.png" alt="">
                    </span>
                    <span class="name">中国银行</span>
                </li>
                <li class="bank-item">
                    <span class="ico">
                        <img src="../../assets/ny-bank.png" alt="">
                    </span>
                    <span class="name">农业银行</span>
                </li>
            </ul>
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
            isBankList:false,
            tips:'需要绑定一张银行卡，才可以提现', //目前支持的银行
            name:'',
            bankNum:'',
            bankName:'',
            tel:'',
            bankList:[]
        }
    },
    mounted(){
        this.common.goBack(this.goBack);
        this.$eventBus.$on("closePopup",()=>{
            this.isPopUp = false;
        })
    },
    methods:{
        goBack(){
            if(this.isBankList){
                this.isBankList = false;
                this.tips = '需要绑定一张银行卡，才可以提现';
            }else{
                location.href = './shopIncome.html';
            }
        },
        findBankList(){
            this.isBankList = true;
            this.tips = '目前支持的银行';
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
            if(!this.bankNum.replace(regSpace,'')){
                this.isPopUp = true;
                this.popContent = '银行卡号不能为空';
                return;
            }
            if(!this.bankName.replace(regSpace,'')){
                this.isPopUp = true;
                this.popContent = '请选则银行';
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
                bank_num:this.bankNum,
                bank_name:this.bankName,
            }
            this.bind(params);
        },
        bind(params){
            if(this.isTrading){
                params.area_id = localStorage.getItem("area_id");
                this.dataService.areaerSetBankAccount(params).then(resp=>{
                    let data = resp.data;
                    if(data.code == 1000){
                        location.href = './shopMyBank.html'
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
                    location.href = './shopMyBank.html'
                }else{
                    this.isPopUp = true;
                    this.popContent = data.msg;
                }
            })
        },
        getBankList(){
            this.dataService.bankList().then(resp=>{
                this.dataService.handleResponse({
                    data:resp,
                    callback:(data)=>{
                        console.log(data)
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
    .pxRem(margin-top,60);
    &:first-child{
        margin-top: 0;
    }
    .img{
        .flexGrow(0);
        .flexShrink(0);
        .pxRem(margin-right,10);
    }
    .img-input{
        .flexGrow(1);
        .pxRem(height,40);
        .borderBottom(2);
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

.bank-support{
    .pxRem(font-size,24);
    color: #4397e0;
    text-align: center;
    .pxRem(line-height,60);
}

.bank-list-box{
    background: @white-color;
}
.bank-item{
    .flex();
    .alignItems();
    .pxRem(padding-left,30);
    .pxRem(padding-right,30);
    .pxRem(padding-top,24);
    .pxRem(padding-bottom,24);
    .borderBottom(2);
    .ico{
        .pxRem(width,40);
        .pxRem(height,40);
        img{
            width:100%;
            height: 100%;
        }
        .pxRem(margin-right,10);
    }
    .name{
        color:@gray-text;
    }
}
select{
    appearance:none;
    background:transparent;
    border:none;
    outline: none;
    width: 100%;
    .pxRem(line-height,40);
    .pxRem(font-size,24);
    cursor: pointer;
}

::-webkit-input-placeholder,
:-moz-placeholder ,
::-moz-placeholder,
:-ms-input-placeholder {
   color:  @gray-text
}
</style>
