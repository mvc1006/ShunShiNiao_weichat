<template>
<div class="container">
    <div class="banner">
        <img :src="details.act_pic" alt="">
    </div>
    <div class="product-details">
        <div class="concat-title">
            <div class="concat-title-cont">套餐组合</div>
        </div>
        <ul class="details-pro-list">
            <li class="details-item" v-for="(item,index) in details.act_goods" :key="index">
                <div class="details-shop" @click="openShop(item)">
                    <span class="ico store-ico"></span>
                    <span class="store-name">{{item.shop_name}}</span>
                    <span class="next-ico"></span>
                    <span class="distance">{{item.distance}}</span>
                </div>
                <div class="details-product" @click="openDetails(item)">
                    <img class="dp-img" :src="item.goods_img" alt="">
                    <div class="dp-info">
                        <p class="pd-title">{{item.goods_name}}</p>
                        <p class="pd-price">价值：￥{{item.shop_price}}</p>
                    </div>
                </div>
            </li>
        </ul>
        <div class="details-info">
            <div class="details-title">{{details.name}}</div>
            <p class="details-price-num">
                <span class="details-price">￥{{details.price}}</span>
                <span class="details-num">已售{{details.sale_num}}件</span>
            </p>
        </div>
    </div>
    <!-- 购买记录 -->
    <div class="buy-record">
        <h2>购买记录</h2>
        <ul class="record-list">
            <li class="record-item" ref="rollul"
            v-for="(item,index) in buyList" 
            :key="index" 
            :class="{'anim':animate}">
                <div class="item-photo">
                    <img :src="item.avatar" alt="">
                </div>
                <div class="item-text">
                    <p class="item-name">{{item.user_nickname}}</p>
                    <p class="item-tel-time">
                        <span class="tel">{{item.telephone}}</span>
                        <span class="time">{{item.ctime}}</span>
                    </p>
                </div>
            </li>
        </ul>
    </div>
    <!-- 购买须知 -->
    <div class="buy-record lasted">
        <h2>购买须知</h2>
        <div class="buy-text" v-html="details.desc"></div>
    </div>
    <div class="btn-ctrl" v-show="!write">
        <div class="btn share-btn" @click="goShare">分享赚</div>
        <div class="btn buy-btn" @click="goBuy">立即购买</div>
    </div>
    <div class="bg-shadow" @click="hideWrite" v-if="write" :style="{top:top+'px'}">
        <div class="white-user-info" @click.stop="">
            <p class="tips">*请填写您真实的手机号和姓名，用户商家核销</p>
            <div class="input-box">
                <span class="text">姓名</span>
                <input type="text" class="input" placeholder="请输入姓名" v-model.trim="name">
            </div>
            <div class="input-box">
                <span class="text">手机号</span>
                <input type="text" class="input" placeholder="请输入手机号" v-model.trim="tel">
            </div>
            <div class="btn buy-btn" @click="submit">提交订单</div>
        </div>
    </div>
    <div class="bg-shadow" ref="share" @click="hideShare" v-if="share" :style="{top:top+'px'}">
        <div class="share-box no-padding" id="canvas-img">
            <img :src="details.share_pic" alt="">
            <h2>长按保存图片</h2>
        </div>
        <div class="share-close">
            <img src="../../assets/close.png" alt="">
        </div>
    </div>
    <!-- <div class="share-box go-out" id="share-canvas-html">
        <div class="share-bg">
            <div class="share-cont">
                <p class="share-title">{{details.name}}</p>
                <p class="share-chat">
                    <img src="../../assets/enter_merchant.png" alt="">
                    <img class="detailsPic" :src="details.share_pic" alt="">
                </p>
                <p class="share-tips">数量有限，速来抢购</p>
            </div>
        </div>
        <p class="tips-text">好友购买后您还有<span class="red-color">5.88~88.88</span>元红包一秒返现哦~</p>
        <p class="save-text">长按保存图片</p>
    </div> -->
    <city-btn-group></city-btn-group>
