<template>
    <div>
        <div class="store-list" 
        v-for="(item,index) in storeList" 
        :key="index"
         @click="storeClick(item)">
            <div class="left-select" v-show="showCheck">
                <input type="checkbox" :checked="item.checked" >
            </div>
            <div class="store-photo">
                <img :src="item.logo" alt="">
            </div>
            <div class="store-name" v-text="item.shop_name"></div>
            <div class="go-store">进店逛逛</div>
        </div>
    </div>
</template>
<script>
export default {
    props:{
        storeList:{
            type:Array,
            default:[]
        },
        showCheck:{
            type:Boolean,
            default:false
        },
        storeSelect:{
            type:Function
        }
    },
    data() {
        return {
            
        }
    },
    methods: {
        storeClick(item){
            if(this.showCheck){
                this.storeSelect(item)
            }else{
                this.$eventBus.$emit('goDetails');
                let isLoacl = item.goods_type == 1 ? true:false
                location.href = './storeMerchant.html?shop_id='+item.shop_id + 
            '&local=' + isLoacl + "&shop_name=" + encodeURIComponent(item.shop_name)
            }
        }
    }
}
</script>
<style lang="less">
@import url('../../less/common.less');
 .pro-cont{
     .flexGrow(1);
    .pxRem(padding-top,20);
    .pxRem(padding-right,16);
    .pxRem(padding-bottom,20);
    .pxRem(padding-top,16);
    overflow: scroll;
}
.store-list{
    .flex();
    .alignItems(center);
    background: @white-color;
    .borderRadius(8);
    .pxRem(padding-top,16);
    .pxRem(padding-bottom,16);
    .pxRem(margin-top,16);
}
.left-select{
    .flexShrink(0);
    .pxRem(margin-left,16);
    .pxRem(width,32);
    .pxRem(height,32);
}
.store-photo{
    .flexShrink(0);
    .pxRem(width,88);
    .pxRem(height,88);
    .pxRem(margin-left,16);
    .borderRadius(44);
    overflow: hidden;
    img{
        width: 100%;
        height: 100%;
    }
}
.store-name{
    .pxRem(margin-left,16);
    color: @gray-text;
    .pxRem(font-size,28);
    .flexGrow(1);
}
.go-store{
    .flexShrink(0);
    .pxRem(width,112);
    .pxRem(line-height,48);
    color: @red-color;
    text-align: center;
    .pxRem(font-size,20);
    .border(2,@red-color);
    .borderRadius(24);
    .pxRem(margin-right,16);
}
</style>
