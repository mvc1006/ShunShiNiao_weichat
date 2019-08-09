<template>
    <div class="container">
        <div class="header-top">
            <div class="back" @click="goBack">
                <div class="go-back"></div>
            </div>
            <div class="title">已提现</div>
        </div>
        <scroll ref="scroll" :isEnd="isEnd" :upBack="upBack" :downBack="downBack" >
            <ul class="list-cont"  v-if="data.length>0">
                <li class="list-item" v-for="(item,index) in data" :key="index" @click="openDetails(item)">
                    <p class="list-item-top">
                        <span class="left">{{item.desc}}</span>
                        <span class="right">{{item.amount}}</span>
                    </p>
                    <p class="list-item-bottom">
                        <span class="left">{{item.create_time}}</span>
                        <span class="right">{{initStatus(item.apply_status)}}</span>
                    </p>
                </li>
            </ul>
            <no-data v-else></no-data>
        </scroll>
    </div>
</template>

<script>
import scroll from '@/components/scroll.vue'
import noData from '@/components/incomeDetails/noData.vue'
import history from '@/js/history'
export default {
    name:'app',
    data(){
        return {
            data:[],
            isEnd:false,
            canLoading:true,
            page:1
        }
    },
    methods:{
        historyBack({items,scrollY,maxScroll}){
            this.data = items.data;
            this.canLoading = true;
            this.page = items.page;
            this.isEnd = items.isEnd;
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
            history.clearData();
            window.history.back();
        },
        upBack(){
            if(this.canLoading){
                this.page++ ;
                this.getData(true);
            }
        },
        downBack(){
            if(this.canLoading){
                this.page = 1 ;
                this.isEnd = false;
                this.getData();
            }
        },
        getData(load){
            history.clearData();
            this.canLoading = false;
            if(this.isTrading){
                this.dataService.areaerCashApplyFlow({
                    page:this.page,
                    area_id: localStorage.getItem("area_id")
                }).then(resp=>{
                    this.dataService.handleResponse({
                        data:resp,
                        callback:(data)=>{
                            this.disposeData(load,data)
                        }
                    })
                })
                return false
            }
            this.dataService.alreadyComeList({
                page:this.page
            }).then(resp=>{
                this.dataService.handleResponse({
                    data:resp,
                    callback:(data)=>{
                        this.disposeData(load,data)
                    }
                })
            })
        },
        disposeData(load,data){
            if(load){
                if(data.length>0){
                    this.data = this.data.concat(data);
                }else{
                    this.isEnd = true;
                }
            }else{
                this.data = [].concat(data);
            }
            this.$nextTick(()=>{
                this.$refs.scroll.scroll.refresh();
            })
            this.canLoading = true;
        },
        initStatus(val){
            let result = '';
            switch(val){
                case 0://提现状态:0-申请中,1-已打款,2-被拒绝
                    result = '申请中';
                break;
                case 1://提现状态:0-申请中,1-已打款,2-被拒绝
                    result = '已打款';
                break;
                case 2://提现状态:0-申请中,1-已打款,2-被拒绝
                    result = '已拒绝';
                break;
            }
            return result;
        },
        openDetails(data){
            this.$eventBus.$emit('goDetails')
            location.href = './shopComeAlreadyDetails.html?id='+data.id;
        }
    },
    computed: {
        isTrading(){
          return localStorage.getItem('isTrading')=="true"?true:false;
        }
    },
    mounted(){
        history.init(this);
        let storage = history.getData();
        if(storage){
            this.historyBack(storage)
        }else{
            this.getData();
        }
    },
    components:{
        scroll,
        noData
    }

}
</script>


<style lang="less">
@import url('../../less/header.less');
body{
    background: @background-color;
}
.list-cont{
    .pxRem(margin-top,20);
    .pxRem(padding-left,30);
    .pxRem(padding-right,30);
    background: @white-color;
}
.list-item{
    .borderBottom(2);
    .pxRem(padding-top,20);
    .pxRem(padding-bottom,20);
    &:last-child{
        border:0;
    }
}
.list-item-top{
    color:@gray-text;
    .flex();
    .alignItems();
    .pxRem(font-size,26);
}
.list-item-bottom{
    color:@gray-light-text;
    .flex();
    .alignItems();
    .pxRem(font-size,24);
}
.left{
    .flexGrow(1);
}
</style>
