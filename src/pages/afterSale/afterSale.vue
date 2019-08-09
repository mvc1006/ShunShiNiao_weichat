<template>
    <div class="container">
        <div class="header-top">
            <div class="back">
                <div class="go-back" @click="goBack"></div>
            </div>
            <div class="title">{{title[tipsNum]}}</div>
        </div>
        <div class="tips" v-if="send">
            <img src="../../assets/hint.png" alt>
            <span class="text">{{tips[tipsNum]}}</span>
        </div>
        <div class="pro-details">
            <after-sale-pro v-if="!send" :data="data"></after-sale-pro>
            <div class="mian-goods" v-else>
                <div class="goods-info" @click="openDetails(data)">
                    <div class="goods-info-left">
                        <img class="pro-img" :src="data.goods_pic" alt>
                        <template v-if="data.order_status == 1">
                            <img v-if="data.goods_type == 1" class="small-tag" src="../../assets/orderMainSource.png" alt>
                            <img v-else-if="data.goods_type == 2" class="small-tag" src="../../assets/orderMainLocal.png" alt>
                        </template>
                        <template v-else>
                            <img class="small-tag-main" v-if="data.is_main == 1" src="../../assets/orderMain.png" alt >
                            <img class="small-tag-give" v-else-if="data.is_main == 2" src="../../assets/corner_marker_present.png" alt>
                        </template>
                    </div>
                    <div class="goods-info-right">
                        <p class="goods-name">{{data.goods_name}}</p>
                        <div class="goods-classify">{{data.spec_key_name}}</div>
                        <div class="goods-price" v-if="data.is_main == 1">
                            <span class="goods-now-price">￥{{data.goods_price}}</span>
                            <span
                                class="goods-main-payed"
                                v-if="data.order_status == 2 && data.give_list"
                            >[已付款]</span>
                            <span class="goods-cost-price" v-else>￥{{data.market_price}}</span>
                            <span class="goods-num">×{{data.goods_num}}</span>
                        </div>
                        <div class="goods-detail" v-else>
                            <span class="give-cost-price">￥{{data.market_price}}</span>
                            <span class="give-now-price">￥{{data.goods_price}}</span>
                            <span class="goods-num">×{{data.goods_num}}</span>
                        </div>
                    </div>
                </div>
                <div class="express-way">
                    <span class="express-title">配送方式</span>
                    <template v-if="data.goods_type == 1">
                        <span class="express-name">快递</span>
                        <span class="express-price">{{countExpress(data.express_fee)}}</span>
                    </template>
                    <template v-else>
                        <span class="express-name">线下消费</span>
                    </template>
                </div>
                <!-- 配送状态 -->
                <div class="express-way no-padding" v-if="data.goods_type == 1">
                    <span class="express-title">物流状态</span>
                    <span class="express-name">{{data.order_status | orderStatus}}</span>
                </div>
                <div class="give-goods" v-if="data.give_list">
                    <div class="give-goods-title">
                        <span class="shop-present-big-img"></span>
                        <span class="give-text">已选赠品</span>
                    </div>
                    <ul class="give-list" v-if="data.give_list">
                        <li class="give-item" v-for="(item,index) in data.give_list" :key="index">
                            <div
                                class="left-give-classify local-pro-ico"
                                :class="{'line':item.goods_type == 1}"
                            ></div>
                            <div class="right-give-info">
                                <div class="goods-title" @click="openStore(item)">
                                    <div class="store-ico"></div>
                                    <div class="title-store-name">{{item.shop_name}}</div>
                                    <div class="title-next-ico next-ico"></div>
                                </div>
                                <div class="give-goods-info" @click="openOrderDetails(item)">
                                    <div class="give-goods-info-left">
                                        <img :src="item.goods_pic" alt>
                                    </div>
                                    <div class="give-goods-info-right">
                                        <p class="goods-name">{{item.goods_name}}</p>
                                        <p class="goods-detail">
                                            <span class="give-cost-price">￥{{item.market_price}}</span>
                                            <span class="give-now-price">￥0.00</span>
                                            <span class="give-goods-color">{{item.spec_key_name}}</span>
                                        </p>
                                    </div>
                                </div>
                                <div class="express-way">
                                    <span class="express-title">配送方式</span>
                                    <template v-if="data.goods_type == 1">
                                        <span class="express-name">快递</span>
                                        <span
                                            class="express-price"
                                        >{{countExpress(item.express_fee)}}</span>
                                    </template>
                                    <template v-else>
                                        <span class="express-name">线下消费</span>
                                    </template>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="goods-total">
                    共{{data.goods_num}}件商品
                    <span class="total-money">
                        合计：
                        <span class="money">￥{{data.need_pay_price || data.total_price}}</span>
                    </span>
                    (含快递费{{postPrice(data)}}元)
                </div>
            </div>

            <div class="serve-box" v-if="!send">
                <ul class="serve-list">
                    <li class="serve-item" @click="selectServe(1)" v-if="type != 2">
                        <div class="left-ico">
                            <img src="../../assets/money-back.png" alt>
                        </div>
                        <div class="center-info">
                            <p class="serve-name">仅退款</p>
                            <p class="serve-state">未收到货(包含未签收)，或卖家协商同意前提下</p>
                        </div>
                        <div class="next-ico"></div>
                    </li>
                    <li class="serve-item" @click="selectServe(3)">
                        <div class="left-ico">
                            <img src="../../assets/replace-good.png" alt>
                        </div>
                        <div class="center-info">
                            <p class="serve-name">换货</p>
                            <p class="serve-state">已收到货，需要更换已收到的货</p>
                        </div>
                        <div class="next-ico"></div>
                    </li>
                    <li class="serve-item" @click="selectServe(2)" v-if="type != 2">
                        <div class="left-ico">
                            <img src="../../assets/return-money.png" alt>
                        </div>
                        <div class="center-info">
                            <p class="serve-name">退货退款</p>
                            <p class="serve-state">已收到货，需要退已收到的货</p>
                        </div>
                        <div class="next-ico"></div>
                    </li>
                </ul>
            </div>

            <div class="send-box" v-else>
                <div class="reason" @click="popReason">
                    <span class="text">{{reasonParam.name || (reason[tipsNum]+'原因')}}</span>
                    <span class="next-ico"></span>
                </div>
                <div class="write-reason border-bottom">
                    <h2>说明</h2>
                    <textarea rows="5" placeholder="请在此处编辑说明哦" v-model="textareaVal"></textarea>
                </div>
                <div class="write-reason">
                    <h2>上传凭证</h2>
                    <div class="img-cont">
                        <div class="img-item"
                        v-for="(item,index) in images"
                        :key="index">
                            <img class="img-main" v-gallery="'upload'" :src="item" alt="">
                            <img @click="delNow(index)" class="img-del" src="../../assets/delete.png" alt="">
                        </div>
                        <label for="imgInput">
                            <div class="upload-btn add-img">
                                {{images.length>0?images.length+'/'+upLoadImgNum:'添加照片'}}
                            </div>
                        </label>

                    </div>

                </div>
                <div class="submit" @click="submit">提交</div>
            </div>
        </div>

        <!-- 灰色背景 -->
        <div class="reason-cont-bg" @click="hideReason" v-if="reasonListShow"></div>
        <div class="reason-cont" v-if="reasonListShow">
            <h2>{{reason[tipsNum] + '原因'}}</h2>
            <ul class="reason-list" v-for="(value,key) in reasonList" :key="key">
                <li class="reason-item" @click="checkReason(value,key)">
                    <span class="reason-text">{{value}}</span>
                    <input type="radio" name="reason" :checked="key == reasonParam.id">
                </li>
            </ul>
        </div>
        <pop-up
        v-if="pop.show"
        :type="pop.type"
        :time="pop.time"
        :content="pop.content"
        :cancel="pop.cancel"
        :confirm="pop.confirm"
        @popupconfirm="confirm"
        @popupcancel="cancel"></pop-up>
        <div class="input-file">
            <input id="imgInput" accept="image/*" type="file"/>
        </div>
    </div>
