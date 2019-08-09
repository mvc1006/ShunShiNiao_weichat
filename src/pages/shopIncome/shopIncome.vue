<template>
    <div class="shopInCome">
        <div class="income-top">
            <div class="header">
                <div class="back" @click="goBack">
                    <img src="../../assets/white-back.png" alt="">
                </div>
                <div class="title">收入资产</div>
            </div>
            <div class="money">
                <p class="tips-text"  v-text='isTrading?"账户余额":"可用余额"'></p>
                <p class="money-num">
                    <span class="num">{{common.toFixed(data.balance || 0)}}</span>
                    <span class="go-details" @click="incomeDetails">明细></span>
                </p>
                <p class="deposit-btns" @click="goIncome">提现</p>
            </div>
        </div>
        <div class="list-cont">
            <div class="cont-title" v-if="!isTrading">
                <span class="block-color">待结算(元)</span>
                <span class="red-color text-right">{{common.toFixed(data.settling_balance + data.dealing_balance)}}</span>
                <div class="right" @click="toggleDetails">
                    <img v-if="detailsShow" class="down" src="../../assets/advance.png" alt="">
                    <img v-else class="up" src="../../assets/advance.png" alt="">
                </div>
            </div>
            <ul class="list-info" v-show="detailsShow" v-if='!isTrading'>
                <li class="list-item" @click="goList(0)">
                    <div class="left">
                        <p class="block-color">交易中(元)</p>
                        <p class="gray-color">可用余额(元)</p>
                    </div>
                    <div class="center red-color text-right">
                        {{common.toFixed(data.dealing_balance)}}
                    </div>
                    <div class="right">
                        <img src="../../assets/advance.png" alt="">
                    </div>
                </li>
                 <li class="list-item" @click="goList(1)">
                    <div class="left">
                        <p class="block-color">结算中</p>
                        <p class="gray-color remark">注：工作日可提现,24小时内到账,节假日顺延。</p>
                    </div>
                    <div class="center red-color text-right">
                        {{common.toFixed(data.settling_balance)}}
                    </div>
                    <div class="right">
                        <img src="../../assets/advance.png" alt="">
                    </div>
                </li>
            </ul>
            <div class="cont-bottom" @click="comeAlready">
                <div class="left block-color">已提现(元)</div>
                <div class="center red-color text-right">{{common.toFixed(data.cash_apply_amount)}}</div>
                <div class="right"><img src="../../assets/advance.png" alt=""></div>
            </div>
        </div>
        <!-- <div class="bank" @click="myBank(data.bank_info)">
            <span class="block-color left">我的银行卡</span>
            <span class="gray-color" v-if="!data.bank_info">未绑定</span>
            <span class="gray-color" v-else>已绑定</span>
        </div> -->
         <div class="bank" @click="myWechat(data.wxbank_info)">
            <span class="block-color left">我的提现微信</span>
            <span class="gray-color" v-if="!data.wxbank_info">未完善信息</span>
            <span class="gray-color" v-else>已完善</span>
        </div>
        <popUp v-if="isPopUp" :type="1" :time="popupTime" :content="popContent"></popUp>
    </div>
</template>

<script>
  import popUp from '@/components/popUp.vue'
