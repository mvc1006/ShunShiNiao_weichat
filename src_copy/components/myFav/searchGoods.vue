<template>
    <scroll ref="scroll" :upBack="upBack" :downBack="downBack" :isEnd="isEnd">
        <list :goodList="list"></list>   
        <no-data v-show="list.length<=0"></no-data>
    </scroll>  
</template>

<script>
import list from './personalProduct.vue'
import mixins from './searchMixins'
export default {
    data(){
        return {
            type:1
        }
    },
    mixins:[mixins],
    components:{
        list
    }
}
</script>
