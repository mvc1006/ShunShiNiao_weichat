<template>
    <div class="container">
        <div class="header-top">
            <div class="back">
                <div class="go-back" @click="goBack"></div>
            </div>
            <div class="title">一键清理</div>
        </div>
        <ul class="tab-list-clear">
            <li class="tab-item-clear" :class="{'active':keyIndex == 0}" @click="check('not_valid',0)">已失效</li>
            <li class="tab-item-clear" :class="{'active':keyIndex == 1}" @click="check('6_month',1)">六个月前</li>
            <li class="tab-item-clear" :class="{'active':keyIndex == 2}" @click="check('1_year',2)">一年前</li>
        </ul>
        <scroll ref="scroll" :upBack="upBack" :downBack="downBack" :isEnd="isEnd">
            <goods :goodList="goodList"></goods>
            <no-data v-show="goodList.length<=0"></no-data>
        </scroll>  
        <div class="margin-top"></div>
        <div class="bottom-del" v-show="goodList.length>0" @click="showPop">删除</div>
        <pop-up v-if="popShow"
        @popupconfirm="confirm"
        @popupcancel="cancel"
        :type="pop.type"
        :content="pop.content"
        :cancel="pop.cancel"
        :confirm="pop.confirm"></pop-up>
    </div>
</template>
<script>
import goods from './personalProduct.vue'
import noData from './personalNoData.vue'
import popUp from '@/components/popUp.vue'
import scroll from '@/components/scroll';
export default {
    data(){
        return {
            goodList:[],
            keyIndex:0,
            type:'not_valid',
            popShow:false,
            pop:{
                type:2,
                content:'您确定删除失效商品吗？',
                cancel:'取消',
                confirm:'删除'
            },
            isEnd:false,
            canLoading:true,
            page:1
        }
    },
    methods:{
        historyBack({items,scrollY,maxScroll}){
            this.goodList = items.goodList;
            this.canLoading = true;
            this.page = items.page;
            this.isEnd = items.isEnd;
            this.keyIndex = items.keyIndex;
            this.type = items.type;

            this.$nextTick(()=>{
                let time = setInterval(() => {
                    let scroll = this.$refs.scroll.scroll;
                    if(scroll){
                        scroll.refresh();
                        scroll.maxScrollY = maxScroll;
                        scroll.scrollTo(0,scrollY,0);
                        clearInterval(time);
                    }
                }, 100);
            })
        },
        goBack(){
            this.$eventBus.$emit('hideClear')
        },
        check(type,index){
            if(this.keyIndex == index){
                return;
            }
            this.keyIndex = index;
            this.page = 1;
            this.type = type;
            this.isEnd = false;
            this.getList();
        },
        getList(loading){
            history.clearData();
            const params = {
                filter:this.type,
                page:this.page
            }
            this.dataService.getFavList(params).then((resp)=>{
                this.dataService.handleResponse({
                    data:resp,
                    callback:(data)=>{
                        if(loading){
                            if(data.length>0){
                                this.goodList = this.goodList.concat(data);
                            }else{
                                this.isEnd = true;
                            }
                        }else{
                            this.goodList = [].concat(data);
                        }
                        this.$nextTick(()=>{
                            this.$refs.scroll.scroll.refresh();
                        })
                        this.canLoading = true;
                    }
                })
            })
        },
        showPop(){
            this.popShow = true;
        },
        cancel(){
            this.$nextTick(()=>{
                this.popShow = false;
            })
        },
        // 确定删除
        confirm(){
            history.clearData();
            this.dataService.delMyFav({
                filter:this.type,
                type:1
            }).then(resp=>{
                this.dataService.handleResponse({
                    data:resp,
                    callback:(data)=>{
                        this.popShow = false;
                        this.goodList = [];
                    }
                })
            })
        },
        upBack(){
            if(this.canLoading){
                this.page ++;
                this.getList(true);
            }
        },
        downBack(){
            if(this.canLoading){
                this.page = 1;
                this.isEnd = false;
                this.getList();
            }
        },
    },
    mounted(){
        this.key = decodeURIComponent(this.common.getUrlParam('search'));
        history.init(this);
        let storage = history.getData();
        if(storage){
            this.historyBack(storage)
        }else{
            this.getList();
        }
    },
    components:{
        popUp,
        noData,
        goods,
        scroll,
    }
}
</script>
<style lang="less">
@import url('../../less/header.less');
.margin-top{
    .pxRem(height,96);
}
.bottom-del{
    width: 100%;
    position: fixed;
    left: 0;
    bottom: 0;
    .pxRem(height,96);
    .pxRem(line-height,96);
    .pxRem(font-size,28);
    color: @white-color;
    text-align: center;
    background: @red-color;
}
.tab-list-clear{
    .flex();
    background: @white-color;
}
.tab-item-clear{
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
</style>
