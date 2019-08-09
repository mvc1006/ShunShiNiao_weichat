<template>
    <div class="viewport container">
        <!-- 头部 -->
        <div class="header">
            <span class="go-back" @click="goBack"></span>
            <div class="title">我的收益</div>
            <div class="earnings_total">
                总计: {{income_sum}}
            </div>
        </div>
        <!-- 提示语 -->
        <div class="hint">
            <img src="../../assets/hintTrumpet.png" alt="">
            <span class="">推广用户订单核销之后，推广金立即发放～</span>
        </div>
        <!-- 收益列表 -->
        <scroll ref="scroll" :upBack="upBack" :downBack="downBack" :isEnd="isEnd" v-if="earningsList.length > 0">
            <div class="earnings-list">
                <div class="earnings-item" v-for='(earning,index) in earningsList' :key="index">
                    <div class="earnings-title">
                        <div class="grant-type" :class="earning.is_pay==0?'yellow':'green'" v-text="earning.pay_status"></div>
                        <div class="earnings-time" v-text="earning.pay_time"></div>
                    </div>
                    <div class="promotion earnings-title">
                        <div class="promotion-title">推广金</div>
                        <div class="promotion-price">¥{{earning.commission}}</div>
                    </div>
                    <div class="earnings-people">
                        <div class="people-img"><img :src="earning.avatar" alt=""></div>
                        <div class="people-data">
                            <div class="people-name" v-text="earning.nickname"></div>
                            <div class="order-number">订单编号：{{earning.order_no}}</div>
                            <div class="order-time">下单时间：{{earning.create_time}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </scroll>
        <div class="no-shop mescroll">
            <div v-if="earningsList.length <= 0" class="no-shopList" style="pointer-events: auto;">
                <div class="no-content"></div> 
                <div>暂无相关内容</div>
            </div>
        </div>
    </div>
</template>
<script>
  import scroll from '@/components/scroll';
    export default {
        name:'app',
        data(){
            return {
                isEnd: false, // 分页加载是否结束
                canLoading: true, // 是否加载完成
                pages: 1, // 分页加载
                earningsList: [], // 收益列表
                income_sum: '', // 总计金额
            }
        },
        mounted(){
            this.request();
        },
        methods:{
            // 请求后台
            request(){
                this.dataService.myIncome({
                    page: this.pages,
                }).then((resp) => {
                    this.dataService.handleResponse({
                        data: resp,
                        callback: (data) => {
                            if(this.pages == 1){
                                this.earningsList = [];
                            }
                            if(data.data.length <= 0){
                                this.isEnd = true;
                            }
                            this.income_sum = data.income_sum;
                            this.earningsList = this.earningsList.concat(data.data);
                        }
                    })
                })
            },
            // 返回
            goBack(){
                history.go(-1);
            },
            // 上拉刷新
            upBack(){
                if(this.canLoading){
                    this.pages ++;
                    this.request()
                }
            },
            // 下拉刷新
            downBack(){
                if(this.canLoading){
                    this.pages = 1;
                    this.isEnd = false;
                    this.request()
                }
            }
        },
        components:{
            scroll
        }
    }
</script>
<style lang="less">
    @import url('../../less/common.less');
    *{
        box-sizing: border-box;
    }
    body{
        background: @background-color;
    }
    .viewport{
        max-width: 720px;
        width: 100%;
        margin: 0 auto;
        color: @gray-text;
        .pxRem(font-size,24);
    }
    /* 头部 */
    .header{
        .pxRem(height,96);
        .pxRem(line-height,96);
        .flex();
        .alignItems();
        .justifyContent(space-between);
        .flexShrink(0);
        .borderBottom(1);
        background: @white-color;
        z-index: 99999;
        >.title{
            width: 100%;
            text-align: center;
            .pxRem(font-size,28);
        }
        >.earnings_total{
            position: absolute;
            .pxRem(right,30);
            color: @red-color;
        }
        >.go-back{
            position: absolute;
            .pxRem(left,30);
            .pxRem(width,16);
        }
    }
    // 提示
    .hint{
        .flexShrink(0);
        .flex();
        .alignItems(center);
        .pxRem(padding-left,20);
        .pxRem(padding-right,20);
        .pxRem(line-height,64);
        .pxRem(font-size,22);
        background: @yellow-background;
        color: @yellow-text;
        >img{
            .pxRem(margin-right,8);
        }
    }
    // 收益列表
    .earnings-list{
        .pxRem(padding,20);
        >.earnings-item{
            .pxRem(padding,28);
            .pxRem(margin-bottom,20);
            .pxRem(border-radius,20);
            background-color: @white-color;
            &:last-child{
                margin-bottom: 0;
            }
        }
        // 头部信息
        .earnings-title{
            .flex();
            .justifyContent(space-between);
            .alignItems(center);
            .pxRem(font-size,22);
            color: @gray-light-text;
        }
        .grant-type{
            .pxRem(font-size,28);
        }
        .green{
            color: #A0D610;
        }
        .yellow{
            color: #FF9629
        }
        // 推广金
        .promotion{
            .pxRem(padding-top,10);
            .pxRem(padding-bottom,10);
            .borderBottom(1,@gray-light-text,dashed);
        }
        .promotion-price{
            .pxRem(font-size,32);
            color: @red-color;
        }
        // 个人信息
        .earnings-people{
            .pxRem(padding-top,20);
            .flex();
        }
        .people-img{
            .flexShrink(0);
            .pxRem(width,80);
            .pxRem(height,80);
            .pxRem(margin-right,20);
            border-radius: 50%;
            overflow: hidden;
        }
        .people-data{
            .flexGrow(1);
            .pxRem(font-size,22);
            color: @gray-light-text;
            line-height: 1;
            >div{
                .pxRem(margin-bottom,20);
                &:last-child{
                    margin-bottom: 0;
                }
            }
        }
        .people-name{
            .pxRem(font-size,28);
            color: @gray-text;
        }
    }
    // 暂无商品
    .no-shopList{
        background: @background-color !important;
        color: @gray-light-text;
        .pxRem(font-size,24);
        .pxRem(margin-top,30);
        text-align: center;
    }
</style>

