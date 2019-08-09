<template>
    <div class="classify-cont">
        <ul class="classify-list">
            <li class="classify-item"
            v-for="(val,index) in list"
            :key="index"
            @click="itemClick(val)">
                <p class="item-img"><img :src="val.pic" alt=""></p>
                <p class="item-text" v-text="val.name"></p>
            </li>
            <li class="classify-item" @click="itemClick()" v-show="list.length>0">
                <p class="item-img"><img src="../../assets/local_classify_ico1.png" alt=""></p>
                <p class="item-text">更多</p>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    props:{
        list:{
            type:Array,
            default:function(){
                return []
            }
        }
    },
    data(){
        return {
        }
    },
    methods:{
        itemClick(val){
            const path = this.$route.path;
            let title = '',id='', href = '';
            if(path == '/main'){
                title = 1
            }else if(path == '/goods'){
                title = 2
            }
            if(val){
                id = val.id;
                href = 'searcResult.html?goods_type=2&tab_type='+ title +'&page=classifAll&bigId='+id;
            }else{
                id = this.list[0].id;
                href = './classifyAll.html?title='+ title + '&goods_type=2&id='+id;
            }
            sessionStorage.removeItem('classifyAddress');
            location.href = href;
        }
    }
}
</script>

<style lang="less">
   @import url('../../less/common.less');
    .classify-cont{
        background: @white-color;
        // .pxRem(margin-top,16);
    }
    .classify-list{
        .pxRem(padding-bottom,30);
        .flex();
        .justifyContent(space-around);
        .alignContent();
        .flexWrap(wrap);
        width: 100%;
    }
    .classify-item{
        .flexShrink(0);
        min-width: 18%;
        .pxRem(margin-top,30);
        p{
            text-align: center;
        }
        .item-img{
            .pxRem(margin-bottom,15);
            img{
                .pxRem(width,80);
                .pxRem(height,80);
            }
        }
        .item-text{
            .pxRem(font-size,24);
            .pxRem(line-height,40);
            color: @simple-gray-color;
        }
    }

</style>