export default {
    name:'app',
    data(){
        return {
            popContent: '', // 提示文字
            isBind:false,
            data:{},
            popupTime: 3000,
            isPopUp: false,
            detailsShow:true
        }
    },
    methods:{
        toggleDetails(){
            this.detailsShow = !this.detailsShow;
        },
        goBack(){
            location.href = 'storeHome.html';
        },
        myBank(value){
            if(value){
                location.href = './shopMyBank.html';
            }else{
                 if(this.data.is_set_cash_pwd){
                    location.href = './shopBindBank.html';
                }else{
                    location.href = './shopSetPsw.html';
                }
            }
        },
        // 绑定微信
        myWechat(value){
            if(value){
                location.href = './shopMyWechat.html';
            }else{
                 if(this.data.is_set_cash_pwd){
                    location.href = './shopBindWechat.html';
                }else{
                    location.href = './shopSetPsw.html';
                }
            }
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
        goList(value){
            location.href = './shopClosing.html?type='+value;
        },
        comeAlready(){
            // if(this.isTrading){
            //     location.href = './merchantDealDetail.html?pageType=extract';
            //     return false;
            // }
            location.href = './shopComeAlready.html';
        },
        incomeDetails(){
            if(this.isTrading){
                location.href = './merchantDealDetail.html?pageType=detail';
                return false;
            }
            location.href = './shopIncomeDetails.html';
        },
        goIncome(){
            if(this.data.wxbank_info){
                if(this.data.shop_count<30){
                    this.popContent = '当前商圈不满30个商家，不可提现哦~';
                    this.isPopUp = true;
                    return false
                }
                location.href = './shopGoIncome.html';
            }else{
                this.popContent = '请先绑定提现微信';
                this.isPopUp = true;
            }
        }
    },
    mounted(){
        var that = this;
        this.common.goBack(this.goBack);
        // 关闭提示框
        this.$eventBus.$on("closePopup",function(){
          that.isPopUp = false;
        });
    },
    computed: {
        isTrading(){
          return localStorage.getItem('isTrading')=="true"?true:false;
        }
    },
    created(){
        this.getData();
    },
    components:{
        popUp
    }
}
</script>


<style lang="less">
@import url('../../less/common.less');
body{
    background: @background-color;
}
.income-top{
    width: 100%;
    background: url('../../assets/income-header-bg.png') top left no-repeat;
    background-size: 100%;
}
.header{
    .flex();
    .alignItems();
    .pxRem(padding-left,20);
    .pxRem(padding-right,20);
    .back{
        .pxRem(width,50);
        .pxRem(height,50);
        img{
            width:100%;
            height:100%;
        }
    }
    .title{
        .flexGrow(1);
        color:@white-color;
        .pxRem(font-size,28);
        .pxRem(line-height,96);
        text-align: center;
    }
}
.money{
    background: @white-color;
    .borderRadius(12);
    .pxRem(padding-top,70);
    .pxRem(padding-bottom,70);
    .pxRem(padding-left,40);
    .pxRem(padding-right,40);
    .pxRem(margin-top,30);
    .pxRem(margin-left,30);
    .pxRem(margin-right,30);
     box-shadow: 0 3px 5px @gray-light-text;
    .tips-text{
        color: @gray-light-text;
        .pxRem(font-size,24);
    }
    .money-num{
        .pxRem(margin-top,30);
        .pxRem(margin-bottom,30);
        .flex();
        .alignItems();
        .num{
            color: @gray-text;
            .pxRem(font-size,40);

        }
        .go-details{
            .flexGrow(1);
            text-align: right;
            .pxRem(font-size,24);
            color: #c37624;
        }
    }
    .deposit-btns{
        background: @red-color;
        color:@white-color;
        text-align:center;
        .pxRem(line-height,60);
        .pxRem(font-size,24);
        .borderRadius(10);
    }
}

.list-cont{
    background:@white-color;
    .pxRem(padding-left,40);
    .pxRem(margin-top,20);
}

.cont-title{
    .flex();
    .alignItems();
    .pxRem(padding-top,30);
    .pxRem(padding-bottom,20);
    .right{
        .pxRem(width,16);
        .pxRem(height,28);
        .pxRem(margin-left,30);
        .pxRem(margin-right,80);
        img{
            width: 100%;
            height: 100%;
            display:block;
        }
    }

}
.cont-bottom{
    .flex();
    .alignItems();
    .borderTop(2);
    .right{
        .pxRem(width,16);
        .pxRem(height,28);
        .pxRem(margin-left,30);
        .pxRem(margin-right,80);
        img{
            width: 100%;
            height: 100%;
            display:block;
        }
    }
}
.down{
    transform:rotate(90deg);
    -ms-transform:rotate(90deg); 	/* IE 9 */
    -moz-transform:rotate(90deg); 	/* Firefox */
    -webkit-transform:rotate(90deg); /* Safari 和 Chrome */
    -o-transform:rotate(90deg); 	/* Opera */
}
.up{
    transform:rotate(-90deg);
    -ms-transform:rotate(-90deg); 	/* IE 9 */
    -moz-transform:rotate(-90deg); 	/* Firefox */
    -webkit-transform:rotate(-90deg); /* Safari 和 Chrome */
    -o-transform:rotate(-90deg); 	/* Opera */
}
.text-right{
    .flexGrow(1);
    text-align: right;
}
.list-info{
    .pxRem(padding-left,20);
    .borderTop(2);
}
.list-item{
    .flex();
    .alignItems();
    .pxRem(padding-right,80);
    .pxRem(padding-top,15);
    .pxRem(padding-bottom,15);
    .right{
        .pxRem(width,16);
        .pxRem(height,28);
        .pxRem(margin-left,30);
        img{
            width: 100%;
            height: 100%;
            display:block;
        }
    }
}
.bank{
    background: @white-color;
    .pxRem(padding-right,80);
    .pxRem(padding-left,40);
    .pxRem(padding-top,30);
    .pxRem(padding-bottom,30);
    .pxRem(margin-top,20);
    .flex();
    .alignItems();
    .left{
        .flexGrow(1);
    }
}

.block-color{
    color:@gray-text;
    .pxRem(font-size,28);
    .pxRem(line-height,44);
}
.gray-color{
    color:@gray-light-text;
    .pxRem(font-size,24);
    .pxRem(line-height,40);
}
.remark{
	.pxRem(font-size,18);
}
.red-color{
    color: @red-color;
    .pxRem(line-height,40);
}
</style>
