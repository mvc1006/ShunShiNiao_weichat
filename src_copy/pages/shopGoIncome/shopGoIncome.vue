<template>
    <div class="container">
        <div class="header-top">
            <div class="back" @click="goBack">
                <div class="go-back"></div>
            </div>
            <div class="title">提现</div>
        </div>
        <div class="cont">
            <p class="tips">
                <span class="text">到微信账号</span>
                <span class="wechat-photo">
                    <img :src="data.avatar" alt="">
                </span>
                <span class="bank-name">{{data.wxbank_info}}</span>
            </p>
            <div class="cont-center">
                <p>提现金额</p>
                <p class="write">
                    <span>￥</span>
                    <input class="input" type="number" placeholder="请输入金额" v-model="money">
                </p>
                <p class="all"> 当前零钱余额{{data.balance}}元，<span class="text-color" @click="writeAll">全部提现</span></p>
            </div>
            <div class="sure-btn" @click="sureCome(1)">提现</div>
        </div>
        <!-- <div class="cont">
            <p class="tips">
                <span class="text">到账银行卡</span>
                <span class="bank-name text-color">{{data.bank_info}}</span>
            </p>
            <div class="cont-center">
                <p>提现金额</p>
                <p class="write">
                    <span>￥</span>
                    <input class="input" type="number" placeholder="请输入金额" v-model="money">
                </p>
                <p class="all"> 当前零钱余额{{data.balance}}元，<span class="text-color" @click="writeAll">全部提现</span></p>
            </div>
            <div class="sure-btn" @click="sureCome(0)">提现</div>
        </div> -->
        <div class="psw-pop" @click="closePop" v-show="writePsw" ref="popbg">
            <div class="pop-cont" ref="popcont" :style="{marginTop:top+'px'}" @click.stop="getFocus">
                <div class="pop-title">
                    <span class="close-psw" @click.stop="closePop">×</span>
                    <span class="text">请输入支付密码</span>
                </div>
                <div class="pop-body">
                    <p class="text">提现</p>
                    <p class="money">￥{{money}}</p>
                    <!-- <p class="pop-tips">提现需额外扣除5%的手续费</p> -->
                    <div class="psw-box">
                        <ul class="psw-list">
                            <li class="psw-item"
                            v-for="(item,index) in setShow"
                            :key="index"
                            :class="{'active':item}">{{item && '*'}}</li>
                        </ul>
                    </div>
                </div>
            </div>
            
        </div>
        <popUp :type="1" :time="'3000'" :content="popContent" v-if="isPopup"></popUp>
        <div class="input-box">
            <input type="number" size="6" v-model="setPsw" ref="set" id="set">
        </div>
    </div>
</template>

<script>
  import popUp from '@/components/popUp.vue'