</div>
</template>
<script>
import html2canvas from 'html2canvas';
import cityBtnGroup from '@/components/cityBtnGroup'
export default {
    name:'city-concat-details',
    data(){
        return {
            write:false, //显示提交
            share:false, // 显示分享
            top:0, // 位置
            name:'', // 名字
            tel:'', //电话
            animate:false,
            timeOutEvent:0,
            details:{},
            buyList:[],
            newImgSrc:''
        }
    },
    mounted(){
        this.timer = setInterval(this.scroll,2000);
        this.$eventBus.$on("scrollStart",() => {
            let group = document.getElementsByClassName('left-btn-group')[0];
            group.style.right = - group.clientWidth + 'px'
            // console.log(.clientWidth);
        });
        this.$eventBus.$on("scrollEnd",() => {
            let group = document.getElementsByClassName('left-btn-group')[0];
            group.style.right = 0
        });
    },
    computed:{
        act_id:function(){
            return this.common.getUrlParam('act_id');
        },
        shareid:function(){
            return this.common.getUrlParam('pid') || '';
        }
    },
    created(){
        this.getDetails();
    },
    methods:{
        shareWx(){
            let title = this.details.name;
            let desc = '我刚抢了，你也快来抢吧！';
            let imgUrl = this.details.wx_share_pic;
            this.common.shareFun(title,desc,imgUrl);
        },
        getDetails(){
            this.dataService.getCityConcatDetails({
                act_id:this.act_id
            }).then(resp=>{
                this.dataService.handleResponse({
                    data:resp,
                    callback:(data)=>{
                        this.details = data;
                        this.buyList = data.buy_record;
                        this.shareWx();
                    }
                })
            })
        },
        scroll(){
            let con1 = this.$refs.rollul;
            let first = con1[0];
            let height = first.clientHeight;
            setTimeout(()=>{
                first.style.marginTop = -height +  'px';
                // 这个地方如果不把animate 取反会出现消息回滚的现象，此时把ul 元素的过渡属性取消掉就可以完美实现无缝滚动的效果了
                this.animate = true;
            },0)
            let transitionEvent = this.whichTransitionEvent();
            transitionEvent && first.removeEventListener(transitionEvent, this.transitionEnd);
            transitionEvent && first.addEventListener(transitionEvent,this.transitionEnd(first),false);
        },
        whichTransitionEvent(){
            var t;
            var el = document.createElement('fakeelement');
            var transitions = {
                'transition': 'transitionend',
                'OTransition': 'oTransitionEnd',
                'MozTransition': 'transitionend',
                'WebkitTransition': 'webkitTransitionEnd'
            }
            for (t in transitions) {
                if (el.style[t] !== undefined) {
                    return transitions[t];
                }
            }
        },
        transitionEnd(obj){
            this.buyList.push(this.buyList[0]);
            this.buyList.shift();
            this.animate = false;
            obj.style.marginTop = 0
        },
        goBuy(){
           this.write = true;
        },
        hideWrite(){
            this.write = false;
        },
        submit(){
            let regTel = /^1\d{10}$/;
            if(!this.name){
                alert('请输入姓名');
                return;
            }
            if(!regTel.test(this.tel)){
                alert('请输入正确的手机号');
                return;
            }
            this.dataService.cityConcatSubmit({
                act_id:this.act_id,
                user_mobile:this.tel,
                user_name:this.name,
                shareid:this.shareid
            }).then(resp=>{
                this.dataService.handleResponse({
                    data:resp,
                    callback:(data)=>{
                        location.href = data.jump_url;
                    }
                })
            })
        },
        goShare(){
            this.share = true;
            this.$nextTick(()=>{
                let body = this.$refs.share,
                    shareBox = document.querySelector('#canvas-img');
                let bodyHeight = body.clientHeight,
                    shareHeight = shareBox.clientHeight;
                    shareBox.style.marginTop = (bodyHeight - shareHeight - 100)/2 + 'px';
            })
            // setTimeout(() => {
            //     this.download();
            // }, 1000);
        },
        hideShare(){
            this.share = false;
        },
        download(){
            let _this = this;
            html2canvas(document.querySelector('#share-canvas-html'),{
                // useCORS: true,//允许加载跨域的图片
                // tainttest:true,
                // proxy:'http://wxtest.shunshiniao.net',
            }).then(canvas => {
                // document.body.appendChild(canvas)
                // console.log(canvas)
                //3. 图片导出为 png 格式
                var type = 'png';
                var imgData = canvas.toDataURL(type);

                var _fixType = function (type) {
                    type = type.toLowerCase().replace(/jpg/i, 'jpeg');
                    var r = type.match(/png|jpeg|bmp|gif/)[0];
                    return 'image/' + r;
                };
                // 加工image data，替换mime type
                imgData = imgData.replace(_fixType(type), 'image/octet-stream');
                _this.newImgSrc = imgData;
            });
        },
        openShop(data){
            location.href = './storeMerchant.html?shop_id='+data.shop_id + '&local=true&shop_name=' + encodeURIComponent(data.shop_name)
        },
        openDetails(data){
            location.href = './sourceShopDetails.html?id='+data.goods_id + '&local=1&isBuyPresent=true&isCityConcat=1';
        }
    },
    components:{
        cityBtnGroup
    },
    destroyed(){
        clearInterval(this.timer)
    }
}
</script>
<style lang="less">
    @import url('../../less/header.less');

    body{
        background: @background-color;
        position: relative;
        width: 100%;
        height: auto;
    }
    .banner{
        .flexGrow(0);
    }
    .product-details{
        background: @white-color;
    }
    .concat-title{
        .pxRem(height,86);
        background: @background-color;
        position: relative;
        .concat-title-cont{
            position: absolute;
            .pxRem(left,54);
            .pxRem(bottom,-10);
            .pxRem(width,226);
            .pxRem(height,53);
            .pxRem(font-size,28);
            .pxRem(padding-left,54);
            box-sizing: border-box;
            background: url('../../assets/city-details-bg.png') no-repeat;
            background-size: 100%;
            text-align: center;
            color: @white-color;
        }
    }
    .details-pro-list{
        .pxRem(margin-top,22);
    }
    .details-item{
        background: @background-color;
        .pxRem(margin-bottom,12);
        .pxRem(padding-left,78);
        .pxRem(padding-right,68);
    }
    .details-shop{
        .flex();
        .alignItems(center);
        .pxRem(padding-top,12);
        .pxRem(padding-bottom,12);
        .store-name{
            color: @gray-text;
            .pxRem(font-size,28);
            .pxRem(margin-left,12);
            .pxRem(margin-right,12);
            font-weight: bold;
        }
        .distance{
            color: @gray-light-text;
            .flexGrow(1);
            text-align: right;
        }
    }
    .details-product{
        .flex();
        .alignItems(center);
        .pxRem(padding-bottom,16);
        .dp-img{
            .pxRem(width,124);
            .pxRem(height,124);
            .borderRadius(8);
        }
        .dp-info{
            .pxRem(margin-left,20);
            .pxRem(height,124);
            .flexGrow(1);
            .flex(column);
            .justifyContent(space-between);
        }
        .pd-title{
            .pxRem(font-size,24);
            color: @gray-text;
            font-weight: bold;
        }
        .pd-price{
            .pxRem(font-size,24);
            color: @red-color;
        }
    }
    .details-info{
        .pxRem(margin-top,30);
        .borderTop(2);
        .pxRem(padding-top,26);
        .pxRem(padding-bottom,40);
        .pxRem(padding-left,30);
        .pxRem(padding-right,30);
        .details-title{
            .pxRem(font-size,28);
            font-weight: bold;
            color: @gray-text;
        };
        .details-price-num{
            .flex();
            .pxRem(margin-top,10);
            span{
                .flexGrow(1);
            }
            .details-price{
                .pxRem(font-size,28);
                color: @red-color;
            }
            .details-num{
                .pxRem(font-size,24);
                color: @gray-light-text;
                text-align: right;
            }
        }
    }
    .buy-record{
        .pxRem(margin-top,16);
        background: @white-color;
        h2{
            .pxRem(padding,25);
            color: @gray-text;
            font-weight: bold;
            .pxRem(font-size,28);
            .borderBottom(2);
        }
        .buy-text{
            .pxRem(padding-top,20);
            .pxRem(padding-bottom,20);
            .pxRem(padding-left,25);
            .pxRem(padding-right,25);
            color: @gray-text;
            .pxRem(font-size,24);
            .pxRem(line-height,44);
        }
        .record-list{
            .pxRem(padding-top,10);
            .pxRem(padding-bottom,10);
            .pxRem(padding-left,25);
            .pxRem(padding-right,25);
            .pxRem(height,112*2);
            overflow: hidden;
        }
        .record-item{
            .flex();
            .pxRem(padding-top,16);
            .pxRem(padding-bottom,16);
            .alignItems();
        }
        .item-photo{
            .pxRem(width,64);
            .pxRem(height,64);
            border-radius: 50%;
            overflow: hidden;
            img{
                width: 100%;
                height: 100%;
            }
        }
        .item-text{
            .flexGrow(1);
            .pxRem(margin-left,16);
        }
        .item-name{
            color: @gray-text;
            .pxRem(font-size,24);
            font-weight:bold;
        }
        .item-tel-time{
            .flex();
            span{
                .flexGrow(1);
            }
            .tel{
                color:@red-color;
                font-weight: bold;
                .pxRem(font-size,26);
            }
            .time{
                text-align: right;
                color: @gray-light-text;
                .pxRem(font-size,24);
            }
        }
    }
    .lasted{
        .pxRem(padding-bottom,100);
    }
    .btn-ctrl{
        position: fixed;
        left:0;
        bottom: 0;
        width: 100%;
        .flex();
        .alignItems();
    }
    .btn{
        .pxRem(line-height,98);
        .pxRem(font-size,26);
        color: @white-color;
        text-align: center;
        .flexGrow(1);
    }
    .share-btn{
        background: #ff9629;
    }
    .buy-btn{
        background: @red-color;
    }
    .bg-shadow{
        position: fixed;
        top:0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 99;
        background:rgba(0, 0, 0, 0.3);
    }
    .white-user-info{
        position: absolute;
        background: @white-color;
        left:0;
        bottom: 0;
        width: 100%;
        box-sizing: border-box;
        .pxRem(padding-top,20);
        .tips{
            .pxRem(font-size,24);
            .pxRem(line-height,56);
            color: @red-color;
            .pxRem(padding-left,40);
            .pxRem(padding-right,40);
        }
        .input-box{
            .pxRem(padding,40);
            .borderBottom(2);
            .flex();
            .alignItems();
            .text{
                .pxRem(width,100);
                .pxRem(font-size,24);
                color: @gray-text;
                .flexGrow(0);
                .flexShrink(0);
                text-align: left;
            }
            .input{
                .flexGrow(1);
                border:0;
                outline: 0;
                .pxRem(font-size,24);
                .pxRem(margin-left,20);
                .pxRem(margin-right,20);
            }
        }
    }

    .share-box{
        .pxRem(width,546);
        .borderRadius(16);
        .pxRem(padding,40);
        .borderRadius(12);
        background:@white-color;
        margin: 0 auto;
        h2{
            .pxRem(font-size,28);
            .pxRem(line-height,60);
            color: @gray-text;
            text-align: center;
        }
        img{
            .pxRem(min-height,600);
        }
        &.go-out{
            position: absolute;
            // left: 10000px;
            top:0;
        }
        .share-bg{
            // background: @gray-light-text;
            background: url('../../assets/share-bg.png') no-repeat center center;
            background-size: 100%;
            .borderRadius(10);
            .pxRem(width,400);
            .pxRem(height,620);
            .pxRem(padding-top,90);
            box-sizing: border-box;
            margin: 0 auto;
        }
        .share-cont{
            background:@white-color;
            .borderRadius(10);
            .pxRem(width,296);
            .pxRem(padding,20);
            margin: 0 auto;
            
            box-sizing: border-box;
        }
        .share-title{
            overflow: hidden;
            .pxRem(font-size,26);
            color: @gray-text;
            .pxRem(margin-bottom,30);
        }
        .share-tips{
            text-align: center;
            .pxRem(font-size,24);
            color: @gray-light-text;
            .pxRem(margin-top,18);
            .pxRem(margin-bottom,18);
        }
        .share-chat{
            .pxRem(width,210);
            .pxRem(height,210);
            img{
                width: 100%;
                height:100%;
            }
            margin: 0 auto;
        }
        .tips-text{
            .pxRem(font-size,28);
            color: @gray-text;
            font-weight: bold;
            text-align: center;
            .pxRem(line-height,60);
            .pxRem(padding-left,30);
            .pxRem(padding-right,30);
        }
        .red-color{
            color: @red-color;
        }
        .save-text{
            .pxRem(font-size,30);
            color: @gray-text;
            font-weight: bold;
            .pxRem(line-height,60);
            text-align: center;
        }
    }
    .share-close{
        margin: 0 auto;
        .pxRem(margin-top,20);
        text-align: center;
        img{
            .pxRem(width,56);
            .pxRem(height,56);
        }
    }
</style>
<style>
.anim{
    transition: all 0.5s;
}
</style>


