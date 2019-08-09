<template>
    <div class="container">
        <div class="header-top">
            <div class="back" @click="goBack">
                <div class="go-back"></div>
            </div>
            <div class="title">商家登录</div>
        </div>
        <!-- 登录首页 选择登录方式 -->
        <div class="index-cont" v-if="isIndex">
            <div class="login-index">
                <div class="login">
                    <img class="logo" src="../../assets/logo.png" alt="">
                    <img class="name" src="../../assets/name.png" alt="">
                </div>
                <div class="select-login-way">
                    <p class="tel-login" @click="telLogin">手机号登录</p>
                    <p class="psw-login" @click="pswLogin">账号密码登录</p>
                </div>
                <div class="no-shop" @click="applyShow">
                    <img class="tips" src="../../assets/tips-ico.png" alt="">
                    <span class="tips-text">未开店，点击申请店铺>></span>
                </div>
                <div class="agree">登录即代表同意《顺势鸟服务条款》</div>
            </div>
        </div>
        <!-- 手机号登录 -->
        <div class="login-cont" v-else>
            <div class="tel-login-cont" v-if="isTelLogin">
                <!-- 输入手机号 -->
                <div class="tel-write-cont" v-if="isTelCode">
                    <h2 class="all-black-title">手机号登录</h2>
                    <div class="input-box">
                        <input type="number" ref="tel" v-model="telNumber" class="write-input" placeholder="请填写手机号码">
                        <span class="close-ico close" v-show="showCloseTel" @click="closeTel"></span>
                    </div>
                    <div class="next tel-login" :class="{'disabled':!telCanNext}" @click="telGoNext">下一步</div>
                </div>
                <!-- 验证码 -->
                <div class="tel-write-cont" v-else>
                    <h2 class="all-black-title">验证码已发送至</h2>
                    <p class="tel-time-cont">
                        <span class="tel-num">{{initTel()}}</span>
                        <span class="time" v-if="isSend">({{time}}S)</span>
                        <span class="getAgain" v-else @click="getCodeAgain">重新获取</span>
                    </p>
                    <label for="input-v-code">
                        <ul class="code-list">
                            <li class="code-item" v-for="(code,index) in codeList" :key="index">{{code}}</li>
                        </ul>
                    </label>

                </div>
                <div class="agree">登录即代表同意《顺势鸟服务条款》</div>
            </div>
            <!-- 账号密码登录 -->
            <div class="psw-login-cont" v-else>
                <div class="tel-write-cont">
                    <h2 class="all-black-title">账号密码登录</h2>
                    <div class="input-box">
                        <input type="number" ref="account" v-model="account" class="write-input" placeholder="请输入手机号">
                        <span class="close-ico close" v-show="showClearAccount" @click="closeAccount"></span>
                    </div>
                    <div class="input-box">
                        <input type="password" ref="psw" v-model="psw" class="write-input" placeholder="请输入密码">
                        <span class="close-ico eay-close" :class="{'open':pswIsOpen}"  @click="showPsw"></span>
                    </div>
                    <div class="next tel-login" :class="{'disabled':!loginCan}" @click="pswGoLogin">登录</div>
                </div>
                <div class="agree">登录即代表同意《顺势鸟服务条款》</div>
            </div>
        </div>
      <div class="hidden-input">
        <input type="number" id="input-v-code" v-model="code">
      </div>
      <popUp v-if="isPopup" :type="1" :content="popContent"></popUp>
    </div>
</template>
<script>
  import popUp from '@/components/popUp.vue'