</template>
<script>
import afterSalePro from '@/components/afterSaleProSmall';
import popUp from '@/components/popUp';
import upload from '@/js/upload.js'
export default {
    name: "app",
    data() {
        return {
            data: {},
            send: false,
            tips: [
                "",
                "如有赠品已发货或已使用，建议先联系商家协商解决",
                "如有赠品已发货或已使用，建议先联系商家协商解决",
                "商品存在质量问题，建议先联系商家协商换货"
            ],
            tipsNum: 0, // 1 退款 2 退货 3 换货
            textareaVal: "",
            title: ["选择服务类型", "申请退款", "申请退货", "申请换货"],
            reason: ["", "退款", "退货", "换货"],
            reasonListShow: false,
            reasonList: {},
            reasonParam: {
                id: "",
                name: ""
            },
            pop:{
                show:false,
                type:2,
                time: 3000,
                content:'',
                cancel:'暂不',
                confirm:'确定',
            },
            images:[],
            imgFile:[],
            reader:new FileReader(),
            upLoadImgNum:5,
        };
    },
    filters:{
        orderStatus:function(val){
            let result = '';
            switch(val){
                case 2:
                    result = '未发货';
                break;
                case 3:
                    result = '已发货';
                break;
                case 4:
                    result = '已收货';
                break;
            }
            return result;
        }
    },
    computed: {
        id: function() {
            return this.common.getUrlParam("id");
        },
        type: function() {
            let type = this.common.getUrlParam("type");
            this.tipsNum = type
            return type;
        }
    },
    methods: {
        hideReason(){
            this.reasonListShow = false;
        },
        // 处理物流显示方式
        countExpress(val) {
            if (val == 0) {
                return "免邮";
            } else {
                return val + "元";
            }
        },
        // 计算物流价格
        postPrice(data) {
            let price = Number(data.express_fee);
            if (data.order_status == 2 && data.give_list) {
                price = 0;
            }
            if (data.give_list) {
                for (let i = 0; i < data.give_list.length; i++) {
                    price += Number(data.give_list[i].express_fee);
                }
            }
            return price;
        },
        goBack: function() {
            // 返回
            // 单页面模式  --- send 为true时 隐藏当前temp
            if (this.send) {
                this.send = false;
            } else {
                history.back();
            }
        },
        inputClick(){
            let imgInput = document.getElementById('imgInput');
            const _this = this;
            let i=0;
            imgInput.addEventListener('change',()=>{
                let file = imgInput.files[0];
                i++;
                if (i !== 1) {
                    return false
                } else {
                    i = 0
                    if (file.size / 1024 / 1024 > 10) {
                        this.pop.show = true;
                        this.pop.type = 1;
                        this.pop.content = '图片大小不能超过10MB';
                        return false
                    }
                    if(_this.images.length>=_this.upLoadImgNum){
                        this.pop.show = true;
                        this.pop.type = 1;
                        this.pop.content = '最多只能上传'+_this.upLoadImgNum+'个';
                        return;
                    }
                    upload(file, _this.appendImg,(result)=>{
                        _this.images.push(result);
                    });
                }
            })
        },
        appendImg(fileResize){
            this.imgFile.push(fileResize)
        },
        confirm(){
            this.popStatus();
            let imgData = new FormData()
            imgData.append('refund_type',this.tipsNum);
            imgData.append('order_goods_id',this.id);
            imgData.append('refund_reason_id',this.reasonParam.id);
            imgData.append('refund_reason',this.reasonParam.name);
            imgData.append('refund_desc',this.textareaVal);
            for(let i=0;i<this.imgFile.length;i++){
                imgData.append('images[]', this.imgFile[i]);
            }
            this.dataService.applyReturn(imgData).then(resp => {
                    this.dataService.handleResponse({
                        data: resp,
                        callback: data => {
                            location.href ="./applyReturnSucess.html?id=" +data.order_refund_id +"&type=" +this.tipsNum;
                        }
                    });
                });
        },
        cancel(){
            this.popStatus();
        },
        popStatus(){
            this.$nextTick(()=>{
                this.pop.show = false;
            })
        },
        submit() {
            this.pop.show = true;
            this.pop.type = 2;
            this.pop.content = '您确定要提交此申请吗';
        },
        // 选择是退货 退款 还是 换货
        selectServe(num) {
            this.tipsNum = num;
            this.send = true;
        },
        // 选择原因 弹出选择框
        popReason() {
            this.reasonListShow = true;
            this.getReasonList();
        },
        // 获得订单信息
        getData() {
            this.dataService.orderDetails({
                order_goods_id: this.id
            }).then(resp => {
                this.dataService.handleResponse({
                    data: resp,
                    callback: data => {
                        this.data = Object.assign({}, data.order_info);
                    }
                });
            });
        },
        // 获得原因列表
        getReasonList() {
            this.dataService.returnReason({
                refund_type: this.tipsNum
            }).then(resp => {
                this.dataService.handleResponse({
                    data: resp,
                    callback: data => {
                        this.reasonList = Object.assign({}, data);
                    }
                });
            });
        },
        // 原因选择 然后隐藏选择框
        checkReason(value, key) {
            this.reasonParam.id = key;
            this.reasonParam.name = value;
            this.reasonListShow = false;
        },
        // 打开产品详情
        openDetails(data) {
            const local = data.goods_type == 1 ? 0 : 1;
            const isBuyPresent = data.is_main == 1 ? true : false;
            location.href =
                "./sourceShopDetails.html?id=" +
                data.goods_id +
                "&local=" +
                local +
                "&isBuyPresent=" +
                isBuyPresent;
        },
        delNow(index){
            this.images.splice(index,1);
            this.imgFile.splice(index,1);
        }
    },
    created() {
        this.getData();
    },
    mounted(){
        this.inputClick();
        this.common.goBack(this.goBack);
        this.$eventBus.$on('closePopup',()=>{
          this.pop.show = false;
        })
    },
    components:{
        afterSalePro,
        popUp
    }
};
</script>
<style lang="less">
@import url("../../less/header.less");
@import url('../../less/orderPro.less');
body {
    background: @background-color;
}

