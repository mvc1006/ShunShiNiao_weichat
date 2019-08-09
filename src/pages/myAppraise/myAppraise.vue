<template>
    <div class="container">
        <!-- 头部返回 -->
        <div class="header-top">
            <div class="back" @click="goBack">
                <div class="go-back"></div>
            </div>
            <div class="title">我的评价</div>
        </div>
        <scroll ref="scroll" :upBack="upBack" :downBack="downBack" :isEnd="isEnd">
            <ul class="appraise-list">
                <li class="appraise-item" 
                v-for="(item,index) in list"
                :key="index">
                    <div class="appraise-details">
                        <div class="left-photo">
                            <img :src="userInfo.avatar" alt="">
                        </div>
                        <div class="right-info">
                            <div class="right-info-title">
                                <span class="name">{{userInfo.nickname}}</span>
                                <span class="time">{{item.create_time}}</span>
                            </div>
                            <div class="right-info-star">
                                <span class="star-text">评分</span>
                                <star :num="item.goods_point"></star>
                            </div>
                            <div class="right-info-text">
                                {{item.text || '此用户没有填写评价'}}
                            </div>
                            <div class="show-all-text" v-if="item.showAll"  @click="showAllText(item)">
                                {{item.btnText}}
                            </div>
                            <ul class="right-info-img">
                                <li class="img-item" :class="className(item.image_list)"  v-for="(img,index) in item.image_list" :key="index">
                                    <img :src="img" :data-large="item.image_list_o[index]"  v-gallery="item.id">
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="pro-details"  @click="openDetails(item)">
                        <div class="detail-img">
                            <img :src="item.goods_pic" alt="">
                        </div>
                        <div class="details-info">
                            <p class="details-title">{{item.goods_name}}</p>
                            <p class="details-price">￥{{item.goods_price}}</p>
                        </div>
                    </div>
                </li>
            </ul>
            <no-data v-show="list.length<=0"></no-data>
        </scroll>
    </div>
