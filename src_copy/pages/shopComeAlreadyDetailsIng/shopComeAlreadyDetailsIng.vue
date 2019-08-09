<template>
    <div class="container">
        <div class="header-top">
            <div class="back" @click="goBack">
                <div class="go-back"></div>
            </div>
            <div class="title">收益提现</div>
        </div>
       <div class="status-box">
           <div class="line"></div>
           <ul class="status-list">
               <li class="status-item">
                   <span class="circel"></span>发起提现申请</li>
               <li class="status-item">
                   <span class="circel-ico"></span>处理中</li>
               <li class="status-item">
                   <span class="circel"></span>到账成功</li>
            </ul>  
       </div>
       <ul class="info-list" v-if="data.bank_type == 0">
           <li class="info-item">
               <span class="left">提现金额</span>
               <span class="price">￥{{data.amount}}</span>
           </li>
           <li class="info-item">
               <span class="left">服务费</span>
               <span>￥{{data.service_fee_amount}}</span>
           </li>
           <li class="info-item">
               <span class="left">到账银行卡</span>
               <span>{{data.bank_info}}</span>
           </li>
       </ul>
       <ul class="info-list" v-else>
           <li class="info-item">
               <span class="left">提现金额</span>
               <span class="price">￥{{data.amount}}</span>
           </li>
           <li class="info-item">
               <span class="left">到账微信</span>
               <span>{{data.bank_info}}</span>
           </li>
       </ul>
       <div class="sure" @click="sure">完成</div>
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
    computed:{
        id:function(){
            return this.common.getUrlParam('id')
        },
        isTrading(){
          return localStorage.getItem('isTrading')=="true"?true:false;
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
                    area_id: localStorage.getItem('area_id')
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
        },
        sure(){
            location.href = './shopIncome.html';
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
    background: @white-color;
}
.status-box{
    .pxRem(padding-left,30);
    .pxRem(padding-right,30);
    .pxRem(padding-top,30);
    .pxRem(padding-bottom,30);
    position: relative;
    .borderBottom(2);
    .line{
        position: absolute;
        .pxRem(width,2);
        .pxRem(height,228);
        .pxRem(top,40);
        .pxRem(left,30);
        background: @border-color;
        box-sizing: border-box;
    }
}
.status-list{
    .flex(column);
    .justifyContent(space-between);
    .pxRem(height,240);
    .pxRem(margin-left,50);
}
.status-item{
    &:first-child{
        margin:0;
    }
    position: relative;
    .pxRem(line-height,20);
    .circel{
        position: absolute;
        .pxRem(left,-55);
        .pxRem(top,13);
        .pxRem(width,10);
        .pxRem(height,10);
        background:@border-color;
        .borderRadius(5);
    }
    .circel-ico{
        position: absolute;
        .pxRem(left,-63);
        .pxRem(top,-3);
        .pxRem(width,26);
        .pxRem(height,26);
        background: url('../../assets/income-time.png');
        background-size:100%;
    }
}

.info-list{
    .pxRem(margin-top,20);
}
.info-item{
    .flex();
    .alignItems();
    .pxRem(padding-left,30);
    .pxRem(padding-right,30);
    .left{
        .flexGrow(1);
    }
    .pxRem(font-size,24);
    color:@gray-text;
    .price{
        .pxRem(font-size,28);
        color:@gray-text;
    }
}
.sure{
    .pxRem(margin-top,100);
    .pxRem(margin-left,150);
    .pxRem(margin-right,150);
    color:#14760f;
    .border(2,#14760f);
    .borderRadius(8);
    .pxRem(line-height,70);
    text-align: center;
}
</style>
