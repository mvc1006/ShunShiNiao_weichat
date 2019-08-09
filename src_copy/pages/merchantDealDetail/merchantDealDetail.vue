<template>
	<div class="viewport">
		<!-- 头部返回 -->
		<div class="header">
			<span class="go-back" @click="goBack"></span>
			<div>{{pageType=='detail'?'收入明细':'商家营业额'}}</div>
		</div>
		<!-- 商家列表 -->
		<scroll v-if="dataList.length>0" ref="scroll" :upBack="upBack" :downBack="downBack" :isEnd="isEnd">
			<div class="detail_list">
				<div class="detail_item" v-for='(data,index) in dataList'>
					<div class="price_explain">
						<div class="price_name">{{data.name}}</div>
						<div class="price_time">{{data.settle_date}}</div>
					</div>
					<div class="price">
						<div class="price_type" v-if="pageType=='detail'">(营业额：¥{{data.balance_amount}})</div>
						<div class="price_type" v-if="pageType=='extract'">(营业额：¥980)</div>
						<div class="price_num">{{data.price}}</div>
					</div>
				</div>
			</div>
		</scroll>
		<div class="noShopList" v-if="dataList.length==0">
			<img src="../../assets/no_shopkeeper.png" alt=""> 
			<div class='text'>暂无相关信息</div>
		</div>
	</div>
</template>
<script>
	import scroll from '@/components/scroll';
	export default {
		name:'index',
		data(){
			return {
				dataList: [], // 数据列表
				canLoading:true, // 是否加载完成
				isEnd:false, // 分页加载是否结束
				pages: 1, // 分页加载
			}
		},
		mounted(){
			this.request();
		},
		computed: {
			pageType(){
				return this.common.getUrlParam("pageType")
			}
		},
		methods:{
			// 返回
			goBack(){
				history.back(-1)
			},
			// 请求后台
			request(){
				if(this.pageType=='detail'){
					this.dataService.areaerBalanceFlow({
						area_id: localStorage.getItem('area_id'),
						page: this.pages
					}).then(resp=>{
						this.dataService.handleResponse({
							data:resp,
							callback:(data)=>{
								this.dataDispose(data);
							}
						})
					})
					return false;
				}
				if(this.pageType=='extract'){
					this.dataService.areaerCashApplyFlow({
						area_id: localStorage.getItem('area_id'),
						shop_id: this.common.getUrlParam("store_id"),
						page: this.pages
					}).then(resp=>{
						this.dataService.handleResponse({
							data:resp,
							callback:(data)=>{
								this.dataDispose(data);
							}
						})
					});
					return false;
				}
				this.dataService.shopSalesFlow({
					area_id: localStorage.getItem('area_id'),
					shop_id: this.common.getUrlParam("store_id"),
					page: this.pages
				}).then(resp=>{
					this.dataService.handleResponse({
						data:resp,
						callback:(data)=>{
							this.dataDispose(data);
						}
					})
				})
			},
			// 处理获取的数据
			dataDispose(data){
				if(this.pages==1){
					this.dataList = [];
				}
				if(data.length==0){
					this.isEnd = true;
				}
				var dataList = [];
				for(let i = 0;i<data.length;i++){
					if(this.pageType=='detail'){
						dataList.push({
							name: data[i].shop_name,
							settle_date: data[i].settle_date,
							price: data[i].balance_amount,
							balance_amount: data[i].settle_amount
						})
					}else if(this.pageType=='extract'){
						dataList.push({
							name: data[i].shop_name,
							settle_date: data[i].settle_date,
							price: data[i].settle_amount
						})
					}else{
						dataList.push({
							name: data[i].shop_name,
							settle_date: data[i].settle_date,
							price: "¥"+data[i].settle_amount
						})
					}
				}
				this.dataList = this.dataList.concat(dataList);
				this.$nextTick(()=>{
					if(this.$refs.scroll&&this.$refs.scroll.scroll){
						this.$refs.scroll.scroll.refresh();
					}
                });
			},
			// 上拉刷新
			upBack(){
				if(this.canLoading){
					this.pages ++;
					this.request();
				}
			},
			// 下拉刷新
			downBack(){
				if(this.canLoading){
					this.pages = 1;
					this.cate_list = [];
					this.goods_list = [];
					this.isEnd = false;
					this.request();
				}
        	}
		},
		components:{
			scroll
		}
	}
</script>
<style lang="less">
  	@import "merchantDealDetail.less";
</style>
