<template>
<div class="screen-new">
    <div class="big-classify">
        <ul class="big-classify-list">
            <li class="big-classify-item" 
            :class="{'active':bigClassifyIndex == 0}"
            @click="bigClickCheck(0)">全部</li>

            <li class="big-classify-item" 
            v-for="(value,index) in bigClassify"
            :key="index+1"
            :class="{'active':bigIsActive(value,index+1)}"
            @click="bigClickCheck(index+1)">{{value.name}}</li>
        </ul>
    </div>
    <div class="select-bar">
        <ul class="select-bar-list">
            <li class="select-bar-item" :class="{'active':selectIndex == 0}" @click="openSelct($event,0)">
                <span class="text">{{smallClassifyCheck.name}}</span>
                <span class="triangle-ico"></span>
            </li>
            <li class="select-bar-item" :class="{'active':selectIndex == 1}" @click="openSelct($event,1)" v-if="goods_type == '2'">
                <span class="text">{{nearbySmallCheck.name || '附近'}}</span>
                <span class="triangle-ico"></span>
            </li>
            <li class="select-bar-item" :class="{'active':selectIndex == 2}" @click="openSelct($event,2)">
                <span class="text">{{checkSort.name}}</span>
                <span class="triangle-ico"></span>
            </li>
            <li class="select-bar-item" @click="showScreen">
                <span class="text">筛选</span>
                <span class="triangle-ico"></span>
            </li>
        </ul>
        <!-- 品类 -->
        <div class="select-bar-info-box" @click="hideSelect" :style="{height:height+'px'}" v-if="selectIndex == 0">
            <ul class="info-item-list" @click.stop="">
                <li class="info-item-item" 
                v-for="(value,key) in smallClassify" 
                :key="key"
                :class="{'active':value.id == smallClassifyCheck.id}"
                @click="classifyCheck(value)">
                    <span class="name">{{value.name}}</span>
                    <span class="num" v-if="value.count">({{value.count}})</span>
                </li>
            </ul>
        </div>
        <!-- 附近 -->
        <div class="select-bar-info-box" @click="hideSelect" :style="{height:height+'px'}" v-else-if="selectIndex == 1">
            <ul class="info-item-list two" @click.stop="">
                <li class="info-item-item" 
                v-for="(value,index) in nearbyBigList" 
                :key="index"
                :class="{'active':nearbyBigIndex == index}"
                @click="neayBigCheck(index)">
                    <span class="name">{{value.name}}</span>
                    <span class="num" v-if="value.count">({{value.count}})</span>
                </li>
            </ul>

            <ul class="info-item-list two" @click.stop="">
                <li class="info-item-item" 
                v-for="(value,index) in nearbySmallList"
                :key="index"
                :class="{'active':nearbySmallCheck.id == value.id}"
                @click="nearbySmallClick(value)">
                    <span class="name">{{value.name}}</span>
                    <span class="num" v-if="value.count">({{value.count}})</span>
                </li>
            </ul>
        </div>
        <!-- 排序 -->
        <div class="select-bar-info-box" @click="hideSelect" :style="{height:height+'px'}" v-else-if="selectIndex == 2">
            <ul class="info-item-list" @click.stop="">
                <li class="info-item-item" 
                    v-for="(value,key) in sort" 
                    :key="key" 
                    :class="{'active':checkSort.order == value.order}"
                    @click="sortCheck(value)">
                    <span class="name">{{value.name}}</span>
                </li>
            </ul>
        </div>
        <!-- 筛选 -->
        <div class="screen-bg" v-show="screen" @click.stop="hideScreen">
            <!-- 源头筛选 -->
            <template v-if="goods_type == 1">
                <div class="screen-box" @click.stop="">
                    <div class="screen-module" v-if="brandList.length>0">
                        <div class="screen-module-name">
                            <span>品牌</span>
                            <template v-if="brandList.length>3">
                                <img v-if="brandShow" src="../assets/bottomArrows.png" @click="brandShowChange">
                                <img v-else src="../assets/topArrows.png" @click="brandShowChange">
                            </template>
                        </div>
                        <div class="popUp-module-list">
                            <template v-if="brandList.length>3">
                                <div class="popUp-module-item" 
                                v-for="(value,key) in brandList" 
                                :key="key"
                                :class="{'active':value.checked}"
                                @click="screenCheck(value)">
                                    {{value.name}}
                                </div>
                            </template>
                            <template v-else>
                                <div class="popUp-module-item" 
                                v-for="(value,key) in brandList.slice(0,3)" 
                                :key="key"
                                :class="{'active':value.checked}"
                                @click="screenCheck(value)">
                                    {{value.name}}
                                </div>
                            </template>
                        </div>
                    </div>
                    <div class="screen-module">
                        <div class="screen-module-name">
                            <span>服务</span>
                        </div>
                        <div class="popUp-module-list">
                            <div class="popUp-module-item" :class="{'active': isFreePostage}" @click="changePost">包邮</div>
                        </div>
                    </div>
                    <div class="screen-module">
                        <div class="screen-module-name screen-price">
                            <span>价格区间</span>
                        </div>
                        <div class="popUp-module-price">
                            <input type="number" v-model="lowPrice" placeholder="最低价">
                            <span>-</span>
                            <input type="number" v-model="tallPrice" placeholder="最高价">
                        </div>
                    </div>
                </div>
                <div class="bottom-btn">
                    <div class="reset" @click.stop="resetLine">重置</div>
                    <div class="confirm" @click.stop="confirmLine">确定</div>
                </div>
            </template>
            <!-- 本地筛选 -->
            <template v-else>
                <div class="screen-box" @click.stop="">
                    <div class="screen-module" v-for="(value,key) in screenData" :key="key">
                        <div class="screen-module-name">
                            <span>{{value.name}}</span>
                            <template v-if="value.list && value.list.length>3">
                                <img v-if="value.show" src="../assets/bottomArrows.png" @click="screenTagShowAll(value)">
                                <img v-else src="../assets/topArrows.png" @click="screenTagShowAll(value)">
                            </template>
                        </div>
                        <div class="popUp-module-list">
                            <template v-if="!value.show">
                                <div class="popUp-module-item" 
                                v-for="(child,index) in value.list" 
                                :key="index"
                                :class="{'active':child.checked}"
                                @click="screenCheck(child)">
                                    {{child.name}}
                                </div>
                            </template>
                            <template v-else>
                                <div class="popUp-module-item" 
                                v-for="(child,index) in value.list.slice(0,3)" 
                                :key="index"
                                :class="{'active':child.checked}"
                                @click="screenCheck(child)">
                                    {{child.name}}
                                </div>
                            </template>
                            <div class="popUp-module-empty"></div>
                        </div>
                    </div>
                    <div class="screen-module">
                        <div class="screen-module-name screen-price">
                            <span>价格区间(元)</span>
                        </div>
                        <div class="popUp-module-price">
                            <input type="number" v-model="lowPrice" placeholder="最低价">
                            <span>-</span>
                            <input type="number" v-model="tallPrice" placeholder="最高价">
                        </div>
                     </div>
                </div>
                <div class="bottom-btn">
                    <div class="reset" @click.stop="resetLocal">重置</div>
                    <div class="confirm" @click.stop="confirmLocal">确定</div>
                </div>
            </template>
        </div>
    </div>
