<template>
    <div class="sys-bg" v-if="showChit" @click="hideOwn">
        <div class="chat-box" @click.stop="">
            <img :src="chitImg" alt="">
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            chitImg:'',
            showChit:false
        }
    },
    methods:{
        userChit(id){
            const token = localStorage.getItem('token');
            let url = this.dataService.baseURL+'/wxapi/order/checkOrderCode?order_goods_id='
            url = url+id + '&token='+token;
            this.chitImg = url;
            this.showChit = true;
        },
        hideOwn(){
            this.showChit = false;
        }
    },
    mounted(){
        this.$eventBus.$on('userChit',(id)=>{
            this.userChit(id)
        })
    }
}
</script>

<style lang="less">
@import url('../../less/common.less');
.sys-bg{
    background: rgba(0, 0, 0, 0.4);
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    .flex();
    .justifyContent();
    .alignItems();
    .chat-box{
        .pxRem(width,560);
        .pxRem(height,560);
        img{
            width: 100%;
            height: 100%;
        }
    }
}
</style>
