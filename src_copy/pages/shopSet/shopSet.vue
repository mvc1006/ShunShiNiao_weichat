<template>
    <div class="container">
        <div class="header-top">
            <div class="back" @click="goBak">
                <div class="go-back"></div>
            </div>
            <div class="title">设置</div>
        </div>
        <!-- 登陆首页 选择登陆方式 -->
        <div class="cont-box">
            <div class="set-cont" v-if="isSet">
                <ul class="set-list">
                    <li class="set-item">
                        <span class="name">登录账号</span>
                        <span class="value">{{data.mobile}}</span>
                    </li>
                    <li class="set-item">
                        <span class="name">登录密码</span>
                        <span class="value" v-if="data.issetpwd == 1" @click="setShopLogin(true)">******</span>
                        <!-- <span class="value" v-if="data.issetpwd == 1" @click="setShopLogin(true)">已设置</span> -->
                        <span class="value" v-if="data.issetpwd == 2" @click="setShopLogin(false)">未设置</span>
                    </li>
                </ul>
                <div class="loginOut" @click="goLoginOut">退出登录</div>
            </div>
            <div class="psw-cont" v-else>
                <div class="set-psw" v-if="!isChange">
                    <h2 class="all-black-title">设置登录密码</h2>
                    <p class="account">{{data.mobile}}</p>
                    <ul class="input-list">
                        <li class="input-item">
                            <input type="password" placeholder="请输入密码" v-model="setPsw">
                        </li>
                        <li class="input-item">
                            <input type="password" placeholder="请确认密码" v-model="setPswSure">
                        </li>
                    </ul>
                    <div class="loginOut noMargin" @click="setPswFn">完成</div>
                </div>
                <div class="change-psw" v-else>
                    <h2 class="all-black-title">修改登录密码</h2>
                    <p class="account">{{data.mobile}}</p>
                    <ul class="input-list">
                        <li class="input-item">
                            <input type="password" placeholder="请输入原始密码" v-model="oldPsw">
                        </li>
                        <li class="input-item">
                            <input type="password" placeholder="请输入新密码" v-model="newPsw">
                        </li>
                        <li class="input-item">
                            <input type="password" placeholder="请确认新密码" v-model="newPswSure">
                        </li>
                    </ul>
                    <div class="loginOut noMargin" @click="changePswFn">完成</div>
                </div>
            </div>
        </div>
        <component :is="pop"
        :type="2"
        :content="'您确定要退出我的店铺吗？'"
        :cancel="'取消'"
        :confirm="'确定'"
        @popupconfirm="popupconfirm"
        @popupcancel="popupcancel"></component>
        <popUp v-if="isPop" :type="1" :content="popContent" :time="3000"></popUp>
    </div>
