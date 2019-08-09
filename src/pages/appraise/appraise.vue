<template>
<div class="container">
    <div class="header-top">
        <div class="back">
            <div class="go-back" @click="goBack"></div>
        </div>
        <div class="title">发表评价</div>
        <div class="save-new" @click="send">发布</div>
    </div>
    <div class="goods-appraise">
        <div class="goods-star">
            <div class="left-img">
                <img :src="userPhoto" alt="">
            </div>
            <div class="text">商品满意度</div>
            <big-star @selectFn="goodsFn"></big-star>
        </div>
        <div class="appraise-text">
            <textarea v-model="content" placeholder="快来描述一下你的购物体验和使用感受吧~"></textarea>
            <div class="add-btns">
                <div class="img-item"
                    v-for="(item,index) in images"
                    :key="index">
                    <img class="img-main" :src="item" alt="">
                    <img @click="delNow(index)" class="img-del" src="../../assets/delete.png" alt="">
                </div>
                <label for="imgInput">
                    <div class="btn add-img">{{images.length>0?images.length+'/'+upLoadImgNum:'添加照片'}}</div>
                </label>
                <!-- <label for="videoInput">
                    <div class="btn add-video">添加视频</div>
                </label> -->
            </div>
        </div>
        <div class="anonymous">
            <input type="checkbox" :checked="is_anonymous" @change="anonymous">
            <span>匿名</span>
        </div>
    </div>
    <div class="other-appraise">
        <div class="other-one">
            <span class="name-text">服务满意度</span>
            <big-star @selectFn="shopFn"></big-star>
            <span class="star-text">{{shop.text}}</span>
        </div>
        <div class="other-one">
            <span class="name-text">物流满意度</span>
            <big-star @selectFn="expressFn"></big-star>
            <span class="star-text">{{express.text}}</span>
        </div>
    </div>
    <div class="input-file">
        <input id="imgInput" accept="image/*" type="file"/>
        <input id="videoInput" accept="video/*" type="file"/>
    </div>
    <popUp v-if="isPopup" :type="1" :content="popContent"></popUp>
