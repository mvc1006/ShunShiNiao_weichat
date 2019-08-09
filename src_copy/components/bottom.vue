<template>
<div>
   <ul class="footer-list">
        <li class="footer-item first" :class='{"active":num == 0}' @click="open(0)">
            <div class="footer-cont-img"></div>
            <div class="footer-cont-text">源头好产品</div>
        </li>
        <li class="footer-item second"  :class='{"active":num == 1}' @click="open(1)">
            <div class="footer-cont-img"></div>
            <div class="footer-cont-text">本地好服务</div>
        </li>
        <li class="footer-item third"  :class='{"active":num == 2}' @click="open(2)">
            <div class="footer-cont-img"></div>
            <div class="footer-cont-text">分享赚赠品</div>
        </li>
        <li class="footer-item forth"  :class='{"active":num == 3}' @click="open(3)">
            <div class="footer-cont-img"></div>
            <div class="footer-cont-text">购物车</div>
        </li>
        <li class="footer-item fifth"  :class='{"active":num == 4}' @click="open(4)">
            <div class="footer-cont-img"></div>
            <div class="footer-cont-text">个人中心</div>
        </li>
    </ul>
    <shopGroup :isSuspension='true'></shopGroup>
</div>
</template>
<script>
import shopGroup from '../components/shopGroups'
export default {
    props:{
        num:{
            type:Number,
            default:0
        }
    },
    data(){
        return {
            link:[
                './index.html',
                './localService.html',
                './shareMark.html',
                '',
                './personCenter.html',
            ]
        }
    },
    computed:{
        commonData(){
            return this.$store.state.commonData
        }
    },
    methods:{
        open(num){
            if(this.num == num) return false;
            if(this.link[num]){
                location.href = this.link[num];
            }else{
                this.commonData.isGroup = true
            }
        }
    },
    components:{
        shopGroup
    }
}
</script>
<style lang="less">
    @import url('../less/common.less');
    .footer-list{
        background: @white-color;
        .alignItems(center);
        .flex(row);
        .justifyContent(center);
        .pxRem(height,96);
        .borderTop(2);
    }
    .footer-item{
        .flexGrow(1);
        .flex(column);
        .justifyContent(space-around);
        width: 20%;
    }
    .footer-cont-img{
        background-size: 100%;
        margin: 0 auto;
        .pxRem(width,44);
        .pxRem(height,44);
        .pxRem(margin-top,10);
    }

    .footer-cont-text{
        color: @gray-text;
        text-align:center;
        .pxRem(font-size,20);
        .pxRem(margin-top,6);
    }
    .first{
        .footer-cont-img{
            background: url(../assets/source_unselected.png) no-repeat center;
            background-size: 100%;
        }
        &.active{
            .footer-cont-img{
                background: url(../assets/source_active.png) no-repeat center;
                background-size: 100%;
            }
            .footer-cont-text{
                color: @red-color;
            }
        }
    }
    .second{
        .footer-cont-img{
            background: url(../assets/serve_unselected.png) no-repeat center;
            background-size: 100%;
        }
        &.active{
            .footer-cont-img{
                background: url(../assets/serve_active_aa.png) no-repeat center;
                background-size: 100%;
            }
            .footer-cont-text{
                color: @red-color;
            }
        }
    }
    .third{
        .footer-cont-img{
            background: url(../assets/sharePresent_before.png) no-repeat center;
            background-size: 100%;
        }
        &.active{
            .footer-cont-img{
                background: url(../assets/sharePresent_after.png) no-repeat center;
                background-size: 100%;
            }
            .footer-cont-text{
                color: @red-color;
            }
        }
    }
    .forth{
        .footer-cont-img{
            background: url(../assets/shopCar_before.png) no-repeat center;
            background-size: 100%;
        }
        &.active{
            .footer-cont-img{
                background: url(../assets/shopCar_after.png) no-repeat center;
                background-size: 100%;
            }
            .footer-cont-text{
                color: @red-color;
            }
        }
    }
    .fifth{
        .footer-cont-img{
            background: url(../assets/my_unselected.png) no-repeat center;
            background-size: 100%;
        }
        &.active{
            .footer-cont-img{
                background: url(../assets/my_active.png) no-repeat center;
                background-size: 100%;
            }
            .footer-cont-text{
                color: @red-color;
            }
        }
    }
</style>
