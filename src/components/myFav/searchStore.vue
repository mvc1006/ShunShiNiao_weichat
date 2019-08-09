<template>
    <scroll ref="scroll" :upBack="upBack" :downBack="downBack" :isEnd="isEnd">
        <list :storeList="list"></list>
        <no-data v-show="list.length<=0"></no-data>
    </scroll>  
</template>

<script>
import list from './personalStore'
import mixins from './searchMixins'
export default {
    data(){
        return {
            type:2
        }
    },
    mixins:[mixins],
    components:{
        list
    }
}
</script>