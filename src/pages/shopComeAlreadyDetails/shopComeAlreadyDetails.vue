<template>
    <div class="container">
        <div class="header-top">
            <div class="back" @click="goBack">
                <div class="go-back"></div>
            </div>
            <div class="title">提现明细</div>
        </div>
        <div class="details-info">
            <div class="details-top">
                <p class="text" v-if="data.apply_status == 0">提现金额(申请中)</p>
                <p class="text" v-else-if="data.apply_status == 1">提现金额(已完成)</p>
                <p class="text" v-else-if="data.apply_status == 2">提现金额(已拒绝)</p>
                <p class="price">￥{{data.amount}}</p>
            </div>
            <div class="details-center">
                <p class="back">{{data.bank_info}}</p>
                <p class="name">收款人：{{data.account_name}}</p>
                <p class="time">提现时间：{{data.create_time}}</p>
                <p class="time" v-if="data.apply_status == 2">拒绝原因：{{data.remark}}</p>
            </div>
        </div>
        <ul class="bottom-list">
            <li class="bottom-item">
                <p class="left">提现</p>
                <p class="price">{{data.real_pay_amount}}</p>
            </li>
            <li class="bottom-item">
                <p class="left">服务费</p>
                <p class="price">{{data.service_fee_amount}}</p>
            </li>
        </ul>
    </div>
</template>

<script>

export default {
    name:'app',
    data(){
        return {
            data:{}
        }
    },
    methods:{
        goBack(){
            history.back();
        },
        getData(load){
            this.canLoading = false;
            if(this.isTrading){
                this.dataService.areaerCashApplyFlowDetail({
                    cash_apply_flow_id:this.id,
                    area_id: localStorage.getItem("area_id")
                }).then(resp=>{
                    this.dataService.handleResponse({
                        data:resp,
                        callback:(data)=>{
                            this.data = data;
                        }
                    })
                });
                return false
            }
            this.dataService.shopComeAlreadyDetails({
                cash_apply_flow_id:this.id
            }).then(resp=>{
                this.dataService.handleResponse({
                    data:resp,
                    callback:(data)=>{
                        this.data = data;
                    }
                })
            })
        }
    },
    computed: {
        isTrading(){
          return localStorage.getItem('isTrading')=="true"?true:false;
        },
        id:function(){
            return this.common.getUrlParam('id')
        }
    },
    created(){
        this.getData();
    }

}
</script>


<style lang="less">
@import url('../../less/header.less');
body{
    background: @background-color;
}
.details-info{
    background:@white-color;
}
.details-top{
    .pxRem(padding-top,40);
    .pxRem(padding-bottom,40);
    .borderBottom(2);
    text-align: center;
    .text{
        .pxRem(font-size,26);
        color:@gray-text;
        .pxRem(line-height,40);
    }
    .price{
        .pxRem(font-size,40);
        color:@red-color;
        .pxRem(line-height,70);
    }
}
.details-center{
    .pxRem(padding-left,40);
    .pxRem(padding-top,40);
    .pxRem(padding-bottom,40);
    p{
        color: @gray-text;
        .pxRem(font-size,24);
        .pxRem(line-height,42)
    }
}
.bottom-list{
    .pxRem(margin-top,20);
    background:@white-color;
    .pxRem(padding-left,40);
    .pxRem(padding-right,40);
}
.bottom-item{
    .flex();
    .alignItems();
    color:@gray-text;
    &:first-child{
        .pxRem(padding-top,30);
    }
    .pxRem(padding-bottom,30);
    .price{
        .flexGrow(1);
        text-align: right;
    }
}
</style>
