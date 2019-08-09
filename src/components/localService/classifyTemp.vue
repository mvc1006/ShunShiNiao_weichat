<template>
    <div class="classify-filter">
        <div class="addr-top">
            <div class="back">
                <div class="go-back" @click="goBack"></div>
            </div>
            <div class="title">{{isMain?'本地主商品分类':'本地赠品分类'}}</div>
        </div>
        <div class="classify-main">
            <div class="main-left">
                <ul class="main-left-list">
                    <li class="main-left-item"
                    :class="{'active':keyIndex == 0}"
                    @click="selectBig(0)">全部</li>
                    <li class="main-left-item"
                    :class="{'active':keyIndex == index + 1}"
                    v-for="(item,index) in bigClassify" 
                    :key="index+1"
                    v-text="item.name"
                    @click="selectBig(index+1)"></li>
                </ul>

            </div>
            <div class="main-right">
                <ul class="main-right-list">
                    <li class="main-right-item" 
                    v-for="(item,index) in rightClassify" 
                    :key="index" 
                    @click="checkedClassify(item)">
                        <p class="img-box"><img :src="item.pic" alt=""></p>
                        <p class="text" v-text="item.name"></p>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props:{
        isMain:{
            type:Boolean,
            default:true
        }
    },
    data(){
        return {
            bigClassify:[],
            keyIndex:0
        }
    },
    computed:{
        rightClassify(){
            let arr = [];
            if(this.keyIndex != 0){
                arr = this.bigClassify[this.keyIndex]
            }else{
                for(let i=0;i<this.bigClassify.length;i++){
                    arr.concat(this.bigClassify[i].sub_list);
                }
            }
            return arr;
        }
    },
    methods: {
        goBack(){
            this.$emit('switch');
        },
        selectBig(index){
            this.keyIndex = index;
        },
        checkedClassify(val){
           this.$emit('switch',val);
        },
        getList(){
            const region = this.$store.state.city.city_id;
            this.dataService.getClassifyList({
                goods_type:2,
                region_id:region
            }).then(resp=>{
                this.dataService.handleResponse({
                    data:resp,
                    callback:(data)=>{
                        this.bigClassify = data;
                    }
                })
            })
        }
    },
    created(){
        this.getList();
    }
}
</script>
<style lang="less">
@import url('../../less/common.less');
.classify-filter{
    position:absolute;
    top:0;
    left:0;
    width:100%;
    height:100%;
    background:@white-color;
    z-index:100;
    .flex(column);
}
.classify-main{
    .flexGrow(1);
    .flex();
    overflow: hidden;
    height: 100%;
}
.main-left{
    .flexGrow(0);
    .flexShrink(0);
    .pxRem(width,160);
    .borderRight(2);
    height: 100%;
    overflow: scroll;
}
.main-right{
    .flexGrow(1);
    height: 100%;
    overflow: scroll;
    
}

.main-left-list{
    .pxRem(padding-top,8);
    .pxRem(padding-bottom,8);
}
.main-left-item{
    .pxRem(margin-top,24);
    .pxRem(margin-bottom,24);
    text-align: center;
    .pxRem(font-size,24);
    color: @gray-text;
}
.active{
    color: @red-color;
}
.main-right-list{
    .flex();
    .alignItems();
    .flexWrap(wrap);
    .justifyContent(space-around);
    &:after {
        content: "";
        flex: auto;
    }
}
.main-right-item{
    width: 30%;
    img{
        .pxRem(width,144); 
        .pxRem(height,144);
        .pxRem(margin-top,32)
    }
    .img-box{
        text-align: center;
    }
    .text{
        .pxRem(font-size,24);
        color: @simple-gray-color;
        text-align: center;
        .pxRem(padding-top,16);
        .pxRem(padding-bottom,16);
    }
}

.addr-top{
    background: @white-color;
    .pxRem(padding-left,20);
    .pxRem(padding-right,20);
    .flexGrow(0);
    .borderBottom(2,@border-color);
    .flex();
    .alignItems();
    .back{
        .flexGrow(0);
        .pxRem(width,80);
        height: 100%;
    }
    .title{
        .flexGrow(1);
        .pxRem(line-height,100);
        text-align: center;
        .text;
    }
    .add-new{
        .flexGrow(0);
        .pxRem(line-height,100);
        text-align: right;
        .text;
    }
    .save-new{
        .pxRem(font-size,24);
        color: #D33525;
    }
    .text{
        .pxRem(font-size,28);
        color:@gray-text;
    }
}

</style>
