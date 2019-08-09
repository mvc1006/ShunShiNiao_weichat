<template>
    <div class="viewport">
		<!-- 顶搜索框 -->
		<div class="header">
			<div class="go-back" @click="goBack"></div>
			<div class="search">
				<span class="search-img"></span>
				<input v-on:input="inputContent" class="input" v-model="input" :placeholder="placeholder" type="text" @keyup.enter="gotoSearch">
				<img @click="input = ''" src="../../assets/delete.png" v-if="input!=''">
			</div>
			<span @click="gotoSearch()">搜索</span>
		</div>
		<!-- 历史搜索 -->
		<div class="search-history" v-if="input==''">
			<span>历史搜索</span>
			<img src="../../assets/rubbish-pail.png" @click="deleteHistory">
		</div>
		<!-- 历史列表 -->
		<div class="history-list" v-if="input==''">
			<span class="history-item" @click="gotoSearch('history',index)" :key="index" v-for="(history,index) in historyList">{{history}}</span>
		</div>
		<!-- 搜索列表 -->
		<div class="search-list" v-if="input!='' && come != 'orderSearch'">
			<div class="search-item" @click="gotoSearch('search',index)" :key="index" v-for="(search,index) in searchList">
				<div class="text" v-html="format(search)"></div>
				<img src="../../assets/proceed-search.png" alt="">
			</div>
		</div>
    </div>
</template>
<script>
	import common from '@/js/common';
	export default {
		name:'particulars',
		data(){
			return {
				input: '', // 输入框内容
				placeholder: '', // 输入框默认内容
				historyList: [], // 历史搜索内容
				tab_type: '',  // 专区类型
				goods_type: '', // 商品类型
				searchList: [],  // 搜索提示内容
			}
		},
		mounted(){
			this.getHistoryList();
			this.tab_type = common.getUrlParam("tab_type");
			this.goods_type = common.getUrlParam("goods_type");
		},
		methods:{
			// 返回
			goBack(){window.history.go(-1);},
			// 获取搜索历史
			getHistoryList(){
				var historyList = JSON.parse(localStorage.getItem('historyList'));
				if(!historyList){
					historyList = [];
					return false;
				}
				this.historyList = historyList;
			},
			// 设置搜索历史
			setHistoryList(){
				this.historyList = Array.from(new Set(this.historyList));
				localStorage.setItem("historyList",JSON.stringify(this.historyList));
			},
			// 请求后台提示文字
			inputContent(){
				if(!this.input) return false;
				var that = this,param= {};
				if(this.share_main_order_goods_id){
					param = {
						share_main_order_goods_id: this.share_main_order_goods_id,
						tab_type: this.tab_type, // 专区类型
						goods_type: this.goods_type, // 商品类型
						keywords: this.input,
					}
				}else{
					param= this.params;
					let addr = sessionStorage.getItem('user-addr') ? JSON.parse(sessionStorage.getItem('user-addr')):{};
					param.keywords = this.input;
					param.tab_type = this.tab_type; // 专区类型
					param.goods_type = this.goods_type; // 商品类型
					if(common.getUrlParam("cat_id")!='null'){
						param.cat_id = common.getUrlParam("cat_id");
					}
					if(this.goods_type == '2'){
						param.city_id = addr.city_id;
					}
					if(this.goods_type == '2'){
						param.city_id = addr.city_id;
					}
					if(this.active_id){
						param.activity_id = this.active_id
					}
				}
				this.dataService.searchKey(param).then(function(resp) {
					that.dataService.handleResponse({
						data: resp,
						callback: function(data){
							that.searchList = data;
						}
					})
				})
			},
			// 格式化提示文字
			format(text){
				return text.replace(this.input,'<span>'+this.input+'</span>')
			},
			// 删除历史搜索记录
			deleteHistory(){
				this.historyList = [];
				this.setHistoryList();
			},
			// 去搜索
			gotoSearch(type,num){
				var search = '';
				if(type =='search'){
					search = this.searchList[num];
				}else if(type == 'history'){
					search = this.historyList[num];
				}else{
					if(this.input){
						search = this.input;
					}else{
						search = this.placeholder;
					}
				}
				if(search){
					this.historyList.unshift(search);
					this.setHistoryList();
				}
				const page = common.getUrlParam('page');
				if(page=='storeShop'){
					const mainMenu = common.getUrlParam('mainMenu');
					window.location.href = './storeSearchShop.html?search='+encodeURIComponent(search)+'&mainMenu='+ mainMenu + "&shop_id=5";
					return false;
				}
				if(this.come){
					location.href = './'+this.come+'.html?search='+encodeURIComponent(search);
				}else{
					if(this.share_main_order_goods_id){
						window.location.href = './searcResult.html?search='+encodeURIComponent(search)+"&tab_type="+this.tab_type+"&goods_type=" + this.goods_type + "&share_main_order_goods_id=" + this.share_main_order_goods_id
						return false;
					}
					window.location.href = './searcResult.html?search='+encodeURIComponent(search)+"&tab_type="+this.tab_type+'&goods_type='+this.goods_type + "&id=" + (common.getUrlParam('cat_id') || '')+'&isEmptyShopGroup='+common.getUrlParam("isEmptyShopGroup") + '&active_id=' + common.getUrlParam("active_id")
				}
			}
		},
		computed: {
			params(){
				var ssn_shopGroup = JSON.parse(localStorage.getItem('ssn_shopGroup'));
				if(!ssn_shopGroup) {
					ssn_shopGroup = {
						mainShop: {},
						presentList: [],
					}
				}else if(!ssn_shopGroup.mainShop){
					ssn_shopGroup.mainShop = {};
				}else if(!ssn_shopGroup.presentList){
					ssn_shopGroup.presentList = [];
				}
				var goods_give_item_id = [],select_give_goods_id = [],obj = '';
				for(let i = 0; i < ssn_shopGroup.presentList.length; i ++){
					goods_give_item_id.push(ssn_shopGroup.presentList[i].actualSpe);
					select_give_goods_id.push(ssn_shopGroup.presentList[i].goods_id);
				}
				return {
					select_main_goods_id: ssn_shopGroup.mainShop.goods_id?ssn_shopGroup.mainShop.goods_id:null,
					goods_main_item_id:  ssn_shopGroup.mainShop.actualSpe?ssn_shopGroup.mainShop.actualSpe:0,
					select_give_goods_id: select_give_goods_id.join(","),
					goods_give_item_id: goods_give_item_id.join(","),
				}
			},
			active_id(){
				return Number(common.getUrlParam("active_id")) || '';
			},
			share_main_order_goods_id(){
				return Number(common.getUrlParam('share_main_order_goods_id')) || ''
            },
            come:function(){
                return this.common.getUrlParam('come')
            }
		}
	}
</script>
<style lang="less">
  	@import "search.less";
</style>