</div>
</template>
<script>
import bigStar from '@/components/appraiseStar.vue';
import upload from '@/js/upload.js';
import popUp from '@/components/popUp.vue'
export default {
    name:'paySuccess',
    data(){
        return {
            isPopup: false,
            popContent: '',
            star:['非常差','差','一般','好','非常好'],
            good:{
                point:5,
                text:'非常好'
            },
            shop:{
                point:5,
                text:'非常好'
            },
            express:{
                point:5,
                text:'非常好'
            },
            content:'',
            is_anonymous:true,
            images:[],
            imgFile:[],
            reader:new FileReader(),
            upLoadImgNum: 9,
        }
    },
    computed:{
        userPhoto:function(){
            console.log(sessionStorage.getItem('user-info'))
            return JSON.parse(sessionStorage.getItem('user-info')).avatar;
        }
    },
    methods:{
      // 返回上一页
      goBack(){
        history.back();
      },
      goodsFn(val){
          this.good.point = val;
          this.good.text = this.star[val-1];
      },
      shopFn(val){
          this.shop.point = val;
          this.shop.text = this.star[val-1];
      },
      expressFn(val){
          this.express.point = val;
          this.express.text = this.star[val-1];
      },
      anonymous(){
          this.is_anonymous = !this.is_anonymous;
      },
      send(){
          let id = this.common.getUrlParam('id');
          let imgData = new FormData();
          imgData.append('order_goods_id',id);
          imgData.append('goods_point',this.good.point);
          imgData.append('shop_point',this.shop.point);
          imgData.append('deliver_point',this.express.point);
          imgData.append('content',this.content);
          imgData.append('is_anonymous',this.is_anonymous?1:0);
          for(let i=0;i<this.imgFile.length;i++){
              imgData.append('images[]', this.imgFile[i]);
          }
          this.dataService.sendAppraise(imgData).then(resp=>{
              this.dataService.handleResponse({
                  data:resp,
                  callback:(data)=>{
                      location.href = './appraised.html?id='+id;
                  }
              })
          })
        },
        inputClick(){
            let imgInput = document.getElementById('imgInput');
            const _this = this;
            let i=0;
            if(_this.images.length>=_this.upLoadImgNum){
                this.isPopup = true;
                this.popContent = '最多只能上传'+_this.upLoadImgNum+'个';
                return;
            }
            imgInput.addEventListener('change',()=>{
                let file = imgInput.files[0];
                i++;
                if (i !== 1) {
                    return false
                } else {
                    i = 0
                    if (file.size / 1024 / 1024 > 10) {
                        this.isPopup = true;
                        this.popContent = '图片大小不能超过10MB';
                        return false
                    }
                    upload(file, _this.appendImg,(result)=>{
                        _this.images.push(result);
                        console.log( _this.images.length)
                    });
                }
            })
        },
        appendImg(fileResize){
            this.imgFile.push(fileResize)
        },
        delNow(index){
            this.images.splice(index,1);
            this.imgFile.splice(index,1);
        }
    },
    mounted(){
        this.inputClick();
        this.$eventBus.$on("closePopup",()=>{
          this.isPopup = false;
        })
    },
    components:{
        bigStar,
        popUp
    }
}
</script>
<style lang="less">
@import url('../../less/header.less');
body{
    background: @background-color;
}
.goods-appraise{
    .pxRem(margin-top,20);
    background: @white-color;
}
.goods-star{
    .flex();
    .alignItems(center);
    .pxRem(padding-top,16);
    .pxRem(padding-right,16);
    .pxRem(padding-bottom,16);
    .pxRem(padding-left,16);
    .borderBottom(2);
    .left-img{
        .pxRem(width,60);
        .pxRem(height,60);
        .borderRadius(8);
        overflow: hidden;
        img{
            width: 100%;
            height: 100%
        }
    }
    .text{
        .pxRem(font-size,20);
        color:@simple-gray-color;
        .pxRem(margin-left,48);
        .pxRem(margin-right,48);
    }
}
// .star-cont{
//     .pxRem(margin-left,32);
// }
.appraise-text{
    .pxRem(padding-top,20);
    .pxRem(padding-right,16);
    .pxRem(padding-bottom,20);
    .pxRem(padding-left,16);
    .borderBottom(2);
    textarea{
        outline: 0;
        border: 0;
        color: @gray-text;
        .pxRem(font-size,24);
        .pxRem(height,170);
        width: 100%;
    }
    .add-btns{
        >div{
            .pxRem(margin-top,16);
        }
        .flex();
        .alignItems();
        .flexWrap(wrap);
        .btn{
            .pxRem(margin-right,20);
            text-align: center;
            color:@CFCFCF;
            .pxRem(font-size,20);
            .pxRem(padding-top,90);
            box-sizing: border-box;
            .flexShrink(0);
        }
    }
}
.other-appraise{
    .pxRem(margin-top,16);
    background: @white-color;
    .pxRem(padding-left,16);
    .pxRem(padding-right,16);
    .pxRem(padding-top,20);
    .pxRem(padding-bottom,20);
    .pxRem(font-size,24);
    .other-one{
        .flex();
        .alignItems();
        .pxRem(padding-top,20);
        .pxRem(padding-bottom,20);
    }
    .star-text{
        .pxRem(font-size,24);
        color: @gray-text;
        .pxRem(margin-left,32);
    }
    .name-text{
        // .pxRem(font-size,20);
        color:@simple-gray-color;
        .pxRem(margin-right,32);
    }
}
.anonymous{
    .pxRem(padding-top,30);
    .pxRem(padding-bottom,30);
    .pxRem(padding-left,16);
    .pxRem(padding-right,16);
    .flex();
    .alignItems();
    input{
        .pxRem(width,32);
        .pxRem(height,32);
        .pxRem(margin-right,16);
    }
    span{
        .pxRem(font-size,24);
        color: @gray-text;
    }
}
.input-file{
    height: 0;
    line-height: 0;
    overflow: hidden;
    display: none;
}
.img-item{
    .pxRem(width,142);
    .pxRem(height,142);
    .pxRem(margin-right,20);
    position: relative;
    .flexShrink(0);
    .img-main{
        width: 100%;
        height: 100%;
        .borderRadius(8);
    }
    .img-del{
        position: absolute;
        .pxRem(width,32);
        .pxRem(height,32);
        .pxRem(top,-12);
        .pxRem(right,-12);
        z-index: 10;
    }
}
</style>
