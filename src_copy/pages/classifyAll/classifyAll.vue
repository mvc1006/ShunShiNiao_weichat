<template>
    <div class="classify-filter">
        <div class="header-top">
            <div class="back">
                <div class="go-back" @click="goBack"></div>
            </div>
            <div class="title" v-text="titleObj[title]"></div>
            <div class="add-new scale-big" @click="search">
                <div class="search-img"></div>
            </div>
        </div>
        <ul class="tab-list" v-if="title == 5 || title == 6">
            <li class="tab-item" :class="{'active':goodsType == 1}" @click="tabChange(1)">源头</li>
            <li class="tab-item" :class="{'active':goodsType == 2}" @click="tabChange(2)">本地</li>
        </ul>
        <div class="classify-main">
            <div class="main-left">
                <ul class="main-left-list">
                    <li class="main-left-item"
                    :class="{'active':isActive(item,index)}"
                    v-for="(item,index) in bigClassify"
                    :key="index"
                    v-text="item.name"
                    @click="selectBig(index,item.id)"></li>
                </ul>
            </div>
            <div class="main-right" ref="mainRight">
                <template v-if="goodsType == 1">
                    <div
                    v-for="(item,index) in rightClassify"
                    :key="index">
                        <h2><span class="line"></span><span class="classifyTitle">{{item.name}}</span><span class="line"></span></h2>
                        <ul class="main-right-list">
                            <li class="main-right-item"
                            v-for="(item2,index2) in item.sub_list"
                            :key="index2"
                            @click="checkedClassify(item2)">
                                <p class="img-box">
                                    <img :src="item2.pic" alt="">
                                </p>
                                <p class="text" v-text="item2.name"></p>
                            </li>
                        </ul>
                    </div>
                </template>
                <template v-else>
                    <ul class="main-right-list">
                        <li class="main-right-item"
                        v-for="(item,index) in rightClassify"
                        :key="index"
                        @click="checkedClassify(item)">
                            <p class="img-box">
                                <img :src="item.pic" alt="">
                            </p>
                            <p class="text" v-text="item.name"></p>
                        </li>
                    </ul>
                </template>
            </div>
        </div>
    </div>
</template>
<script>
/*
    参数说明
    方式：地址栏传参
    title：要显示的title 对应下面定义的titleObj 的编号  5 6的时候会显示 源头 本地切换的tab  其他情况不显示
    city_id:对应城市的id  本地时候必传
    goods_type 分类type  本地 = 2 源头 = 1
    id:点击具体分类进来的时候 分类id  点全部 不需要传
*/

