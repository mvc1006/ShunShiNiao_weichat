<template>
    <div>
        <!-- 用户信息 -->
        <div class="person-info">
            <div class="inof-bg">
                <img @click="setting" class="setting" src="../assets/setting.png" alt="">
                <div class="user-photo">
                    <img :src="userInfo.photoSrc" alt="">
                </div>
                <div class="user-name" v-text="userInfo.name"></div>
                <!-- 用户相关 -->
                <div class="ctrl-btn">
                    <ul class="cbtn-list">
                        <li class="cbtn-item" v-for="(item,index) in otherList" :key="index" @click="clickSkip(item.urlName)">
                            <span class="ico" :class="item.className"></span>
                            <span class="fav-text" v-text="item.name"></span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <!-- 订单 -->
        <div class="order-cont">
            <ul class="my-order-tab" @click="clickSkip('./order.html#/line/all')">
                <li class="name">我的订单</li>
                <li class="find-all-order">查看全部订单</li>
                <li class="next-ico"></li>
            </ul>
            <ul class="order-detail-list">
                <li class="order-detail-item" v-for="(order,index) in orderList" :key="index" @click="clickSkip(order.urlName)">
                    <div class="ico" :class="order.className"></div>
                    <span class="order-item-name" v-text="order.name"></span>
                </li>
            </ul>
        </div>
        <!-- 个人功能 -->
        <div class="other-list">
            <div class="other-item" v-for="(list,index) in listData" :key="index" @click="clickSkip(list.urlName,list.clickName)">
                <span class="ico" :class="list.className"></span>
                <div v-text="list.name"></div>
            </div>
        </div>
        <!-- 招商合作 -->
        <div class="other-list">
            <div class="other-item" v-for="(list,index) in attractList" :key="index" @click="clickSkip(list.urlName)">
                <span class="ico" :class="list.className"></span>
                <div v-text="list.name"></div>
            </div>
        </div>
        <pop-up
            v-if="popShow"
            :type="2"
            :content="popContent"
            :cancel="'取消'"
            :confirm="'呼叫'"
            @popupcancel="popupcancel"
            @popupconfirm="popupconfirm"></pop-up>
    </div>
