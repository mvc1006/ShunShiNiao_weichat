<template>
	<div class="viewport">
		<!-- 头部返回 -->
		<div class="header">
			<span class="go-back" @click="goBack"></span>
			<div>我的商家</div>
			<span class="num">数量 : <span>{{storeTotal}}</span></span>
		</div>
		<!-- 排序方式 -->
		<div class="sort">
			<div :class="order_by=='sales_1'?'active':''" @click="cutSort('sales_1')">
				<span>营业额</span>
				<img v-show='order_by=="sales_1"' src='../../assets/active_arrows.png'/>
				<img v-show='order_by!="sales_1"' src='../../assets/noActive_arrows.png'/>
			</div>
			<div :class="order_by=='distance_0'?'active':''" @click="cutSort('distance_0')">
				<span>距离</span>
				<img v-show='order_by=="distance_0"' src='../../assets/active_arrows.png'/>
				<img v-show='order_by!="distance_0"' src='../../assets/noActive_arrows.png'/>
			</div>
			<div :class="order_by=='join_date_1'?'active':''" @click="cutSort('join_date_1')">
				<span>加入时间</span>
				<img v-show='order_by=="join_date_1"' src='../../assets/active_arrows.png'/>
				<img v-show='order_by!="join_date_1"' src='../../assets/noActive_arrows.png'/>
			</div>
		</div>
		<!-- 商家列表 -->
		<!-- <scroll v-if="storeList.length>0" ref="scroll" :upBack="upBack" :downBack="downBack" :isEnd="isEnd"> -->
		<div class="merchant-list" v-if="storeList.length>0">
			<div class="merchant-item" v-for='(store,index) in storeList' @click='goToMerchant(index)'>
				<div class="merchant-name">
					<span>{{store.shop_name}}<img src="../../assets/advance.png"/></span>
					<span>{{store.distance}}</span>
				</div>
				<div class="merchant-data">
					<div class="merchant-img">
						<span :style="{backgroundImage: 'url(' + store.logo + ')'}"></span>
						<!-- <span style="background-image: url(http://img5.imgtn.bdimg.com/it/u=757234747,1163200708&fm=26&gp=0.jpg)"></span> -->
					</div>
					<div class="merchant-explain">
						<div>加入商圈时间:<span>{{store.join_date}}</span></div>
						<div>店铺启用状态:<span>{{store.status==1?"开启":"关闭"}}</span></div>
						<div>累计营业额:<span>{{store.total_sales}}</span></div>
						<div>距离合同有效期还剩:<span>{{store.end_day_count}}</span></div>
					</div>
				</div>
			</div>
		</div>
		<!-- </scroll> -->
		<div class="noShopList" v-if="storeList.length==0">
			<img src="../../assets/no_shopkeeper.png" alt=""> 
			<div class='text'>暂无相关信息</div>
		</div>
	</div>
</template>
<script>
	import scroll from '@/components/scroll';
	import VueRouter from "vue-router";
	import Vue from "vue";
	Vue.use(VueRouter);
	const routes = [
		{path:'/' ,redirect: '/sales_1'},
		{path: '/sales_1',template:''},
		{path: '/distance_0',template:''},
		{path: '/join_date_1',template:''}
	]
	const router = new VueRouter({
		routes
	})
	export default {
		name:'index',
		router,
		data(){
			return {
				lat: '', // 纬度
				lng: '', // 经度
				city_id: '', // 城市id
				canLoading:true, // 是否加载完成
				isEnd:false, // 分页加载是否结束
				pages: 1, // 分页加载
				order_by: 'sales_1', // 排序方式
				storeList: [], // 店铺列表
				storeTotal: 0, // 店铺数量
			}
		},
		mounted(){
			let add = sessionStorage.getItem('user-addr');
			if(add){
				this.lng = JSON.parse(add).lng;
				this.lat = JSON.parse(add).lat;
				this.city_id = JSON.parse(add).city_id
				var routerPath = this.$route.path.substring(1);
				if(routerPath=="sales_1"){
					this.request();
				}else{
					this.cutSort(routerPath)
				}
			}
		},
		computed:{
			isTrading(){
				return localStorage.getItem('isTrading')=="true"?true:false;
			},
			area_id(){
				return localStorage.getItem('area_id');
			}
		},
		methods:{
			request(){
				this.dataService.shopList({
					area_id: this.area_id,
					lng: this.lng,
					lat: this.lat,
					order_by: this.order_by,
				}).then(resp=>{
					this.dataService.handleResponse({
						data:resp,
						callback:(data)=>{
							if(this.pages == 1){
								this.storeList = [];
							}
							this.storeTotal = data.count;
							this.storeList = data.list;
						}
					})
				})
			},
			// 返回
			goBack(){
				history.back(-1)
			},
			// 切换排序方式
			cutSort(num){
				if(this.order_by == num) return false;
				this.$router.replace(num)
				this.order_by = num;
				this.request();
			},
			// 跳转商家店铺信息
			goToMerchant(num){
				location.href = './storeMerchant.html?isTrading=' + this.isTrading +'&shop_id='+this.storeList[num].shop_id+'&shop_name='+this.storeList[num].shop_name
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
  	@import "myMerchant.less";
</style>
