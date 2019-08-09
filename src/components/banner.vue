<template>
    <!-- 轮播图 -->
    <div class="swiper-container">
        <div class="swiper-wrapper">
            <div class="swiper-slide"
            v-for="banner in banner_list"
            :key="banner.pic"
            @click="open(banner.url)">
                <img :src="banner.pic?banner.pic:banner" alt="">
            </div>
        </div>
        <div class="swiper-pagination"></div>
        <scroll-buy></scroll-buy>
    </div>
</template>
<script>
import img from '@/assets/banner.png';
import scrollBuy from '@/components/scrollBuy'
import Swiper from "swiper";
export default{
    props:{
        banner_list:{
            type:Array,
            default:()=>{
                return []
            }
        }
    },
    data(){
        return {
            banner:img
        }
    },
    methods:{
        open(val){
            if(!val){
                return;
            }
            location.href = val;
        }
    },
    mounted(){
        this.$nextTick(()=>{
            new Swiper(".swiper-container",{
                delay: 5000,
                autoplay: true,
                loop: false,
                pagination: { el: ".swiper-pagination"},
                direction: 'horizontal'
            })
        })
    },
    components:{
        scrollBuy
    }
}
</script>
<style lang="less">
@import url(../less/swiper.min.css);
@import url(../less/common.less);
.swiper-slide{
    img{
        width: 100%;
        .pxRem(height,240);
    }
}
.swiper-pagination-bullet{
    .border(2,@white-color);
    background: none;
    .pxRem(width,8);
    .pxRem(height,8);
}
.swiper-pagination-bullet-active{
    background: @white-color;
}
</style>