</template>
<script>
import scroll from '@/components/scroll';
import star from '@/components/star.vue';
import noData from '@/components/myFav/personalNoData.vue'
import history from '@/js/history'
export default {
    name: "myAppraise",
    data() {
        return {
            list: [],
            isEnd:false,
            canLoading:true,
            page:1
        };
    },
    mounted(){
        history.init(this);
        let storage = history.getData();
        if(storage){
            this.historyBack(storage)
        }else{
            this.getList();
        }
    },
    computed:{
        userInfo:function(){
            const info = sessionStorage.getItem('user-info');
            if(info){
                return JSON.parse(sessionStorage.getItem('user-info'))
            }
        }
    },
    methods: {
        historyBack({items,scrollY,maxScroll}){
            this.list = items.list;
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
        initCont(data){
            for(let i=0;i<data.length;i++){
                const one = data[i];
                if(one.content.length>100){
                    one.text = one.content.substr(0,100)+'...';
                    one.btnText  = '全文';
                    this.$set(one,'showAll',true)
                }else{
                    one.text = one.content;
                    this.$set(one,'showAll',false)
                }
            }
            return data;
        },
        // 返回上一页
        goBack() {
            history.clearData();
            window.history.back();
        },
        getList(loading){
            history.clearData();
            this.canLoading = false;
            this.dataService.getMyOrderList({
                page:this.page
            }).then(resp => {
                this.dataService.handleResponse({
                    data: resp,
                    callback: data => {
                        if(loading){
                            if(data.length>0){
                                this.list = this.list.concat(this.initCont(data));
                            }else{
                                this.isEnd = true;
                            }
                        }else{
                            this.list = [].concat(this.initCont(data));
                        }
                        this.$nextTick(()=>{
                            this.$refs.scroll.scroll.refresh();
                        })
                        this.canLoading = true;
                    }
                });
            })
        },
        openDetails(data){
            this.$eventBus.$emit('goDetails');
            const isBuyPresent = (data.tab_type == 1)?true:false;
            const local = (data.goods_type == 1)?0:1;
            location.href = './sourceShopDetails.html?id='+data.goods_id + '&local='+local+'&isBuyPresent='+isBuyPresent;
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
        showAllText(item){
            // 全部显示的时候为1 
            if(item.click){
                item.text = item.content.substr(0,100)+'...';
                item.btnText = '全文';
            }else{
                item.text = item.content;
                item.btnText = '收起';
            }
            item.click = !item.click;
        },
        className(img){
            let className = '',imgLength  = img.length;
            switch (imgLength){
                case 1: 
                className = 'oneImg';
                break;
                case 2:
                className = 'twoImg';
                break;
                case 3:
                case 5: 
                case 6: 
                case 7: 
                case 9:
                className = 'threeImg';
                break;
                case 4:
                    className = 'threeImg fourImg';
                    break;
                case 8:
                className = 'eightImg';
                break; 
            }
            return className;
        },
    },
    components: {
        star,
        scroll,
        noData
    }
};
</script>
<style lang="less">
@import "../../less/header.less";
body{
    background: @background-color;
}
.appraise-item{
    background: @white-color;
    .pxRem(margin-top,16);
    .pxRem(padding-left,20);
    .pxRem(padding-right,20);
}
.appraise-details{
    .flex();
    .pxRem(padding-top,20);
    .pxRem(padding-bottom,4);
}
.left-photo{
   .pxRem(width,96);
   .pxRem(height,96);
   .borderRadius(48);
   overflow: hidden;
   .flexShrink(0);
}
.right-info{
    .flexGrow(1);
    overflow: hidden;
    .pxRem(margin-left,16);
    .pxRem(margin-right,16);
}
.right-info-title{
    .flex();
    .justifyContent(space-between);
    .name{
        color: #529ADF;
        .pxRem(font-size,24);
        .pxRem(line-height,46);
    }
    .time{
        color: @gray-light-text;
        .pxRem(font-size,24);
    }
}
.right-info-star{
    .flex();
    .alignItems();
    .star-text{
        color: @gray-text;
        .pxRem(font-size,24);
        .pxRem(margin-right,20);
    }
}
.right-info-text{
    color: @gray-text;
    .pxRem(font-size,24);
    .pxRem(line-height,36);
    text-overflow: ellipsis;
    display: -webkit-box;
    // -webkit-line-clamp: auto;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
.show-all-text{
    color: #529ADF;
    .pxRem(font-size,24);
    .pxRem(line-height,60);
}
.right-info-img{
    .flex();
    .alignItems();
    .flexWrap(wrap);
    .img-item{
        .flexShrink(0);
        .pxRem(margin-right,16);
        .pxRem(margin-bottom,16);
        .borderRadius(8);
        overflow: hidden;
        img{
            width: 100%;
            height: 100%;
        }
    }
    >.oneImg{
        .pxRem(width,336);
        .pxRem(height,336);
    }
    >.twoImg{
        .pxRem(width,248);
        .pxRem(height,248);
    }
    >.threeImg{
        .pxRem(width,160);
        .pxRem(height,160);
    }
    >.fourImg:nth-child(2){
        .pxRem(margin-right,160);
    }
    >.eightImg{
        .pxRem(width,116);
        .pxRem(height,116);
    }
}

.pro-details{
    .borderTop(2,@border-color,dashed);
    .pxRem(padding-top,20);
    .pxRem(padding-bottom,20);
    .flex();
    .detail-img{
        overflow: hidden;
        .borderRadius(8);
        .pxRem(width,112);
        .pxRem(height,112);
    }
    .details-info{
        .flexGrow(1);
        .pxRem(margin-left,20);
        .flex(column);
        .justifyContent(space-between);
    }
    .details-title{
        .pxRem(font-size,24);
        .pxRem(line-height,36);
        color: @gray-text;
    }
    .details-price{
        .pxRem(font-size,26);
        color: @red-color;
    }
}

</style>