</div>
</template>

<script>
import dataService from '@/js/dataService'
import common from '@/js/common'
export default {
    props:{
        goods_type:{
            type:String,
            default:'2'
        },
        is_main:{
            type:String,
            default:'1'
        },
        brand_list:{
            type:Array,
            default:()=>[]
        },
        screenReset:{
            type:Object,
            default:()=>{}
        }
    },
    data(){
        return {
            isResize: false,// input是否聚焦
            height:0,
            // 当前所选的下面的分类的index 用来显示具体的列表数据
            selectIndex:-1,
            // 上面的大分类 列表  选择的当前index
            bigClassify:[], 
            bigClassifyIndex:0, 

            // 品类
            smallClassify:[], 
            smallClassifyCheck:{}, // 所选品类

            // 附近
            nearbyBigList:[], // 附近
            nearbyBigIndex:0, // 附近大分类
                // 小分类
            nearbySmallList:[],
            nearbySmallCheck:{}, // 附近小分类

           
            // 智能排序 -- 当前所中的数据
            checkSort:{},
            // 排序的默认数据
            sortMain:[
                {
                    name:'智能排序', // 赠品的时候有
                    order:'buy_power2',
                },
                {
                    name:'购买力排序', // 主商品的时候才有
                    order:'buy_power',
                },
                {
                    name:'智能排序', // 赠品的时候有
                    order:'intelligence',
                },
                {
                    name:'离我最近', // 本地有
                    order:'distance',
                },
                {
                    name:'好评优先',
                    order:'goods_point',
                },
                {
                    name:'销量优先',
                    order:'sale',
                },
                {
                    name:'价格最低',
                    order:'price_1',
                },
                {
                    name:'价格最高',
                    order:'price_0',
                },
            ],
            // 排序列表显示的数据
            sort:[],
            // 筛选
            screen:false,
            //筛选数据
            screenData:[],
             //line -- price
             // 筛选的时候用到的id
            screenId:'',
            lowPrice:'',
            tallPrice:'',
            // 源头筛选
            brandShow:false,
            // 用于本地显示的
            brandList:this.brand_list,
            //是否包邮
            isFreePostage:false,
            submitParams:{},
            isFirst:true,
            paramsData:{}
        }
    },
    mounted(){
        this.isMainChange();
        // 分类 - 1级
        if(Object.keys(this.screenReset).length>0){
            this.height = this.screenReset.height;
            this.selectIndex = this.screenReset.selectIndex;
            this.bigClassify = this.screenReset.bigClassify;
            this.bigClassifyIndex = this.screenReset.bigClassifyIndex;
            this.smallClassify = this.screenReset.smallClassify;
            this.smallClassifyCheck = this.screenReset.smallClassifyCheck;
            if(Object.keys(this.smallClassifyCheck).length <= 0){
                this.smallClassifyCheck = this.smallClassify[0];
            }
            this.nearbyBigList = this.screenReset.nearbyBigList;
            this.nearbyBigIndex = this.screenReset.nearbyBigIndex;
            this.nearbySmallList = this.screenReset.nearbySmallList;
            this.nearbySmallCheck = this.screenReset.nearbySmallCheck;
            this.checkSort = this.screenReset.checkSort;

            this.sort = this.screenReset.sort;
            this.screenData = this.screenReset.screenData;
            this.screenId = this.screenReset.screenId;
            this.lowPrice = this.screenReset.lowPrice;
            this.tallPrice = this.screenReset.tallPrice;

            this.isFreePostage = this.screenReset.isFreePostage;
            this.submitParams = this.screenReset.submitParams;
            this.isFirst = this.screenReset.isFirst;
            this.paramsData = this.screenReset.paramsData;

        }else{
            this.$eventBus.$on('throwParams',(params)=>{
                this.paramsData = Object.assign({},params);
                this.init();
            });
        }
    },
    computed:{
        city_id:function(){
            let addr = sessionStorage.getItem('user-addr') ? sessionStorage.getItem('user-addr') :'{}';
            return JSON.parse(addr).city_id;
        },
        bigId:function(){
            let big = common.getUrlParam('bigId');
            return big;
        }
    },
    watch:{
        goods_type:function(value){
            this.submitParams = {};
            this.screenId = '';
            this.bigClassifyIndex = 0;
            this.smallClassifyCheck = {};
            this.nearbyBigIndex = 0;
            this.nearbySmallCheck = {};
            this.isFreePostage = false;
            this.brandList = this.brand_list;
            this.screen = false;
            this.isMainChange();
            this.init();
        },
        is_main(){
            this.isMainChange();
        },
    },
    methods:{
        init(){
            this.getBigClassify();
            if(this.goods_type == '2'){
                this.getNearbyData();
            }
        },
        // 选中状态
        bigIsActive(value,index){
            if(this.bigId == value.id && this.isFirst){
                this.bigClassifyIndex = index;
                return true;
            }
            if(this.bigClassifyIndex == index){
                return true;
            }
            return false;
        },
        // isMain 参数变化
        isMainChange(){
            let sort = JSON.parse(JSON.stringify(this.sortMain));
            if(this.goods_type == '1'){
                if(this.is_main == '1'){
                    sort.splice(0,1)
                    sort.splice(2,1)
                }else{
                    let a = sort.splice(0,2)
                }
            }else{
                if(this.is_main == '1'){
                    sort.splice(2,1)
                }else{
                    let a = sort.splice(0,2)
                }
            }
            // sort 已经被从头部删除了一项 所以距离成为了第二项
            if(this.goods_type == '1'){
                sort.splice(1,1)
            }
            this.checkSort = sort[0];
            this.sort = sort;
        },
        // 一级分类获得数据
        getBigClassify(){
            let newParams = Object.assign({},this.paramsData,{
                city_id:this.city_id,
                goods_type:this.goods_type,
                level:1
            })
            dataService.getClassifyList(newParams).then((resp)=>{
                dataService.handleResponse({
                    data:resp,
                    callback:(data)=>{
                        this.bigClassify = data;
                        this.getSmallClassify(true);
                    }
                })
            })
        },
        // 小分类
        getSmallClassify(first){
            this.smallClassifyCheck = {};
            if(this.bigClassifyIndex == 0 && !(this.bigId && first)){
                this.smallClassify = [{
                    name:'全部',
                    count:'',
                }]
                this.smallClassifyCheck = this.smallClassify[0];
                return;
            }
            let catId = (first && this.bigId) ? this.bigId : this.bigClassify[this.bigClassifyIndex - 1].id;
            let newParams = Object.assign({},this.paramsData,{
                city_id:this.city_id,
                goods_type:this.goods_type,
                tab_type:this.is_main,
                cate_id_1:catId
            })
            dataService.getClassifyFilter(newParams).then((resp)=>{
                dataService.handleResponse({
                    data:resp,
                    callback:(data)=>{
                        this.smallClassify = data;
                        this.smallClassifyCheck = this.smallClassify[0];
                    }
                })
            })
        },
        //附近获得数据
        getNearbyData(params={}){
            let newParams = Object.assign({},this.paramsData,params,{
                goods_type:this.goods_type,
                tab_type:this.is_main,
                city_id:this.city_id
            })
            dataService.getDistanceList(newParams).then(resp=>{
                dataService.handleResponse({
                    data:resp,
                    callback:(data)=>{
                        this.nearbyBigList = data;
                        this.nearbySmallList = this.nearbyBigList[0].list;
                    }
                })
            })
        },
        // 获得本地筛选数据
        getLocalTagData(id){
            if(this.screenId != id){
                this.screenId = id;
                this.cleaScreen();
            }else{
                return;
            }
            dataService.getTagList({
                tab_type:this.is_main,
                cate_id:this.screenId
            }).then((resp)=>{
                dataService.handleResponse({
                    data:resp,
                    callback:(data)=>{
                        for(let key in data){
                            let value = data[key];
                            value.show = false;
                            for(let childKey in value.list){
                                value.list[childKey].checked = false;
                            }
                        }
                        this.screenData = data;
                    }
                })
            })
        },
        // 获得源头品牌
        getLineBrand(id){
            if(this.screenId != id){
                this.screenId = id;
                this.cleaScreen();
            }else{
                return;
            }
            dataService.getBrandList({
                cate_id:this.screenId
            }).then(resp=>{
                dataService.handleResponse({
                    data:resp,
                    callback:(data)=>{
                        this.brandList = data;
                    }
                })
            })
        },
         
        // 源头重置
        resetLine(){
            this.isFreePostage = false;
            this.brandShow = false;

            for(let key in this.brandList){
                this.$set(this.brandList[key],'checked',false);
            }

            this.lowPrice = '';
            this.tallPrice = '';
        },
        // 源头确认
        confirmLine(){
            let brand_id = [];
            for(let key in this.brandList){
                let value = this.brandList[key];
                if(value.checked){
                    brand_id.push(value.brand_id);
                }
            }
            let params = {};
            if(brand_id.length>0){
                params.brand_id = brand_id.join(',');
            }
            if(this.lowPrice || this.lowPrice === 0){
                params.price_a = this.lowPrice;
            }
            if(this.tallPrice || this.tallPrice === 0){
                params.price_b = this.tallPrice;
            }
            params.shipping_free = this.isFreePostage ? 1 : 0;

            delete this.submitParams.brand_id;
            delete this.submitParams.price_a;
            delete this.submitParams.price_b;
            delete this.submitParams.shipping_free;
            this.submit(params)
            this.hideScreen();
        },
        // 本地重置
        resetLocal(){
            for(let key in this.screenData){
                let value = this.screenData[key];
                value.show = false;
                for(let childKey in value.list){
                    let child = value.list[childKey];
                    child.checked = false;
                }
            }
            this.lowPrice = '';
            this.tallPrice = '';
        },
        // 本地确认
        confirmLocal(){
            let tags = [];
            for(let key in this.screenData){
                let value = this.screenData[key];
                for(let childKey in value.list){
                    let one = value.list[childKey];
                    if(one.checked){
                        tags.push(one.id)
                    }
                }
            }
            let params = {};
            if(tags.length>0){
                params.tag_ids = tags.join(',');
            }
            if(this.lowPrice || this.lowPrice === 0){
                params.price_a = this.lowPrice;
            }
            if(this.tallPrice || this.tallPrice === 0){
                params.price_b = this.tallPrice;
            }
            delete this.submitParams.tag_ids;
            delete this.submitParams.price_a;
            delete this.submitParams.price_b;

            this.submit(params);
            this.hideScreen();
        },
        // 筛选隐藏
        hideScreen(){
            this.screen = false;
        },
        // 筛选显示
        showScreen(){
            let bigCateId = this.bigClassifyIndex != 0 ? this.bigClassify[this.bigClassifyIndex - 1].id : '';
            let smallCateId = this.smallClassifyCheck.id;
            if(smallCateId || bigCateId){
                if(this.goods_type == '2'){
                    this.getLocalTagData(smallCateId || bigCateId);
                }else{
                    this.getLineBrand(smallCateId || bigCateId);
                }
            }
            this.screen = true;
            this.hideSelect();
        },
        //品类 附近  只能排序 隐藏
        hideSelect(){
            this.selectIndex = -1;
        },
        // 显示选择框
        openSelct(event,num){
            let bodyHeight = document.body.clientHeight;
            let parent = event.target.parentNode;
            let y = event.pageY - event.offsetY + event.target.parentNode.clientHeight;
            this.height = bodyHeight - y - 6;
            if(this.selectIndex == num){
                this.hideSelect();
                return;
            }
            this.selectIndex = num;
        },
        // 排序选择事件
        sortCheck(value){
            this.checkSort = value;
            this.hideSelect();
            this.submit({
                order_type:value.order
            });
        },
        // 大分类选择
        bigClickCheck(index){
            this.isFirst = false;
            this.bigClassifyIndex = index;
            this.getSmallClassify();
            
            this.classifyDel();
            this.hideSelect();

            if(index == 0){
                this.submit({})
            }else{
                this.getNearbyData({
                    cat_id_1:this.bigClassify[this.bigClassifyIndex - 1].id
                })
                this.submit({
                    cat_id_1:this.bigClassify[this.bigClassifyIndex - 1].id
                })
            }
        },
        cleaScreen(){
            // price default
            this.lowPrice = '';
            this.tallPrice = '';
            // del price
            delete this.submitParams.price_a;
            delete this.submitParams.price_b;
            if(this.goods_type == '2'){
                // clear data local
                this.screenData = [];
                delete this.submitParams.tag_ids;
            }else{
                // line
                this.brandList = [];
                this.isFreePostage = false;
                delete this.submitParams.shipping_free;
                delete this.submitParams.brand_id;
            }
        },
        // 选择品类
        classifyCheck(value){
            this.hideSelect();
            // 点击的品类是当前选中的那个 直接return
            if(Object.is(this.smallClassifyCheck,value)){
                return;
            }
            this.smallClassifyCheck = value;
            this.classifyDel();
            let key = value.cate_level == '1' ? 'cat_id_1' : 'cat_id_2';
            this.getNearbyData({[key]:value.id})
            if(value.id){
                this.submit({
                    [key]:value.id
                });
            }
        },
        classifyDel(){
            this.cleaScreen();
            let arr = ['cat_id_2','cat_id_1'];
            for(let value of arr){
                delete this.submitParams[value];
            }
        },
        //附近-- 大分类选择
        neayBigCheck(index){
            this.nearbyBigIndex = index;
            this.nearbySmallList = this.nearbyBigList[index].list;
        },
        // 附近 --- 点击
        nearbySmallClick(value){
            let nearbyBigList = this.nearbyBigList;
            let nearbySmallCheck = {
                count: value.count,
                county_id: value.county_id,
                id: value.id,
                name: value.name
            };
            if(value.name == '全部'){
                nearbySmallCheck.name = nearbyBigList[this.nearbyBigIndex].name;
            }
            this.nearbySmallCheck = nearbySmallCheck;
            // let big = this.nearbyBigList[this.nearbyBigIndex];
            // 先删除 -- key
            let index = this.nearbyBigIndex < 2 ? this.nearbyBigIndex : 1
            let keyArr = ['distance_limit','area_id','county_id'];
            for(let key in keyArr){
                delete this.submitParams[keyArr[key]];
            }
            let params = {};
            if(value.id == 0){
                params['county_id'] = value.county_id;
            }else{
                params[keyArr[index]] = value.id;
            }
            this.submit(params);
            this.hideSelect();
        },
        // 选择了参数去请求数据
        submit(obj){
            /*
                cat_id_1
                cat_id_2
                cat_id
                order_type
                price_a
                price_b

                
                goods_type == 2
                    distance_limit // 附近
                    county_id  // 区
                    area_id // 商圈
            ----------------------------
                goods_type == 1--
                    brand_id
                    shipping_free

            */
            this.submitParams = Object.assign({},this.submitParams,obj);
            this.$eventBus.$emit("screenWay",this.submitParams)
        },
        // 选择筛选标签
        screenCheck(data){
            this.$set(data,'checked',!data.checked);
        },
        // 标签显示全部---- 筛选
        screenTagShowAll(data){
            data.show = !data.show;
        },
        // 源头 品牌 显示全部
        brandShowChange(){
            this.brandShow = !this.brandShow;
        },
        // 包邮点击
        changePost(){
            this.isFreePostage = !this.isFreePostage;
        }
    }
}
</script>

