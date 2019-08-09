<template>
<div class="container">
    <div class="header-top">
        <div class="back" @click="goBack">
            <div class="go-back"></div>
        </div>
        <div class="title">物流信息</div>
    </div>
    <div class="exppress">
        <div class="left-img">
            <img :src="orderInfo.goods_pic" alt="">
            <p>{{orderInfo.goods_num}}件商品</p>
        </div>
        <div class="right-info">
            <h2>{{orderInfo.state_desc}}</h2>
            <p>{{orderInfo.express_name+':'+orderInfo.express_no}} <img @click="amendLogistics" src="../../assets/amendLogistics.png"/></p>
            <p>订单编号：{{orderInfo.order_goods_no}}</p>
            <!-- <p>官方电话：<a href="tel:1235456525">1235456525</a></p> -->
        </div>
    </div>
    <div class="pro-info">
        <!-- 收货地址 -->
        <div class="site">
            <img class="site-img" src="../../assets/site-img.png" alt>
            <div class="site-data">
                <!-- 收货人 -->
                <div class="consignee">
                    <!-- <div class="consignee-title">收货人:</div> -->
                    <div class="consignee-data">
                        <span>{{address.consignee}}</span>
                        <span>{{address.telephone}}</span>
                    </div>
                </div>
                <div class="consignee consignee-site">
                    <!-- <div class="consignee-title">收货地址:</div> -->
                    <div class="consignee-data">
                        <span>{{address.province}}{{address.city}}{{address.county}}{{address.address}}</span>
                    </div>
                </div>
            </div>
        </div>
        <!-- 物流信息 -->
        <div class="express-info">
            <ul class="express-list">
                <li class="express-item" v-for="(item,index) in expressDetails" :key="index">
                    <div class="left-time">
                        <p class="month">{{initTime(item.time,0)}}</p>
                        <p class="time">{{initTime(item.time,1)}}</p>
                        <p class="cirle"></p>
                    </div>
                    <div class="right-status">
                        <p class="status">{{item.state_desc}}</p>
                        <p class="address">{{item.context}}</p>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</div>
</template>

<script>
export default {
    name:'app',
    data(){
        return {
            orderInfo:{},
            address:{},
            expressDetails:[]
        }
    },
    computed: {
        id(){
            return this.common.getUrlParam('id')
        },
        order_goods_no(){
            return this.common.getUrlParam('order_goods_no')
        },
        order_no(){
            return this.common.getUrlParam('order_no')
        }
    },
    methods:{
        goBack(){
            history.back();
        },
        initTime(val,num){
            return val.split(' ')[num]
        },
        getData(){
            console.log(this.id)
            this.dataService.getExpress({
                order_goods_id: this.id
            }).then(resp=>{
                this.dataService.handleResponse({
                    data:resp,
                    callback:(data)=>{
                        console.log(data)
                        this.orderInfo = data.order_info
                        this.address = data.user_address_info
                        this.expressDetails = data.express_info_list
                    }
                })
            })
        },
        // 修改物流
        amendLogistics(){
            window.location.href = './storeShipments.html?order_no='+this.order_no+'&order_goods_no='+this.order_goods_no + '&amend=1'; // 是否为修改物流
        },
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
    .pxRem(font-size,24);
}
.exppress{
    .flex();
    .flexShrink(0);
    .pxRem(margin-left,16);
    .pxRem(margin-right,16);
    .pxRem(margin-top,20);
    .pxRem(margin-bottom,20);
    .pxRem(padding-top,20);
    .pxRem(padding-bottom,20);
    .pxRem(padding-left,16);
    .pxRem(padding-right,16);
    background: @white-color;
    .borderRadius(8);
}
.left-img{
    .pxRem(width,180);
    .pxRem(height,180);
    .borderRadius(8);
    overflow: hidden;
    position: relative;
    img{
        width: 100%;
        height: 100%;
    }
    p{
        position: absolute;
        left: 0;
        bottom: 0;
        background: rgba(0, 0, 0, .3);
        width: 100%;
        .pxRem(line-height,40);
        .pxRem(font-size,20);
        color: @white-color;
        text-align: center;
    }
}
.right-info{
    .flex(column);
    .pxRem(margin-left,16);
    h2{
        .pxRem(font-size,28);
        color: @red-color;
        .pxRem(margin-bottom,18);
    }
    p{
        .flex();
        .alignItems(center);
        .pxRem(margin-bottom,18);
        .pxRem(font-size,20);
        color: @gray-light-text;
        .pxRem(line-height,32);
        >img{
            .pxRem(margin-left,15);
            .pxRem(width,31);
        }
    }
}

.pro-info{
    .pxRem(margin-left,16);
    .pxRem(margin-right,16);
    background: @white-color;
    .borderRadius(8);
    .pxRem(padding-left,16);
    .pxRem(padding-left,16);
    .flexGrow(1);
    overflow: auto;
}


.express-info{
    .pxRem(padding-top,30);
    .pxRem(padding-bottom,30);
    .borderTop(2,@border-color,dashed);
}
.express-list{
    margin: 0;
    .express-item{
        .flex();
        
        .left-time{
            .flexShrink(0);
            .flexGrow(0);
            .pxRem(padding-right,16);
            text-align: right;
            .pxRem(min-width,120);
            position: relative;
            color: @gray-light-text;
            .month{
                .pxRem(font-size,24);
            }
            .time{
                .pxRem(font-size,20);
            }
            .cirle{
                .pxRem(width,10);
                .pxRem(height,10);
                .borderRadius(5);
                background: @border-color;
                position: absolute;
                .pxRem(right,-5);
                .pxRem(top,12);
                z-index: 3;
            }
        }
        .right-status{
            .flexGrow(1);
            color:@gray-light-text;
            .status{
                .pxRem(padding-left,16);
            }
            .address{
                .pxRem(padding-left,16);
                .borderLeft(2);
                .pxRem(min-height,100);
            }
        }
        &:first-child{
            .left-time{
                color: @gray-text;
                .cirle{
                    background: @red-color;
                }
            }
            .right-status{
                color: @gray-text;
            }
        }
    }
}


// 收货地址
.site{
  .flex();
  justify-content: space-between;
  align-items: center;
  .pxRem(padding-left,20);
  .pxRem(padding-right,20);
  .pxRem(padding-top,32);
  .pxRem(padding-bottom,32);
  .pxRem(margin-top,20);
  .pxRem(min-height,120);
  background: @white-color;
  color: @gray-light-text;
}
.site>img{
  flex-shrink: 0;
}
.site-img{
  .pxRem(width,44);
  .pxRem(height,44);
}
.select-site{
  .pxRem(width,28);
  .pxRem(height,28)
}
// 收货地址信息
.consignee{
  line-height: 1;
  .flex();
  color: @gray-text;
  .pxRem(margin-bottom,10);
  .pxRem(font-size,22)
}
.consignee-data{
  .flex();
  justify-content: space-between;
  flex-grow: 1;
}
.site-data{
  flex-grow: 1;
  .pxRem(padding-left,16);
  .pxRem(padding-right,30)
}
.consignee-site{
  .pxRem(line-height,32);
//   .pxRem(font-size,20)
}
</style>