</template>
<script>
import popUp from '@/components/popUp.vue';
export default {
    name:'app',
    data(){
        return {
            isPop: false,
            popContent: '',
            isSet:true,
            data:{},
            pop:'',
            isChange:false,
            // change psw
            oldPsw:'',
            newPsw:'',
            newPswSure:'',
            // set psw
            setPsw:'',
            setPswSure:'',
            regSpace: /\s+/g,
            pswReg:/^[0-9a-zA-Z_]{6,18}$/
        }
    },
    mounted(){
        let that = this;
        let isSet = this.common.getUrlParam('isSet');
        if(isSet){
            this.urlIsSet = true;
            this.isSet = false;
            this.isChange = false;
        }
        this.common.goBack(this.goBack);
        // 关闭提示框
        this.$eventBus.$on("closePopup",function(){
          that.isPop = false;
        });
    },
    methods:{
        goBak(){
            if(this.isSet){
                location.href = './storeHome.html';
            }else{
                this.isSet = true;
            }
        },
        goLoginOut(){
            this.pop = popUp;
        },
        popupcancel(){
            this.$nextTick(()=>{
                this.pop = '';
            })
        },
        popupconfirm(){
            this.$nextTick(()=>{
                this.pop = '';
            })
            localStorage.setItem('stoken','');
            location.href = 'shopLogin.html';
        },
        getShopInfo(){
            this.dataService.getShopInfo().then(resp=>{
                this.dataService.handleResponse({
                    data:resp,
                    callback:(data)=>{
                        this.data = Object.assign({},data);
                    }
                })
            })
        },
        setShopLogin(value){
            this.isSet = false;
            this.isChange = value;
        },
        changePswFn(){
            console.log(111)
            let {oldPsw,newPsw,newPswSure} = this;
            oldPsw = oldPsw.replace(this.regSpace,'')
            newPsw = newPsw.replace(this.regSpace,'')
            newPswSure = newPswSure.replace(this.regSpace,'')
            if(!oldPsw){
                this.isPop = true;
                this.popContent = '请输入旧密码';
                return;
            }
            if(!newPsw){
                this.isPop = true;
                this.popContent = '请输入新密码';
                return;
            }
            if(!this.pswReg.test(newPsw)){
                this.isPop = true;
                this.popContent = '请输入6-18的数字字母组合的密码';
                return;
            }
            if(!newPswSure){
                this.isPop = true;
                this.popContent = '请确认输入新密码';
                return;
            }
            if(newPsw != newPswSure){
                this.isPop = true;
                this.popContent = '两次输入的密码不同';
                return;
            }
            this.pswSuccess({
                pwd_old:oldPsw,
                pwd:newPswSure
            })

        },
        setPswFn(){
            let {setPsw,setPswSure} = this;
            setPsw = setPsw.replace(this.regSpace,'')
            setPswSure = setPswSure.replace(this.regSpace,'')
            if(!setPsw){
                this.isPop = true;
                this.popContent = '请输入密码';
                return;
            }
            if(!this.pswReg.test(setPsw)){
                this.isPop = true;
                this.popContent = '请输入6-18的数字字母组合的密码';
                return;
            }
            if(!setPswSure){
                this.isPop = true;
                this.popContent = '请确认输入密码';
                return;
            }
            if(setPsw != setPswSure){
                this.isPop = true;
                this.popContent = '两次输入的密码不同';
                return;
            }
            this.pswSuccess({
                pwd:setPswSure
            })
        },
        pswSuccess(params){
            this.dataService.setLoginPsw(params).then(resp=>{
                this.dataService.handleResponse({
                    data:resp,
                    callback:(data)=>{
                        let msg = params.pwd_old ? '密码重置成功':'密码设置成功';
                        this.isPop = true;
                        this.popContent = msg;
                        this.isSet = true;
                        this.data.issetpwd = 1;
                        location.href = './storeHome.html';
                    }
                })
            })
        }
    },
    created(){
        this.getShopInfo();
    },
    components:{
        popUp
    },
    watch:{

    }
}
</script>
<style lang="less">
@import url('../../less/header.less');
body{
    background:@white-color;
}
.cont-box{
    .pxRem(margin-top,20);
}
.set-item{
    .pxRem(padding-top,30);
    .pxRem(padding-bottom,30);
    .pxRem(padding-left,30);
    .pxRem(padding-right,30);
    .borderBottom(2);
    .flex();
    .alignItems();
    .justifyContent(space-between);
    .name{
        color:@gray-text;
        .pxRem(font-size,24);
    }
    .value{
        color:@gray-light-text;
        .pxRem(font-size,24);
    }
}
.set-cont{
    position: relative;
}
.loginOut{
    .pxRem(margin-left,60);
    .pxRem(margin-right,60);
    .pxRem(margin-top,200);
    color: @white-color;
    background:@red-color;
    .pxRem(line-height,80);
    text-align: center;
    .pxRem(font-size,28);
    .borderRadius(40);
    &.noMargin{
        margin-left:0;
        margin-right:0;
    }
}
.all-black-title{
    .pxRem(font-size,36);
    color: @gray-text;
    .pxRem(margin-bottom,40);
}
.set-psw,.change-psw{
    .pxRem(margin-left,60);
    .pxRem(margin-right,60);
}
.account{
    color: @gray-light-text;
    .pxRem(font-size,24);
}
.input-item{
    .pxRem(margin-top,30);
    .borderBottom(2);
    input{
        width:100%;
        .pxRem(margin-left,16);
        .pxRem(margin-right,16);
        .pxRem(line-height,50);
        border:0;
        outline: 0;
    }
}

</style>

