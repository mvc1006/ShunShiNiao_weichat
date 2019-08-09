<template>
<div style="height:100%;width:100%">
    <div class="container"  v-if="!showClear">
        <div class="header-top">
            <div class="back">
                <div class="go-back" @click="goBack"></div>
            </div>
            <div class="show-list" v-if="!isSearch">
                <ul class="tab-list">
                    <router-link to="/goods" tag="li" class="tab-item">商品</router-link>
                    <router-link to="/store" tag="li" class="tab-item">店铺</router-link>
                </ul>
                <div class="search-btn" @click="goSearch">
                    <div class="search-img"></div>
                </div>
                <div class="set-btn" @click="manage">{{manageText}}</div>
            </div>
            <div class="show-search" v-else>
                <div class="search-box">
                    <img src="../../assets/search.png" alt="">
                    <input type="text" placeholder="请输入要搜索的内容" @click="searchIn" v-model="searchValue">
                    <div class="clear-search" @click="clearInput" v-show="clearBtn">×</div>
                </div>
                <div class="cancel" @click="cancleSearch">取消</div>
            </div>
        </div>
        <router-view></router-view>
        <div class="fav-bottom-manage" v-show="getManage">
            <div class="left-select" >
                <input type="checkbox" @click="checkAllClick(false)" :checked="getCheckedAll">
            </div>
            <div class="select-all">全选</div>
            <div class="ai-clear" @click="openClear">智能清理</div>
            <div class="del" @click="delChecked">删除</div>
        </div>
        <pop-up v-if="popShow"
        @popupconfirm="confirm"
        @popupcancel="cancel"
        :type="pop.type"
        :content="pop.content"
        :cancel="pop.cancel"
        :confirm="pop.confirm"></pop-up>
    </div>
    <ai-clear v-else></ai-clear>
</div>
</template>
<script>
import popUp from '@/components/popUp.vue'
import {mapGetters} from 'vuex';
import aiClear from '@/components/myFav/aiClear'
export default {
    name:'app',
    data(){
        return {
            showClear:false,
            isSearch:false,
            clearBtn:false,
            searchValue:'',
            manageText:'管理',
            popShow:false,
            pop:{
                type:2,
                content:'您确定删除收藏吗？',
                cancel:'取消',
                confirm:'删除'
            }
        }
    },
    computed:{
        ...mapGetters(['getManage','getCheckedAll'])
    },
    mounted(){
        this.init();
    },
    methods:{
        // 初始化
        init(){
            this.$eventBus.$on('hideClear',()=>{
                this.showClear = false;
            }).$on('delSuccess',()=>{
                this.pop.type = 1;
                this.pop.time = 2000;
                this.pop.content='删除成功';
                this.popShow = true;
            }).$on('closePopup',()=>{
                this.$nextTick(()=>{
                    this.popShow = false;
                })
            })
            this.common.goBack(this.goBack);
        },
        // 管理manage
        manage(){
            this.$store.dispatch('manage');
            if(this.getManage){
                this.manageText = '完成';
            }else{
                // 返回时 清空所有选中状态
                this.checkAllClick(true);
                this.manageText = '管理';
            }
        },
        goBack:function(){ // 返回
            location.href = './personCenter.html'
        },
        goSearch(){ // 搜索
            location.href = './search.html?come=searchFav';
            // this.isSearch = true;
        },
       cancleSearch(){ // 取消搜索
           this.isSearch = false;
       },
       clearInput(){
           this.$store.dispatch('search','');
           this.searchValue = '';
       },
       checkAllClick(val){
           this.$store.dispatch('checkedAll',val);
           this.$eventBus.$emit('checkedAll');
       },
       delChecked(){
           this.pop.type = 2;
           this.pop.content='您确定删除收藏吗？';
           this.popShow = true;
       },
       confirm(){
           this.$eventBus.$emit('del');
       },
       cancel(){
           this.$nextTick(()=>{
               this.popShow = false
           })
       },
       searchIn(){
           location.href = './search.html?come=searchFav'
       },
       openClear(){
           this.showClear = true;
       }
    },
    components:{
        aiClear,
        popUp
    }
}
</script>
<style lang="less">
    @import url('../../less/header.less');
    body{
        background: @background-color;
    }
    .show-list{
        .flexGrow(1);
        .flex();
        .alignItems();
        .tab-list{
            .pxRem(margin-left,45);
            .flexGrow(1);
            .flex();
            .alignItems();
            .justifyContent(center);
            .tab-item{
               .pxRem(min-width,120);
                .pxRem(font-size,28);
                color: @gray-text;
                font-weight: bold;
                text-align: center;
                &.active{
                    .borderBottom(4,@red-color);
                    color: @red-color;
                    .pxRem(line-height,56);
                }
            }
        }
        .search-btn{
            .flexGrow(0);
            .pxRem(margin-right,30);
        }
        .set-btn{
            .flexGrow(0);
            .pxRem(font-size,28);
            color: @gray-text;
            font-weight: bold;
            text-align: right;
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
        .flexShrink(0);
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