export default {
    data(){
        return {
            bigClassify:[], // left 分类的数据
            rightClassify:[], // right 子分类的数据
            keyIndex:this.common.getUrlParam('id')?-1:0, //当前选中的left分类 的index
            titleObj:{ // 各种不同类型显示的 title
                1:'本地主商品分类',
                2:'本地赠品分类',
                3:'源头主品分类',
                4:'源头赠品分类',
                5:'主商品分类',
                6:'赠品分类',
            },
            classifyAddress:{},
            goodsType:'', // 1 line  2 local
            id:'', // 分类id
            cityId:'' //所在城市的id
        }
    },
    computed:{
        title(){ // 显示的title 数字表示
            return this.common.getUrlParam('title');
        }
    },
    methods: {
        search(){
            // 是否为本地  是否为主品
            window.location.href = './search.html?tab_type=1&goods_type=' + (this.goodsType) + '&isEmptyShopGroup=true'
        },
        readAddress(){
            let classifyAddress = sessionStorage.getItem('classifyAddress');
            if(classifyAddress){
                this.classifyAddress = JSON.parse(classifyAddress);
                sessionStorage.removeItem('classifyAddress');
            }
        },
        goBack(){
            window.history.back();
        },
        // 赠品分类时 本地和源头切换
        tabChange(type){
            this.goodsType = type;
            this.id = '';
            this.tabIndex = type;
            this.keyIndex = 0;
            this.getList();
        },
        // left 分类点击
        selectBig(index,val){
            this.keyIndex = index;
            this.id = val;
            this.smallClassify();
        },
        // left 选中状态
        isActive(item,index){
            if(this.id == item.id){
                return true;
            }else if(this.keyIndex == index){
                return true;
            }else{
                return false;
            }
        },
        // 处理子分类
        smallClassify(){
            let arr = [];
            this.rightClassify = [];
            if(this.id){
                for(let i=0;i<this.bigClassify.length;i++){
                    let item = this.bigClassify[i];
                    if(this.id == item.id){
                        arr = [].concat(item.sub_list);
                    }
                }
            }else{
                for(let i=0;i<this.bigClassify.length;i++){
                    arr = arr.concat(this.bigClassify[i].sub_list);
                }
            }
            this.rightClassify = [].concat(arr);
            setTimeout(() => {
                let $right = this.$refs.mainRight;
                if(Object.keys(this.classifyAddress).length>0){
                     $right.scrollTop = this.classifyAddress.top;
                     this.classifyAddress = {};
                }else{
                    $right.scrollTop = 0;
                }
            }, 50);
        },
        // 分类点击跳转
        checkedClassify(val){ // 分类点击
            let goods_type = this.goodsType,
            tab_type = 1;
            if(['1','3','5'].includes(this.title)){
                tab_type = 1;
            }else if(['2','4','6'].includes(this.title)){
                tab_type = 2;
            }
            // 设置hash值 追踪返回时的定位问题
            let classifyAddress = {
                id:this.id,
                top:this.$refs.mainRight.scrollTop
            }
            sessionStorage.setItem('classifyAddress',JSON.stringify(classifyAddress));
            location.href = 'searcResult.html?id='+val.id+'&goods_type='+goods_type+'&tab_type='+tab_type+'&page=classifAll&search='+encodeURIComponent(val.name)+"&bigId="+this.id;
        },
        // 获得数据
        getList(){
            this.dataService.getClassifyList({
                goods_type:this.goodsType,
                city_id:this.cityId
            }).then(resp=>{
                this.dataService.handleResponse({
                    data:resp,
                    callback:(data)=>{
                        this.bigClassify = data;
                        this.smallClassify();
                        this.setLocalStorage();
                    }
                })
            })
        },
        // 设置本地数据缓存
        setLocalStorage(){
            let setLocal = {};
            let time = new Date().getTime();
            setLocal.time = time;
            setLocal.data = this.bigClassify;
            let name = 'classifyAllList' + this.goodsType + this.cityId;
            localStorage.setItem(name,JSON.stringify(setLocal))
        },
        // 获得本地数据缓存
        getLocalData(){
            let time = new Date().getTime();
            let name = 'classifyAllList' + this.goodsType + this.cityId;
            let classifyAllList = localStorage.getItem(name);
            if(!classifyAllList){
                this.getList();
                return;
            }
            let classifyParse = JSON.parse(classifyAllList),
                localTime = Number(classifyParse.time),
                data = classifyParse.data;
            if(localTime+24*60*60*1000>time){ // 缓存期限一天
                this.bigClassify = data;
                this.smallClassify();
            }else{
                // 过期清空并重新获得
                localStorage.setItem(name,'');
                this.getList();
            }
        },
        // 初始化 参数
        async comData(){
            this.readAddress();
            const type = this.common.getUrlParam('goods_type');
            const id = this.classifyAddress.id || this.common.getUrlParam('id') || '';
            const city = sessionStorage.getItem('user-addr');
            this.goodsType = type;
            this.id = id;
            // sessionStorage 中获得city 数据  没有再请求api
            if(city){
                this.cityId = JSON.parse(city).city_id;
                this.getLocalData();
            }
        }
    },
    created(){
        this.comData();
    }
}
</script>
<style lang="less">
@import url('../../less/header.less');
.scale-big{
    .pxRem(padding-left,20);
    .pxRem(padding-top,20);
    .pxRem(padding-bottom,20);
}
.tab-list{
    .flex();
    .alignItems();
    .flexGrow(0);
    .flexShrink(0);
    .tab-item{
        .flexGrow(1);
        .pxRem(line-height,100);
        .borderBottom(2);
        text-align: center;
        .pxRem(font-size,28);
        &.active{
            .borderBottom(2,@red-color);
            .pxRem(line-height,100);
        }
    }
}

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
    max-height: 100%;
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
    h2{
        .pxRem(font-size,26);
        color: @gray-text;
        font-weight: normal;
        .pxRem(line-height,40);
        .pxRem(padding-top,40);
        .flex();
        .justifyContent();
        align-items: center;
        >.classifyTitle{
           .pxRem(margin-left,32);
           .pxRem(margin-right,32);
        }
        >.line{
             display: block;
            .pxRem(width,40);
            .pxRem(height,2);
             background: @red-color;
         }
    }
}

.main-left-list{
    .pxRem(padding-top,8);
    .pxRem(padding-bottom,8);
}
.main-left-item{
    .pxRem(margin-top,10);
    .pxRem(margin-bottom,20);
    .pxRem(line-height,48);
    text-align: center;
    .pxRem(font-size,24);
    color: @gray-text;
}
.active{
    color: @red-color;
    position: relative;
    &:after{
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        .pxRem(width,6);
        height: 100%;
        background: @red-color;
     }
}
.main-right-list{
    .flex();
    .alignItems();
    .flexWrap(wrap);
    .justifyContent(flex-start);
  .pxRem(padding-bottom,20);
}
.main-right-item{
    width: 33%;
    text-align: center;
    img{
        .pxRem(margin-top,48);
        .pxRem(margin-bottom,30);
        .pxRem(width,100);
        .pxRem(height,100);
        border-radius: 50%;
    }
    .img-box{
        text-align: center;
    }
    .text{
        .pxRem(font-size,22);
        color: @simple-gray-color;
        text-align: center;
        line-height: 1;
    }
}
</style>
