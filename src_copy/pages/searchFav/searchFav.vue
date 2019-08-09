<template>
<div class="container">
    <div class="fav-top">
        <div class="back">
            <div class="go-back" @click="goBack"></div>
        </div>
        <div class="show-search">
            <div class="search-box">
                <img src="../../assets/search.png" alt="">
                <input type="text" placeholder="请输入要搜索的内容" @click.stop="searchIn" v-model="searchValue">
                <!-- <div class="clear-search" @click="clearInput" v-show="clearBtn">×</div> -->
            </div>
            <div class="cancel" @click="cancleSearch">取消</div>
        </div>
    </div>
    <!-- <ul class="tab-list">
        <router-link to="/goods" tag="li" class="tab-item">商品</router-link>
        <router-link to="/store" tag="li" class="tab-item">店铺</router-link>
    </ul> -->
    <ul class="tab-list">
        <li class="tab-item" :class="{'active': menuNum==0}" @click="cutMenu(0)">商品</li>
        <li class="tab-item" :class="{'active': menuNum==1}" @click="cutMenu(1)">店铺</li>
    </ul>
    <router-view></router-view>
</div>
</template>
<script>
export default {
    name:'app',
    data(){
        return {
            menuNum: 0,
            // clearBtn:false
        }
    },
    computed:{
        searchValue(){
            return decodeURIComponent(this.common.getUrlParam('search')) || '';
        }
    },
    mounted(){
        let path = this.$route.path;
        console.log(path)
        if(path == '/goods'){
            this.cutMenu(0);
        }else{
            this.cutMenu(1)
        }
        // this.common.goBack(this.goBack);
    },
    methods:{
        goBack:function(){ // 返回
            window.history.go(-2);
            // location.href = './myFav.html'
        },
        cancleSearch(){ // 取消搜索
            this.goBack();
        },
        cutMenu(num){
            this.menuNum = num;
            if(num == 0){
                this.$router.replace("/goods")
            }else{
                this.$router.replace("/store")
            }
        },
        clearInput(){
            this.searchValue = '';
        },
        searchIn(){
            window.history.go(-1);
        }
    }
}
</script>
<style lang="less">
    @import url('../../less/common.less');
    body{
        background: @background-color;
    }

    .tab-list{
        .flex();
        background: @white-color;
    }
    .tab-item{
        .pxRem(font-size,28);
        .pxRem(line-height,64);
        .flexGrow(1);
        .borderBottom(2);
        text-align: center;
        &.active{
            .borderBottom(2,@red-color);
            color: @red-color;
        }
    }

    .fav-top{
        .flexGrow(0);
        .flexShrink(0);
        background: @white-color;
        .pxRem(padding-left,20);
        .pxRem(padding-right,20);
        .pxRem(height,96);
        .flexGrow(0);
        .flex();
        .alignItems();
        .back{
            .flexGrow(0);
            .pxRem(width,40);
        }
    }
    .show-search{
        .flexGrow(1);
        .flex();
        .alignItems();
        .cancel{
            .flexGrow(0);
            .pxRem(min-width , 48);
            .pxRem(font-size,24);
            color: @gray-text;
        }
    }
    .search-box{
        background: #F2F1F0;
        .borderRadius(12);
        .flexGrow(1);
        .pxRem(height,64);
        .pxRem(padding-left,32);
        .pxRem(padding-right,12);
        .pxRem(margin-left,16);
        .pxRem(margin-right,16);
        .flex();
        .alignItems();
        img{
            .pxRem(width,24);
            .pxRem(height,24);
            .pxRem(margin-right,16);
            .flexGrow(0);
        }
        input{
            .flexGrow(1);
            .pxRem(line-height, 64);
            color: @gray-light-text;
            .pxRem(font-size,24);
            outline: none;
            border: 0;
            background: none;
        }
        .clear-search{
            text-align: center;
            .pxRem(width,24);
            .pxRem(height,24);
            .pxRem(line-height,24);
            .pxRem(font-size,24);
            color: @white-color;
            background: #A09FA0;
            .borderRadius(20);
        }
    }
    .fav-bottom-manage{
        .flexGrow(0);
        .pxRem(height,96);
        background: @white-color;
        .flex();
        .alignItems();
    }
    .left-select{
        .flexShrink(0);
        .pxRem(margin-left,16);
        .pxRem(width,32);
        .pxRem(height,32);
    }
    .select-all{
        .pxRem(margin-left,16);
        .pxRem(font-size,24);
        color: @simple-gray-color;
        .flexGrow(1);
    }
    .ai-clear{
        .pxRem(width,160);
        .pxRem(line-height,64);
        text-align: center;
        color: @CFCFCF;
        .border(2);
        .borderRadius(32);
    }
    .del{
        .pxRem(width,160);
        .pxRem(line-height,64);
        .pxRem(margin-left,16);
        .pxRem(margin-right,16);
        text-align: center;
        color:@white-color;
        background: @red-color;
        .border(2,@red-color);
        .borderRadius(32);
    }
    .no-data-text{
        color: @gray-light-text;
        .pxRem(font-size,24);
        text-align: center;
        .pxRem(margin-top,100)
    }
</style>