export default {
    name:'app',
    data(){
        return {
            isPopup: false,
            popContent: '',
            isIndex:true, // 首页
            isTelLogin:true, // 是手机号登录
            isTelCode:true, // 输入手机号
            telCanNext:false, // 下一步是否可点击
            telNumber:'', // 手机号
            isSend:true, // 是发送中 还是 重新发送验证码
            setTime:null, //定时器
            time:60, //定时器的时间
            code:'', //
            codeList:Array(6),
            showCloseTel:false,
            // 账号密码
            account:'', // 账号
            psw:'', // 密码
            showClearAccount:false, // 显示清除账号按钮
            pswIsOpen:false, // 密码显示隐藏
            loginCan:false, // 登录按钮是否可点
        }
    },
    mounted(){
        this.common.goBack(this.goBack);
        this.$eventBus.$on("closePopup",()=>{
          this.isPopup = false;
        })
    },
    methods:{
        goBack(){
            if(this.isIndex){
                location.href = './personCenter.html';
            }else{
                this.isIndex = true;
            }
        },
        // 点击手机登录
        telLogin(){
            this.isIndex = false;
            this.isTelLogin = true;
            this.isTelCode = true;
        },
        //手机登录下一步
        telGoNext(){
            if(this.telCanNext){
                this.getMobileCode();
            }
        },
        initTel(){
            let reg = /^(\d{3})(\d{4})(\d{4})$/;
            let num = this.telNumber;
            num = num.replace(reg,(m,$1,$2,$3)=>{
                return $1 + ' ' + $2 + ' ' + $3;
            })
            return num;
        },
        //点击账号密码登录
        pswLogin(){
            this.isIndex = false;
            this.isTelLogin = false;
        },
        getMobileCode(){
            this.dataService.getMobileCode({
                mobile:this.telNumber
            }).then(resp=>{
                if(resp.data.code == 1001){
                    this.isPopup = true;
                    this.popContent = resp.data.msg;
                }else{
                    this.isTelCode = false;
                    this.initTel();
                    this.isSend = true;
                    this.timeCount();
                }
            })
        },
        timeCount(){
            this.setTime = setInterval(() => {
                if(this.time>0){
                    this.time --
                }else{
                    this.time = 60;
                    this.isSend = false;
                    clearInterval(this.setTime)
                }
            }, 1000);
        },
        getCodeAgain(){
            this.getMobileCode();
        },
        closeTel(){
            this.telNumber = '';
            this.telCanNext = false;
            this.$refs.tel.focus();
        },
        closeAccount(){
            this.account = '';
            this.psw = '';
            this.loginCan = false;
        },
        showPsw(){
            this.pswIsOpen = !this.pswIsOpen;
            if(this.pswIsOpen){
                this.$refs.psw.type= 'text';
            }else{
                this.$refs.psw.type= 'password';
            }
        },
        pswGoLogin(){
            this.loginResponse({
                mobile:this.account,
                pwd:this.psw
            })
        },
        loginResponse(params){
            this.dataService.login(params).then(resp=>{
                let data = resp.data;
                if(data.code == 1000){
                    localStorage.setItem('stoken',data.data.stoken);
                    if(data.data.issetpwd){ //设置 了密码进店铺首页
                        location.href = './storeHome.html';
                        localStorage.setItem("isTrading",false);
                    }else{ // 没设置密码 直接进设置密码界面
                        location.href = './shopSet.html?isSet=1';
                    }
                }else{
                    this.isPopup = true;
                    this.popContent = data.msg;
                }
            })
        },
        applyShow(){
            location.href = './applyStore.html';
        }
    },

    watch:{
        telNumber:function(val,old){
            let regSpace = /\s+/g;
            let regTel = /^1\d{10}$/;
            val = val.replace(regSpace,'');
            if(val){
                this.showCloseTel = true;
            }else{
                this.showCloseTel = false;
            }
            if(val.length>11){
                this.telNumber = old;
                return;
            }
            if(val && regTel.test(val)){
                this.telCanNext = true;
            }
        },
        code:function(value,old){
            if(value.length>6){
                this.code = old;
                return;
            }
            let arr = value.split('');
            arr.length = 6;
            this.codeList = [].concat(arr);
            if(value.length == 6){
                this.loginResponse({
                    mobile:this.telNumber,
                    code:value
                });
            }
        },
        account(val,old){
            let regSpace = /\s+/g;
            let regTel = /^1\d{10}$/;
            val = val.replace(regSpace,'');
            if(val){
                this.showClearAccount = true;
            }else{
                this.showClearAccount = false;
                this.psw = '';
            }
            if(val.length>11){
                this.account = old;
                return;
            }
        },
        psw(val){
            if(this.account && val){
                this.loginCan = true;
            }
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
    background:@white-color;
}

.login{
    .flex();
    .alignItems();
    margin: 0 auto;
    .pxRem(margin-top,180);
    .pxRem(margin-bottom,180);
    .justifyContent();
    .logo{
        .pxRem(width,100);
        .pxRem(height,100);
    }
    .name{
        .pxRem(margin-left,30);
        .pxRem(width,251);
        .pxRem(height,70);
    }
}
.select-login-way{
    .pxRem(padding-left,70);
    .pxRem(padding-right,70);
}
.tel-login{
    width: 100%;
    color: @white-color;
    background:@red-color;
    .pxRem(line-height,80);
    text-align: center;
    .pxRem(font-size,28);
    .borderRadius(40);
}
.psw-login{
    width: 100%;
    color: @red-color;
    .pxRem(line-height,80);
    text-align: center;
    .pxRem(font-size,28);
    .borderRadius(40);
    .border(2,@red-color);
    .pxRem(margin-top,70);
}
.no-shop{
    .pxRem(margin-top,60);
    .flex();
    .alignItems();
    .justifyContent();
    .tips{
        .pxRem(width,30);
        .pxRem(height,30);
    }
    .tips-text{
        color: #4d96dc;
        .pxRem(font-size,24);
        .pxRem(line-height,30);
        .pxRem(margin-left,20);
    }
}
.agree{
    .pxRem(margin-top,100);
    text-align: center;
    .pxRem(font-size,24);
    color: @gray-light-text;
}

.login-cont{
    .pxRem(padding-top,70);
    .pxRem(padding-left,70);
    .pxRem(padding-right,70);
}

.all-black-title{
    .pxRem(font-size,36);
    color: @gray-text;
    .pxRem(margin-bottom,40);
}
.input-box{
    width:100%;
    .pxRem(marign-top,50);
    .borderBottom(2);
    .pxRem(padding-top,20);
    .pxRem(padding-bottom,20);
    .flex();
    .alignItems();
    .justifyContent(space-between);
    .write-input{
        width:80%;
        .pxRem(line-height,40);
        border:0;
    }
}

.code-list{
    .flex();
    .alignItems();
    .justifyContent(space-around);
    .code-item{
        .pxRem(width,50);
        .pxRem(line-height,50);
        .pxRem(height,50);
        text-align:center;
        color:@gray-light-text;
        .pxRem(font-size,24);
        .borderBottom(2);
    }
}
.tel-time-cont{
    .pxRem(margin-top,50);
    .pxRem(margin-bottom,50);
    .flex();
    .justifyContent(space-between);
    .alignItems();
    .time,.tel-num{
        color: @gray-light-text;
        .pxRem(font-size,24);
        .pxRem(line-height,32);
    }
}

.getAgain{
    color:@red-color;
    .pxRem(font-size,24);
    .pxRem(line-height,32);
}
.hidden-input{
  height:0;
position:relative;
  /*overflow: hidden;*/
/*visibility:hidden;*/
  input{
    /*margin-left:-999em;*/
    /*height:0;*/
    /*line-height: 0;*/
    position: absolute;
    top:0;
    left:-999em;
  }
}

.next{
    .pxRem(margin-top,140);
    &.disabled{
        opacity: 0.6;
    }
}
</style>

