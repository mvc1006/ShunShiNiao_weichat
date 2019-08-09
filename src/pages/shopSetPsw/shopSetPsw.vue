<template>
    <div class="container">
        <div class="header-top">
            <div class="back" @click="goBack">
                <div class="go-back"></div>
            </div>
            <div class="title">设置交易密码</div>
        </div>
        <div class="set-psw" v-if="set">
            <p>请输入6位交易密码</p>
            <label for="set" id="set-label">
                <ul class="psw-list">
                    <li class="psw-item"
                    v-for="(item,index) in setShow"
                    :key="index"
                    :class="{'active':item}">{{item && '*'}}</li>
                </ul>
            </label>
        </div>
        <div class="set-psw" v-else>
            <p>请确认交易密码</p>
            <label for="confirm">
                <ul class="psw-list">
                    <li class="psw-item"
                    v-for="(item,index) in sureShow"
                    :key="index"
                    :class="{'active':item}">{{item && '*'}}</li>
                </ul>
            </label>
        </div>
        <div class="input-box">
            <input type="number" v-focus size="6" v-model="setPsw" ref="set" id="set">
            <input type="number" size="6" v-model="surePsw" ref="confirm" id="confirm">
        </div>
        <popUp v-if="isPopUp" :type="1" :content="popContent"></popUp>
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
            set:true,
            setPsw:'',
            surePsw:'',
            setShow:Array(6),
            sureShow:Array(6)
        }
    },
    methods:{
        // 返回
        goBack(){
        //   history.back();
            location.href = './shopIncome.html';
        },
        setChange(value,old){
            let arr = value.split('');
            arr.length = 6;
            this.setShow = [].concat(arr);
            setTimeout(() => {
                if(value.length >= 6){
                    this.set = false;
                    this.$refs.confirm.focus();
                }
            }, 500);
        },
        sureChange(value,old){
            let arr = value.split('');
            arr.length = 6;
            this.sureShow = [].concat(arr);
            setTimeout(() => {
                if(value.length >= 6){
                    if(this.setPsw == this.surePsw){
                        if(this.isTrading){
                            this.dataService.areaerSetCashPwd({
                                cash_pwd:this.surePsw,
                                area_id: localStorage.getItem("area_id")
                            }).then(resp=>{
                                this.dataService.handleResponse({
                                    data:resp,
                                    callback:(data)=>{
                                        location.href = './shopBindBank.html'
                                    }
                                })
                            })
                            return false
                        }
                        this.dataService.setPsw({
                            cash_pwd:this.surePsw
                        }).then(resp=>{
                            this.dataService.handleResponse({
                                data:resp,
                                callback:(data)=>{
                                    location.href = './shopBindBank.html'
                                }
                            })
                        })
                    }else{
                        this.setPsw = '';
                        this.surePsw = '';
                        this.setShow = Array(6);
                        this.sureShow = Array(6);
                        this.set = true;
                        this.$refs.set.focus();
                        this.isPopUp = true;
                        this.popContent = '两次输入的密码不一致';
                    }
                }
            }, 300);
        }
    },
    directives: {
        focus: {
            // 指令的定义
            inserted: function (el) {
                el.click()
            }
        }
    },
    watch:{
        // 设置密码监听
        setPsw(value,old){
            if(value.length>6){
                value = old;
                this.setPsw = old;
            }
            this.setChange(value,old);
        },
        // 确认密码监听
        surePsw(value,old){
            if(value.length>6){
                this.surePsw = old;
                value = old;
            }
            this.sureChange(value,old);
        }
    },
    computed: {
        isTrading(){
          return localStorage.getItem('isTrading')=="true"?true:false;
        }
    },
    mounted(){
        this.common.goBack(this.goBack);
        document.getElementById('set-label').click();
        this.$eventBus.$on("closePopup",()=>{
          this.isPopUp = false;
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
    background: @white-color;
}
.set-psw{
    .pxRem(padding-left,80);
    .pxRem(padding-right,80);
    p{
        .pxRem(margin-top,50);
        .pxRem(margin-bottom,50);
        color: @gray-light-text;
        .pxRem(font-size,24);
        text-align: center;
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
</style>