<style lang="less">
@import url('../less/common.less');
.screen-new{
    background: @white-color;
  }
  .big-classify{
    .pxRem(padding-top,20);
    .pxRem(padding-bottom,20);
    overflow: auto;
    .borderTop(2);
    .pxRem(padding-left,16);
    .pxRem(padding-right,16);
  }
  .big-classify-list{
      .flex();
      .alignItems();
      .flexWrap();
      
  }
  .big-classify-item{
    .flexShrink(0);
    .flexGrow(0);
    .pxRem(margin-right,16);
    .pxRem(padding-left,8);
    .pxRem(padding-right,8);
    .pxRem(font-size,24);
    .pxRem(line-height,40);
    text-align:center;
    font-weight: bold;
    &:last-child{
        margin-right:0;
    }
    &.active{
        background: @red-color;
        color:@white-color;
        .borderRadius(6);
    }
  }
  .select-bar{
      .pxRem(padding-left,24);
      .pxRem(padding-right,24);
      .pxRem(padding-top,4);
      .pxRem(padding-bottom,4);
      .borderTop(2);
      position: relative;
  }
  .select-bar-list{
      .pxRem(padding-top,12);
      .pxRem(padding-bottom,12);
      .flex();
      .alignItems();
      .justifyContent(space-between);
  }
  .select-bar-item{
      .flexGrow(0);
      .flexShrink(0);
      .flex();
      .alignItems();
      .text{
          .pxRem(font-size,24);
          .pxRem(line-height,40);
          color: @gray-text;
      }
      &.active{
          .triangle-ico{
            background: url('../assets/triangle-red.png') no-repeat;
            background-size: 100%;
          }
          .text{
            color:@red-color;
          }
      }
  }
  .triangle-ico{
      .pxRem(width,10);
      .pxRem(height,8);
      .pxRem(margin-left,8);
      display: block;
      background: url('../assets/triangle-black.png') no-repeat;
      background-size: 100%;
  }
  .select-bar-info-box{
    .flex();
    .alignItems(flex-start);
    background: rgba(#000,0.2);
    position: absolute;
    left: 0;
    .pxRem(top,62);
    width: 100%;
    height:500px;
    z-index: 99;
  }
  .info-item-list{
    .flexGrow(1);
    .flexShrink(0);
    overflow: auto;
    .pxRem(max-height,600);
    background:@white-color;
    &.two{
        max-width: 50%;
        height:100%;
        &:first-child{
            background: @background-color;
        }
    }
  }
  .info-item-item{
    .pxRem(padding-left,28);
    .pxRem(padding-right,28);
    .pxRem(line-height,72);
    .pxRem(font-size,24);
    color: @gray-text;
    .num{
        color: @gray-light-text;
        .pxRem(margin-left,12);
    }
    &.active{
        color:@red-color;
        .num{
            color:@red-color;
        }
    }
  }
  .two{
    .info-item-item.active{
        background:@white-color;
    }
}
.screen-bg{
    position:fixed;
    top: 0;
    right: 0;
    width: 100%;
    height:100%;
    background:rgba(#000, 0.3);
    z-index: 99999;
}
.screen-box{
    position: absolute;
    right: 0;
    height: 100%;
    .pxRem(width,544);
    .pxRem(padding-bottom,126);
    .pxRem(padding-left,16);
    .pxRem(padding-right,16);
    background: #fff;
    overflow: auto;
}
/* 弹窗底部按钮 */
.bottom-btn{
    display: flex;
    .pxRem(width,544);
    position: fixed;
    bottom: 0;
    right: 0;
    .borderTop(1,#f2f2f2);
    background: @white-color;
}
  .bottom-btn>div{
    width: 50%;
    .flexShrink(0);
    text-align: center;
    .pxRem(line-height,96);
    .pxRem(font-size,28);
    color: @simple-gray-color;
  }
  .confirm{
    color: @white-color !important;
    background: @red-color;
  }

  /* 弹窗通用模块 */
  .screen-module-name{
    .flex();
    justify-content: space-between;
    .pxRem(padding-top,24);
    .pxRem(padding-bottom,16)
  }
  .screen-module-name>img{
    .pxRem(width,31);
    .pxRem(height,21);
  }
  .popUp-module-list{
    .flex();
    justify-content: space-between;
    flex-wrap: wrap;
    .borderBottom(1,#f2f2f2)
  }
  .popUp-module-item{
    position: relative;
    .flex();
    align-items: center;
    justify-content: center;
    .pxRem(width,160);
    .pxRem(height,80);
    .pxRem(margin-bottom,16);
    background: #F2F1F0;
    .pxRem(border-radius,8);
    .pxRem(font-size,20)
  }
  .popUp-module-empty{
    .pxRem(width,160);
    flex:none;
  }
  .popUp-module-item.active{
    background: #FBE7E4;
  }
  .popUp-module-item.active::after{
    content: '';
    position: absolute;
    right: 0;
    bottom: 0;
    .pxRem(width,32);
    .pxRem(height,32);
    background: url("../assets/screenDelete.png") no-repeat center;
    background-size: 100%;
  }
  /* 价格区间 */
  .screen-price{
    .pxRem(margin-bottom,32)
  }
  .popUp-module-price{
    .flex();
    .justifyContent(center);
    .alignItems(center);
    .pxRem(font-size,24);
    color: @CFCFCF;
  }
  .popUp-module-price>span{
    .pxRem(margin-left,20);
    .pxRem(margin-right,20);
  }
  .popUp-module-price>input{
    .pxRem(width,220);
    .pxRem(line-height,64);
    .pxRem(height,64);
    background: #F2F1F0;
    text-align: center;
    border: none;
    .pxRem(border-radius,35);
    .pxRem(font-size,24);
  }
</style>
