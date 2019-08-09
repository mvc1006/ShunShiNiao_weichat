<template>
    <scroll ref="scroll" :upBack="upBack" :downBack="downBack" :isEnd="isEnd">
        <banner class="banner" :banner_list="bannerList" v-if="bannerList.length>0"></banner>
        <classify :list="classify"></classify>
        <activity-in :goods_type="2" :list="activityList"></activity-in>
        <div class="pro-list-cont">
            <h2>—&nbsp;&nbsp;主推荐&nbsp;&nbsp;—</h2>
            <div class="pro-list">
                <!-- <pro-item v-for="(item,index) in product" :key="index" :data="item" :isMain="true" :showShopInfo="true"></pro-item> -->
                <shop-list-new :isMainShop="true" :isLocal='true' :shop-list="product" :isStore='true'></shop-list-new>
            </div>
            <div class="loading" v-if="!canLoading"></div>
            <no-data v-else-if="product.length<=0"></no-data>
        </div>
    </scroll>
</template>
<script>
import mixins from './mixins.js'
export default {
    mixins:[mixins]
}
</script>