</template>
<script>
import popUp from '@/components/popUp.vue'
export default {
    data(){
        return {
            popShow:false,
            popContent: '',
            mobile: '', // 绑定的手机号
            /**
             *          name  className     urlName       clickName
             * 列表数据：名称 图标class名称 需要跳转的页面 需要执行的自定义函数
             * 需要执行自定义函数需要自己在 clickSkip 中触发跳转函数
             */
            otherList: [ // 顶部个人相关
                {name: '收藏',className: 'ico-fav', urlName: './myFav.html'},
                {name: '最近浏览',className: 'ico-history-read', urlName: './readHistory.html'},
                {name: '我要推广',className: 'ico-generalize', urlName: './myGeneralize.html'},
                {name: '我的收益',className: 'ico-earnings', urlName: './myEarnings.html'},
            ],
            orderList: [ // 订单相关
                {name: '待付款',className: 'wait-pay', urlName: './order.html#/line/pay'},
                {name: '待发货',className: 'wait-send', urlName: './order.html#/line/payed'},
                {name: '待收货',className: 'already-send', urlName: './order.html#/line/receiving'},
                {name: '待评价',className: 'wait-ela', urlName: './order.html#/line/appraise'},
                {name: '退款/售后',className: 'after-sale', urlName: './personAfterSale.html'},
            ],
            listData: [ // 列表数据
                {name: '我的评价',className: 'person-appraise', urlName: './myAppraise.html'},
                // {name: '分享赚赠品',className: 'sharePresent', urlName: './shareMark.html'},
                {name: '我的店铺',className: 'my-store', urlName: '1', clickName: 'openStore'},
                {name: '我的团队',className: 'my-team', urlName: './myTeam.html', },
                {name: '圈主中心',className: 'circle-main', urlName: '2', clickName: 'openStore'},
                {name: '收货地址',className: 'person-addr', urlName: './myAddr.html'},
                {name: '帮助客服',className: 'person-service', urlName: '', clickName: 'concatUs'},
                // {name: '关于我们',className: 'about-us', urlName: './aboutUs.html'},
            ],
            attractList: [ // 招商合作
                {name: '招源头厂商',className: 'invite-source', urlName: './circleCollaborate.html?circleType=1'},
                {name: '招本地店铺',className: 'invite-locality', urlName: './circleCollaborate.html?circleType=2'},
                {name: '招城市合伙人',className: 'invite-partner', urlName: './circleCollaborate.html?circleType=3'},
                {name: '企业招聘',className: 'invite-enterprise', urlName: './circleCollaborate.html?circleType=4'},
            ],
            userInfo:{
                name:'顺势鸟',
                photoSrc:''
            },
            tradingList: [], // 商圈列表
        }
    },
    methods:{
        // 点击跳转
        clickSkip(url,clickName){
            switch (clickName){
                case 'openStore':
                    this.openStore(url);
                    return false;
                case 'concatUs': 
                    this.concatUs();
                    return false;
            }
            window.location.href = url;
        },
        openStore(num){
            let stoken = localStorage.getItem('stoken');
            let url = '';
            if(num==2&&this.tradingList.length == 0){
                this.popShow = true;
                this.popContent = '详情请咨询：400-0870-687';
                return false;
            }
            if(num==2){
              url = './storeHome.html';
                localStorage.setItem("isTrading",true);
            }else{
                if(stoken){
                    url = './storeHome.html';
                    localStorage.setItem("isTrading",false);
                }else{
                    url = './shopLogin.html';
                }
            }
            location.href = url;
        },
        popupcancel(){
            this.$nextTick(()=>{
                this.popShow = false;
            })
        },
        popupconfirm(){
            window.location.href = 'tel:4000870687';
        },
        open(tag,num){
            let hash ='',url;
            if(num){
                 hash = this.hash[num-1]
                 url = this.url[tag] + hash;
            }else{
                url = this.url[tag]
            }
            location.href = url;
        },
        getUserInfo(){
            let add = sessionStorage.getItem('user-info');
            if(add){
                this.userInfo.name = JSON.parse(add).nickname;
                this.userInfo.photoSrc = JSON.parse(add).avatar;
                this.tradingList = JSON.parse(add).manage_area?JSON.parse(add).manage_area:[];
                this.mobile = JSON.parse(add).mobile;
            }else{
                this.dataService.getUserInfo().then(resp=>{
                    this.dataService.handleResponse({
                        data:resp,
                        callback:(data)=>{
                            this.userInfo.name = data.nickname;
                            this.userInfo.photoSrc = data.avatar;
                            this.tradingList = data.manage_area?data.manage_area:[];
                            this.mobile = data.mobile;
                            sessionStorage.setItem('user-info',JSON.stringify(data));
                        }
                    })
                })
            }
        },
        concatUs(){
            this.popShow = true;
            this.popContent = '客户电话：400-0870-687';
        },
        // 设置
        setting(){
            location.href = './setting.html?mobile=' + this.mobile;
        }
    },
    beforeMount(){
        this.getUserInfo();
    },
    components:{
        popUp
    }
}
</script>
<style lang="less">
    @import url(../less/common.less);
    .other-list{
        .flex();
        .flexWrap(wrap);
        background: @white-color;
        .pxRem(margin-top,16);
        .pxRem(padding-bottom,10);
    }
    .other-item{
        width: 25%;
        .pxRem(padding-top,32);
        .pxRem(padding-bottom,20);
        .pxRem(font-size,24);
        color: @simple-gray-color;
        text-align: center;
        span{
            .pxRem(width,48);
            .pxRem(height,48);
            display: block;
            margin: 0 auto;
            .pxRem(margin-bottom,20);
        }
    }
    .person-info{
        width: 100%;
        .pxRem(height,480);
        .ico{
            margin: 0 auto;
            .pxRem(margin-top,38);
        }
    }
    .inof-bg{
        position: relative;
        width: 100%;
        .pxRem(height,320);
        .pxRem(padding-top,96);
        background: url(../assets/person_bg.png) no-repeat;
        background-size: 100%;
        box-sizing: border-box;
        >.setting{
            position: absolute;
            .pxRem(right,20);
            .pxRem(top,30);
            .pxRem(width,50);
            .pxRem(height,50);
        }
    }
    .user-photo{
        margin: 0 auto;
        .pxRem(width,120);
        .pxRem(height,120);
        .borderRadius(60);
        .border(2,@white-color);
        overflow: hidden;
    };
    .user-name{
        color: @white-color;
        text-align: center;
        .pxRem(font-size,26)
    }
    .ctrl-btn{
        background: @white-color;
        box-shadow: 0 0 10px 0 #2F000000;
        .pxRem(margin-top,40);
        .pxRem(margin-left,20);
        .pxRem(margin-right,20);
        .pxRem(height,160);
        .borderRadius(5);
    }
    .cbtn-list{
        .flex();
        height:100%;
    }
    .cbtn-item{
        .flexGrow(1);
        .alignItems();
        text-align: center;
        height: 100%;
        width: 33.3%;
        .ico{
            .pxRem(margin-bottom,20);
        }
    }
    .fav-text{
        .pxRem(font-size,24);
        color: #404040;
    }

    .order-cont{
        background: @white-color;
    }
    .my-order-tab{
        .pxRem(padding-top,40);
        .pxRem(padding-right,20);
        .pxRem(padding-bottom,40);
        .pxRem(padding-left,20);
        .borderBottom(2 , @border-color);
        .flex();
        .alignItems(center);
        .find-all-order{
            .flexGrow(1);
            .pxRem(font-size,24);
            color: #747474;
            text-align: right;
            .pxRem(margin-right,20)
        }
        .name{
            .flexGrow(1);
            .pxRem(font-size,28);
            color: #404040;
            text-align:left;
        }
        .next-ico{
            .flexGrow(0);
        }
    }

    .order-detail-list{
        .flex();
        .justifyContent(space-around);
        .alignItems(flex-end);
    }
    .order-detail-item{
        .pxRem(padding-top,30);
        .pxRem(padding-bottom,30);
        text-align: center;
        .ico{
            margin: 0 auto;
        }
        .order-item-name{
            display: block;
           .pxRem(margin-top,20);
           .pxRem(font-size,24);
            color: #747474;
        }
    }

</style>
