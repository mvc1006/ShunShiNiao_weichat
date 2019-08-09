<template>
    <div class="list-cont">
        <p class="time-title">{{time}}</p>
        <ul class="info-list">
            <li class="info-item" v-for="(item,index) in data" :key="index" @click="openStoreDetails(data)">
                <p class="item-top">
                    <span class="left">{{item.balance_desc}}</span>
                    <span class="right">{{item.amount}}</span>
                </p>
                <p class="item-bottom">{{item.create_time}}</p>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    props:{
        data:{
            type:Array,
            default:()=>{
                return [];
            }
        },
        time:{
            type:String
        }
    },
    data(){
        return {}
    },
    methods:{
        openStoreDetails(data){
            
        }
    }
}
</script>
<style lang="less">
@import url('../../less/common.less');
.time-title{
    .pxRem(line-height,54);
    color: @gray-light-text;
    .pxRem(padding-left,30);
    .pxRem(padding-right,30);
}
.info-list{
    background:@white-color;
    .pxRem(padding-left,30);
    .pxRem(padding-right,30);
}
.info-item{
    .borderBottom(2);
    .pxRem(padding-top,20);
    .pxRem(padding-bottom,20);
    &:last-child{
        border:0;
    }
    .item-top{
        .flex();
        .alignItems();
        .pxRem(line-height,48);
        color:@gray-text;
        .pxRem(font-size,24);
        .right{
            .flexGrow(1);
            text-align: right;
        }
    }
    .item-bottom{
        .pxRem(line-height,40);
        color:@gray-light-text;
        .pxRem(font-size,20);
    }
}
</style>
