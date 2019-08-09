<template>
    <div class="container">
        <div class="header-top">
            <div class="back">
                <div class="go-back" @click="goBack"></div>
            </div>
            <div class="search-box">
                <span class="ico search-img"></span>
                <input class="search-input" @focus="startSearch" v-model="searchValue" type="text" placeholder="城市/拼音">
            </div>
        </div>
        <template v-if="search">
            <div class="search-cont">
                <ul class="city-list">
                    <li class="city-item border" 
                    v-for="(item,index) in searchCity" 
                    :key="index" 
                    @click="cityClick(item)">{{item.name}}</li>
                </ul>
            </div>
        </template>
        <template v-else>
            <div class="city-list-box" @scroll="listOnScroll">
                <div class="now-city-title" ref="cityTitle">您正在看：<span>{{nowCity.name}}</span></div>
                <div class="title">定位/最近访问</div>
                <ul class="column-3 city-list">
                    <li class="item-3 city-item" 
                    v-for="(item,index) in historyCity" 
                    :key="index"
                     @click="cityClick(item)">
                        <span class="ico" v-if="index == 0">
                            <img src="../../assets/now-city.png" alt="">
                        </span>
                        <span class="text">{{item.name}}</span>
                    </li>
                </ul>
                <div class="title">热门城市</div>
                <ul class="column-3 city-list">
                    <li class="item-3 city-item" 
                    v-for="(item,index) in hotCity" 
                    :key="index"
                    @click="cityClick(item)">
                        <span class="text">{{item.name}}</span>
                    </li>
                </ul>
                <div v-for="(item,index) in first" :key="index">
                    <div class="title">{{item}}</div>
                    <ul class="city-list" v-for="(list,key) in allCity[index]" :key="key">
                        <li class="city-item border" @click="cityClick(list)">
                            <span class="text">{{list.name}}</span>
                        </li>
                    </ul>
                </div> 
            </div>

            <div class="right-check-list" ref="rightSelect"
            :class="{'back':touch}"
            @touchstart="touchStart"
            @touchend="touchend"
            @touchmove="touchmove"
            >
                <ul class="text-list">
                    <li class="text-item" :class="{'active':rightIndex == 0}" :style="{height:oneHeight+'px'}">定位</li>
                    <li class="text-item" :class="{'active':rightIndex == 1}" :style="{height:oneHeight+'px'}">热门</li>
                    <li class="text-item" 
                    v-for="(item,index) in first" 
                    :key="index" 
                    :style="{height:oneHeight+'px'}"
                    :class="{'active':rightIndex == (index+2)}">{{item}}</li>
                </ul>
            </div>
            <div class="check-show" v-show="check">{{checkedNow}}</div>
        </template>
    </div>
