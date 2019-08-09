<template>
    <div class="container">
        <top  class="cont-top"></top>
        <popUp v-if="commonData.isPopUp" :type="commonData.popupType" :time="commonData.popupTime" :content="commonData.popupContent"></popUp>
        <bottom :num="number" class="cont-bottom"></bottom>
    </div>
</template>
<script>
import bottom from '@/components/bottom';
import top from '@/components/personCenterTop';
import localStorageCorrelation from '../../js/localStorageCorrelation';
import popUp from '@/components/popUp';
export default {
    name:'app',
    data(){
        return {
            number: 4,
        }
    },
    computed:{
        commonData(){
            return this.$store.state.commonData
        }
    },
    mounted(){
        localStorageCorrelation.getLocalStorage(this);
    },
    methods:{
        
    },
    components:{
        bottom,
        top,
        popUp
    }
}
</script>
<style lang="less">
    @import url('../../less/personCenter.less');
</style>

