<template>
    <div ref="mescroll" class="mescroll">
        <div class="scroll-cont">
            <div class="scroll-top-text" v-show="dropDown">下拉刷新</div>
            <slot></slot>
            <div class="scroll-bottom-text" v-show="dropUp">{{loadText}}</div>
        </div>
    </div>
</template>
<script>
import BScroll from 'better-scroll';
export default {
    props:{
        // 上划回调
        upBack:{
            type:Function
        },
        // 下拉回调
        downBack:{
            type:Function
        },
        // 是否加载完成
        isEnd:false
    },
    data(){
        return {
            dropDown:false,
            dropUp:false,
            loadText:'上拉加载更多'
        }
    },
    methods:{
        scrollFn(){
            this.$nextTick(() => {
                if (!this.scroll) {
                    this.scroll = new BScroll(this.$refs.mescroll, {
                        click: true,
                        scrollY: true,
                        refreshDelay:100,
                        probeType:2
                    });
                }else{
                    this.scroll.refresh();
                }
                this.scroll.on('scroll', (pos) => {
                    this.$eventBus.$emit('scrollStart');
                    //如果下拉超过50px 就显示下拉刷新的文字
                    if(pos.y>50){
                        this.dropDown = true
                    }
                    // 上拉显示文字
                    else if(this.scroll.maxScrollY>pos.y+10){
                        this.dropUp = true;
                    }
                })
                //touchEnd（手指离开以后触发） 通过这个方法来监听下拉刷新\
                this.scroll.on('touchEnd', (pos) => {
                    // 下拉动作
                    if(pos.y > 50){
                        this.dropDown = false;
                        this.downBack();
                        this.loadText = '上拉加载更多'
                    }
                    //上拉加载 总高度>下拉的高度+10 触发加载更多
                    else if(this.scroll.maxScrollY>pos.y+10){
                        if(!this.isEnd){
                            this.upBack();
                        }
                    }
                })
                let wrapperHeight = this.scroll.wrapperHeight;
                let hide = true;
                this.scroll.on('scrollEnd',(pos)=>{
                    this.$eventBus.$emit('scrollEnd');
                    if(Math.abs(pos.y) < wrapperHeight){
                        if(!hide){
                            hide = true;
                            this.$eventBus.$emit('goTopHide',hide);
                        }
                    }else{
                        if(hide){
                            hide = false;
                            this.$eventBus.$emit('goTopHide',hide);
                        }
                    }
                })
            });
        }
    },
    watch:{
        isEnd:function(val){
            this.$nextTick(()=>{
                if(val){
                    this.loadText = '我也是有底线的~~';
                    this.dropUp = true;
                }else{
                    this.loadText = '上拉加载更多'
                    this.dropUp = false;
                }
                this.scroll.refresh();
            })
        }
    },
    mounted(){
        this.scrollFn();
    },
    destroyed(){
        this.scroll.destroy();
    }
}
</script>
<style lang="less">
    @import url('../less/common.less');
    .mescroll{
        overflow-y: hidden;
        overflow-x: visible;
        position: relative;
        .flexGrow(1);
    }
    .scroll-cont{
        overflow-y: auto;
        overflow-x: visible;
    }
    .scroll-top-text,.scroll-bottom-text{
        .pxRem(line-height,70);
        text-align: center;
    }
</style>