</template>
<script>
export default {
    data(){
        return {
            touch:false,
            check:false,
            checkedNow:'', // 选中的右边的内容显示
            checkTimer:null,
            first:[],
            y:0, // box 距离顶部的距离
            rightIndex:0, // 右边选择的index 定位
            oneHeight:0, // 右边 一个类目的高度
            search:false,
            hotCity:[],
            allCity:[],
            searchCity:[],
            searchValue:''
        }
    },
    created(){
        this.getCityData();
    },
    watch:{
        searchValue:function(value){
            this.searchCity = [];
            if(!value){
                return;
            }
            for(let i=0;i<this.allCity.length;i++){
                let one = this.allCity[i];
                for(let j=0;j<one.length;j++){
                    let target = one[j];
                    if(target.name.indexOf(value) == 0 || target.pinyin.indexOf(value) == 0){
                        this.searchCity.push(target)
                    }
                }
            }
        }
    },
    computed:{
        nowCity(){
            let now = sessionStorage.getItem('user-addr');
            let result = {};
            if(now){
                now = JSON.parse(sessionStorage.getItem('user-addr'))
                result.id = now.city_id;
                result.name = now.city_name;
            }
            return result;
        },
        historyCity(){
            let history = localStorage.getItem('history-city') ? JSON.parse(localStorage.getItem('history-city')) : [];
            history.unshift(this.nowCity);
            let location = JSON.parse(sessionStorage.getItem('user-location'));
            let locationResult = {
                id:location.city_id,
                name:location.city_name
            }
            history.unshift(locationResult);
            let idArr = [];
            let newHistory = history.filter(value=>{
                if(!idArr.includes(value.id)){
                    idArr.push(value.id);
                    return value;
                }
            })
            newHistory = newHistory.slice(0,3);
            localStorage.setItem('history-city',JSON.stringify(newHistory))
            return newHistory;
        }
    },
    methods:{
        // 计算右侧每个类目占有的高度 --- 一屏显示完 为了没滚动条
        computeRightOneHeight(){
            this.$nextTick(()=>{
                let rightBox = this.$refs.rightSelect;
                let height = rightBox.clientHeight;
                this.oneHeight = Math.floor(height/(this.first.length+2));
            })
        },
        goBack(){
            if(this.search){
                this.search = false;
            }else{
                history.back();
            }
        },
        // 搜索
        startSearch(){
            this.search = true;
        },
        // 滑动开始
        touchStart($event){
            let { target , changedTouches } = $event;
            this.y = changedTouches[0].pageY - target.offsetTop;
            this.rightIndex = Math.ceil(target.offsetTop/this.oneHeight);
            this.checkedNow = target.innerText;
            clearTimeout(this.checkTimer);
            this.touch = true;
            this.check = true;
            this.leftMoveFllowRight();
        },
        // 滑动结束
        touchend(){
            this.touch = false;
            this.checkHide();
        },
        // 手指滑动
        touchmove($event){
            let { target , changedTouches } = $event;
            let index = Math.ceil((changedTouches[0].pageY - this.y)/this.oneHeight);
            if(index<0 || index >= this.first.length+2){
                return false;
            }
            if(this.rightIndex == index){ return false };
            let text = '';
            switch(index){
                case 0:
                    this.checkedNow = '定位';
                    break;
                case 1:
                    this.checkedNow = '热门';
                    break;
                default:
                    this.checkedNow = this.first[index - 2];
                    break;
            }
            this.rightIndex = index;
            this.leftMoveFllowRight();
        },
        // 左侧的城市列表跟随右边的字母滚动而滚动
        leftMoveFllowRight(){
            let titles = document.querySelectorAll('.title'); // 所有title
            let box = document.querySelector('.city-list-box'); // 容器
            let leftTitle = titles[this.rightIndex]; // 当前title
            let scrollTop = leftTitle.offsetTop - this.$refs.cityTitle.offsetTop;
            if(this.rightIndex == 0){
                scrollTop = 0;
            }
            box.scrollTop = scrollTop;
        },
        // 左侧城市列表滚动
        listOnScroll($event){
            if(this.touch) return;
            let { target } = $event;
            let scrollTop = target.scrollTop;
            let titles = document.querySelectorAll('.title'); // 所有title
            scrollTop = scrollTop + this.$refs.cityTitle.offsetHeight + 10;
            for(let i=0;i<titles.length;i++){
                let one = titles[i];
                let next = titles[i+1];
                if(one.offsetTop<=scrollTop && (!next || next.offsetTop>scrollTop)){
                    this.rightIndex = i;
                    if(i == 0){
                        this.checkedNow = '定位';
                    }else if(i == 1){
                        this.checkedNow = '热门';
                    }else{
                        this.checkedNow = one.innerText;
                    }
                    clearTimeout(this.checkTimer);
                    this.check = true;
                }
            }
            this.checkHide();
        },
        // 中间显示的城市名称隐藏 -- 
        checkHide(){
            clearTimeout(this.checkTimer);
            this.checkTimer = setTimeout(() => {
                this.check = false;
            }, 1000);
        },
        // api请求数据
        getCityData(){
            let cityList = localStorage.getItem('city-list');
            let params = {
                need_all:1
            };
            if(cityList){
                this.initAllCity(JSON.parse(cityList));
                params.need_all = 0;
            }
            this.dataService.getCityList(params).then(resp=>{
                this.dataService.handleResponse({
                    data:resp,
                    callback:(data)=>{
                        this.hotCity = data.hot;
                        if(data.all.length>0){
                            this.initAllCity(data.all);
                            localStorage.setItem('city-list',JSON.stringify(data.all))
                        }
                    }
                })
            })
        },
        // 处理城市数据
        initAllCity(data){
            for(let i=0;i<data.length;i++){
                let one = data[i];
                this.first.push(one.letter);
                this.allCity.push(one.list)
            }
            this.computeRightOneHeight();
        },
        // 城市点击
        cityClick(data){
            let { id , name } = data;
            let cityInfo = JSON.parse(sessionStorage.getItem('user-addr'));
            cityInfo.city_id = id;
            cityInfo.city_name = name;
            sessionStorage.setItem('user-addr',JSON.stringify(cityInfo));
            // this.search = false;
            history.back();
        }
    }
}
</script>
<style lang="less">
@import url('../../less/header.less');
body{
    background: @background-color;
    -moz-user-select:none;/*火狐*/
    -webkit-user-select:none;/*webkit浏览器*/
    -ms-user-select:none;/*IE10*/
    -khtml-user-select:none;/*早期浏览器*/
    user-select:none;
}
.search-cont{
    .flexGrow(1);
    background: @white-color;
    overflow: auto;
}
.check-show{
    position: absolute;
    .pxRem(left,270);
    .pxRem(top,450);
    .pxRem(min-width,140);
    .pxRem(height,180);
    .pxRem(line-height,180);
    .pxRem(padding-left,20);
    .pxRem(padding-right,20);
    .pxRem(font-size,120);
    color: @white-color;
    background: rgba(0,0,0,0.10);
    text-align: center;
    // overflow: hidden;
}
.right-check-list{
    position: absolute;
    .borderRadius(8);
    .pxRem(width,60);
    height: 85%;
    .pxRem(bottom,30);
    right:0;
    overflow: hidden;
    &.back{
        background: rgba(0,0,0,0.10);
    }
}
.text-item{
    text-align: center;
    .pxRem(font-size,26);
    color: @red-color;
    &.active{
        color: @gray-text;
    }
}
.city-list-box{
    -webkit-overflow-scrolling: touch;
    .flexGrow(1);
    overflow: auto;
}
.search-box{
    .flexGrow(1);
    .pxRem(height,64);
    .borderRadius(12);
    .pxRem(padding-left,30);
    background: #F2F1F0;
    .flex();
    .alignItems();
}
.search-input{
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    border: 0;
    outline: 0;
    background: none;
    .pxRem(padding-left,16);
    .pxRem(padding-right,30);
}

