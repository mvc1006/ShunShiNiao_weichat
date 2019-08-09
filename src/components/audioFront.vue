<template>
    <div class="audio-box">
        <div class="front-gif">
            <img src="../assets/front.gif" alt="">
        </div>
        <div class="audio-btn" 
            @click="playAudio">
            <div class=" ico-audio-btn" :class="{'close':!isPlay}"></div>
        </div>
        <audio loop id="audio" v-if="Rendering">
            <source src="static/audio/a.mp3" type="audio/mpeg">
        </audio>
    </div>
</template>

<script>
import wx from 'weixin-js-sdk';
export default {
    prpos:{
        // isPlay: {
        //     type: Boolean,
        //     default: true,
        // } 
    },
    data(){
        return {
            isPlay: true,
            Rendering: true
        }
    },
    created(){
        this.Rendering = document.getElementById('audio') ? false : true;
    },
    mounted(){
        this.autoPlayAudio1();
        this.$eventBus.$on("audioStateChange",(data) => {
            this.isPlay = data;
        })
    },
    methods:{
        autoPlayAudio1() {
            var audio = document.getElementById('audio'),that = this;
            if (window.WeixinJSBridge) {
                WeixinJSBridge.invoke('getNetworkType', {}, function (e) {
                    if(that.isPlay){
                        audio.play();
                    }
                }, false);
            } else {
                document.addEventListener("WeixinJSBridgeReady", function () {
                    WeixinJSBridge.invoke('getNetworkType', {}, function (e) {
                        if(that.isPlay){
                            audio.play();
                        }
                    });
                }, false);
            }
            audio.play();
            // wx.config({
            //     // 配置信息, 即使不正确也能使用 wx.ready
            //     debug: false,
            //     appId: '',
            //     timestamp: 1,
            //     nonceStr: '',
            //     signature: '',
            //     jsApiList: []
            // });
            // let that = this;
            // wx.ready(function() {
            //     if(that.isPlay){
                        // document.getElementById('audio').play();
                        // alert(document.getElementById('audio'))
            //     }
            // });
        },
        playAudio(){
            let audio = document.querySelector('#audio');
            if(!this.isPlay){
                audio.play();
            }else{
                audio.pause();
            }
            this.isPlay = !this.isPlay;
            this.$eventBus.$emit('audioStateChange',this.isPlay);
        },
    }
}
</script>

<style lang="less">
@import url('../less/common');
    .audio-box{
        position: relative;
    }
    .audio-btn{
        .pxRem(width,50);
        .pxRem(height,50);
        .flex();
        .justifyContent(center);
        .alignItems();
        position: absolute;
        z-index: 2;
        .pxRem(top,-6);
        .pxRem(right,-34);
    }
    .front-gif{
        .pxRem(width,100);
        .pxRem(height,85);
        img{
          width: 100%;
          height: 100%;
    }
  }
</style>