export default {
    name:'app',
    data(){
        return {
            isPopup: false,
            popContent:'',
            data:{},
            writePsw:false,
            money:'',
            setShow:Array(6),
            setPsw:'',
            top:0,
            type:1, //提现方式  0 bank  1 wechat
        }
    },
    methods:{
        goBack(){
            history.back();
        },
        getData(){
            if(this.isTrading){
                this.dataService.areaerFinanceInfo({
                    area_id: localStorage.getItem("area_id")
                }).then(resp=>{
                this.dataService.handleResponse({
                        data:resp,
                        callback:(data)=>{
                            this.data = data;
                        }
                    })
                });
                return false;
            }
            this.dataService.getIncome().then(resp=>{
                this.dataService.handleResponse({
                    data:resp,
                    callback:(data)=>{
                        this.data = data;
                    }
                })
            })
        },
        writeAll(){
            this.money = this.data.balance;
        },
        setChange(value,old){
            let arr = value.split('');
            arr.length = 6;
            this.setShow = [].concat(arr);
            if(value.length>6){
                this.setPsw = old;
                return;
            }
            setTimeout(() => {
                if(value.length >= 6){
                    if(this.isTrading){
                        this.dataService.areaerCashApply({
                            amount:this.money,
                            user_cash_pwd:this.setPsw,
                            area_id: localStorage.getItem('area_id'),
                            bank_type:this.type
                        }).then(resp=>{
                            let data = resp.data;
                            if(data.code == 1000){
                                location.href = './shopComeAlreadyDetailsIng.html?id='+data.data.id
                            }else{
                                this.closePop();
                                this.isPopup = true;
                                this.popContent = data.msg;
                            }
                        })
                        return false;
                    }
                    this.dataService.cashApply({
                        amount:this.money,
                        user_cash_pwd:this.setPsw,
                        bank_type:this.type
                    }).then(resp=>{
                        let data = resp.data;
                        if(data.code == 1000){
                            location.href = './shopComeAlreadyDetailsIng.html?id='+data.data.id
                        }else{
                            this.closePop();
                            this.isPopup = true;
                            this.popContent = data.msg;
                        }
                    })
                }
            }, 500);
        },
        // 点击提现按钮
        sureCome(number){
            if(!this.money || this.money<=0){
                this.isPopup = true;
                this.popContent ="请输入正确的提现金额";
            }else if(this.money>Number(this.data.balance)){
                this.isPopup = true;
                this.popContent ="余额不足";
            }else{
                this.writePsw = true;
                this.type = number;
                this.popShow();
            }
        },
        popShow(){
            this.$nextTick(()=>{
                let bgHeight = this.$refs.popbg.clientHeight;
                let bodyHeight = document.body.clientHeight;
                let popHeight = this.$refs.popcont.clientHeight;
                this.top = (bgHeight-popHeight)/2;
                this.$refs.popbg.style.height = bodyHeight + 'px';
                this.$refs.set.focus();
            })
        },
        closePop(){
            this.writePsw = false;
            this.setPsw = '';
            this.setShow = Array(6);
        },
        getFocus(){
            this.$refs.set.focus();
        }
    },
    created(){
        this.getData();
    },
    computed: {
        isTrading(){
          return localStorage.getItem('isTrading')=="true"?true:false;
        }
    },
    watch:{
        // 设置密码监听
        setPsw(value,old){
            this.setChange(value,old);
        }
    },
    mounted(){
        window.onresize = ()=>{
            this.popShow();
        }
        this.$eventBus.$on('closePopup',()=>{
            this.isPopup = false;
        })
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
.container{
    position: relative;;
    width:100%;
    height: 100%;
}
.cont{
    background:@white-color;
    .pxRem(margin-top,20);
    .pxRem(padding-top,60);
    .pxRem(padding-bottom,60);
    .pxRem(padding-left,90);
    .pxRem(padding-right,90);
}
.text-color{
    color: #4495e4;
}
.tips{
    color: @gray-text;
    .flex();
    .alignItems();
}
.bank-name {
    .pxRem(margin-left,20);
}
.cont-center{
    .pxRem(margin-top,70);
}
.write{
    .pxRem(padding-top,30);
    .pxRem(padding-bottom,30);
    .borderBottom(2);
    .flex();
    .alignItems();
    color:@gray-text;
    font-weight:bold;
    .pxRem(font-size,28);
    .input{
        .flexGrow(1);
        border:0;
        outline: 0;
        .pxRem(padding-left,20);
        .pxRem(padding-right,20);
    }
}
.wechat-photo{
    .pxRem(width,38);
    .pxRem(height,38);
    .pxRem(margin-left,20);
    img{
        .borderRadius(19);
        width: 100%;
    }
}
.all{
    .pxRem(padding-top,16);
    .pxRem(padding-bottom,16);
}
.sure-btn{
    width:100%;
    .pxRem(line-height,70);
    text-align:center;
    .pxRem(font-size,24);
    .pxRem(margin-top,60);
    background: @red-color;
    .borderRadius(8);
    color:@white-color;
}
.psw-list{
    .flex();
    .alignItems();
    .justifyContent(space-between);
}
.psw-item{
    .pxRem(width,54);
    .pxRem(height,54);
    .border(2);
    .borderRadius(54);
    .pxRem(line-height,60);
    text-align: center;
    &.active{
        border-color: @red-color;
        color:@gray-text;
    }
}
.input-box{
    height:0;
    position:relative;
    input{
      position: absolute;
      left:-999em;
      top:0;
    }
}
.psw-pop{
    position: absolute;
    left:0;
    top:0;
    height:100%;
    width:100%;
    background: rgba(@gray-text, 0.3)
}
.pop-cont{
    background:@white-color;
    .pxRem(margin-left,90);
    .pxRem(margin-right,90);
    .borderRadius(10);
}
.pop-title{
    .pxRem(padding-left,35);
    .pxRem(padding-right,35);
    .pxRem(padding-top,20);
    .pxRem(padding-bottom,20);
    .flex();
    .alignItems();
    .borderBottom(2);
    .close-psw{
        .pxRem(width,50);
        .pxRem(height,50);
        text-align: center;
        .pxRem(line-height,50);
        .pxRem(font-size,48);
        color:@gray-light-text;
    }
    .text{
        .flexGrow(1);
        text-align: center;
        .pxRem(font-size,28);
        .pxRem(line-height,50);
    }
}
.pop-body{
    .pxRem(padding-top,20);
    .pxRem(padding-bottom,20);
    .text{
        text-align: center;
        .pxRem(font-size,24);
        .pxRem(margin-bottom,20);
    }
    .money{
        text-align: center;
        .pxRem(font-size,28);
        color: @gray-text;
        .pxRem(margin-bottom,20);
    }
    .pop-tips{
        text-align: center;
        .pxRem(font-size,24);
        color:@gray-light-text;
    }
}
.psw-box{
    .pxRem(padding-top,20);
    .pxRem(padding-bottom,20);
    .pxRem(padding-left,30);
    .pxRem(padding-right,30);
}
</style>