.now-city-title{
    .pxRem(line-height,80);
    .pxRem(height,80);
    .pxRem(font-size,28);
    color: @gray-text;
    .padding32;
    background: @white-color;
}
.title{
    .padding32;
    .pxRem(line-height,68);
    .pxRem(font-size,28);
    color: @gray-light-text;
}

.padding32(){
    .pxRem(padding-left,32);
    .pxRem(padding-right,32);
}
.city-list{
    .city-item{
        .pxRem(line-height,80);
        background: @white-color;
        .padding32();
        .text{
            .pxRem(font-size,28);
            color: @gray-text;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        &.border{
            .borderBottom(2);
        }
    }
}
.column-3{
    .flex();
    .padding32();
    .alignItems();
    .flexWrap(wrap);
    .item-3{
        .flex();
        .alignItems();
        .justifyContent();
        .pxRem(padding-left,16);
        .pxRem(padding-right,16);
        .pxRem(margin-right,24);
        .pxRem(margin-bottom,24);
        .pxRem(width,188);
        box-sizing: border-box;
        .borderRadius(8);
        .ico{
            .flexShrink(0);
            .flexGrow(0);
            .pxRem(margin-right,16);
            img{
                .pxRem(width,28);
                .pxRem(height,28);
            }
        }
    }
}


</style>