.serve-box {
    .pxRem(margin-top, 20);
    background: @white-color;
    .serve-item {
        .pxRem(padding-top, 20);
        .pxRem(padding-bottom, 20);
        .pxRem(padding-left, 16);
        .pxRem(padding-right, 16);
        .flex();
        .alignItems();
        .borderBottom(2);
    }
    .left-ico {
        .pxRem(width, 44);
        .pxRem(height, 44);
        .pxRem(margin-right, 20);
    }
    .center-info {
        .flexGrow(1);
        .serve-name {
            .pxRem(font-size, 24);
            color: @gray-text;
        }
        .serve-state {
            color: @gray-light-text;
            .pxRem(font-size, 20);
        }
    }
}
.tips {
    .flex();
    .flexShrink(0);
    .alignItems();
    .pxRem(padding-left, 24);
    .pxRem(padding-right, 24);
    img {
        .pxRem(width, 28);
        .pxRem(height, 28);
        .pxRem(margin-right, 20);
    }
    .text {
        .pxRem(font-size, 24);
        color: @gray-light-text;
        .pxRem(line-height, 60);
        .flexGrow(1);
    }
}
.pro-details {
    position: relative;
}
.tips + .pro-details {
    margin-top: 0;
    .goods-info,.group-main-goods {
        margin-top: 0;
    }
}
.send-box {
    width: 100%;
    background: @white-color;
    .pxRem(margin-top, 20);
    .reason {
        .pxRem(padding-top, 30);
        .pxRem(padding-bottom, 30);
        .pxRem(padding-left, 16);
        .pxRem(padding-right, 16);
        .borderBottom(2);
        .flex();
        .text {
            .flexGrow(1);
            .pxRem(font-size, 28);
            color: @gray-text;
        }
    }
    .pxRem(margin-bottom,100);
}
.write-reason {
    .pxRem(padding-top, 16);
    .pxRem(padding-right, 16);
    .pxRem(padding-bottom, 16);
    .pxRem(padding-left, 16);
    h2 {
        .pxRem(font-size, 28);
        color: @gray-text;
        font-weight: normal;
        .pxRem(margin-top, 20);
        .pxRem(margin-bottom, 20);
    }
    textarea {
        outline: none;
        border: 0;
        width: 100%;
        .pxRem(font-size, 24);
        color: @gray-light-text;
    }
}
.border-bottom {
    .borderBottom(2);
}
.img-cont{
    .flex();
    .alignItems();
    .flexWrap(wrap);
}
.upload-btn {
    .pxRem(margin-bottom, 20);
    .pxRem(margin-right,20);
    text-align: center;
    color:@CFCFCF;
    .pxRem(font-size,20);
    .pxRem(padding-top,90);
    box-sizing: border-box;
    .flexShrink(0);
}
.submit {
    .pxRem(line-height, 96);
    text-align: center;
    color: @white-color;
    .pxRem(font-size, 28);
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 3;
    width: 100%;
    background: @red-color;
}

.reason-cont-bg {
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.2);
    width: 100%;
    height: 100%;
    z-index: 9;
}
.reason-cont {
    .pxRem(border-top-left-radius, 12);
    .pxRem(border-top-right-radius, 12);
    background: @white-color;
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    z-index: 10;
    h2 {
        .pxRem(font-size, 28);
        color: @gray-text;
        .pxRem(line-height, 100);
        font-weight: normal;
        text-align: center;
    }
    .reason-list {
        .reason-item {
            .flex();
            .alignItems();
            .pxRem(padding-top, 30);
            .pxRem(padding-bottom, 30);
            .pxRem(padding-left, 16);
            .pxRem(padding-right, 16);
            input {
            }
        }
        .reason-text {
            .pxRem(font-size, 28);
            color: @gray-text;
            .flexGrow(1);
        }
    }
}
.mian-goods{
    .pxRem(margin-left,16);
    .pxRem(margin-right,16);
}
.img-item{
    .pxRem(width,142);
    .pxRem(height,142);
    .pxRem(margin-right,20);
    .pxRem(margin-bottom,20);
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
.input-file{
    height: 0;
    line-height: 0;
    overflow: hidden;
    display: none;
}
</style>

