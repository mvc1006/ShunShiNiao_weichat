<template>
	<div class="viewport">
		<!-- 头部返回 -->
		<div class="header">
			<span class="go-back" @click="goBack"></span>
			<div>退换货</div>
		</div>
		<!-- 订单每一步流程 -->
		<div class="order-details">
			<div class="line"></div>
			<div class="order-item" v-for="(refund,index) in refund_status_list" :key="index">
				<div class="circle" :class="index==0?'active':''"><div></div></div>
				<div class="order-item-name">{{refund.opt_desc}}</div>
				<div class="order-item-content">{{refund.opt_msg}}</div>
				<div class="order-item-content">{{refund.opt_time}}</div>
				<div class="btn" v-if="restatus==10">
					<span @click="openPopup(1)" v-if="refund_type_val == 1">同意退款</span>
					<span @click="openPopup(1)" v-else-if="refund_type_val == 2">同意退货</span>
					<span @click="openPopup(1)" v-else>同意换货</span>
				</div>
			</div>
			<div class="order-item">
				<div class="circle" :class="refund_status_list.length==0?'active':''"><div></div></div>
				<div class="shop-area">
					<div class="shop-img"><img :src="shop_data.gimg" alt=""></div>
					<div class="shop-data">
						<div class="shop-name">{{shop_data.goods_name}}</div>
						<div class="shop-time">支付时间：{{shop_data.paytime}}</div>
						<div class="shop-price">销售价：<span>￥{{shop_data.sprice}}</span></div>
					</div>
				</div>
				<div class="other-data">
					<div class="linkman">
						<span>联系人：{{consignee.consignee}}</span>
						<span class="phone"><img src="" alt="">{{consignee.telephone}}</span>
					</div>
					<div class="site">联系地址：{{consignee.caddress}}</div>
					<div class="refund">退款类型：{{refund_data.refund_type}}</div>
					<div class="refund">退款原因：{{refund_data.refund_reason}}</div>
					<div class="refund">退款说明：{{refund_data.refund_desc}}</div>
					<div class="refund">退款金额：{{refund_data.refund_sum}}</div>
					<div class="refund">图片凭证：</div>
					<div class="img-voucher">
						<img v-gallery="'reason'"
						v-for="(item,index) in refund_data.refund_imgs"
						:key="index"
						:src="item.image_url_s"
						:data-large="item.image_url" alt="">
					</div>
					<div class="equity refund">根据《消费者权益保护法》规定，顺势鸟支持7天无理由退换货，对符合 要求的商品，卖家需要配合退换货处理。</div>
					<div class="btn" v-if="refund_status_list.length==0">
						<template v-if="refund_type_val == 1">
							<span @click="openPopup(1)">同意退款</span>
							<span @click="openPopup(2)">拒绝退款</span>
						</template>
						<template v-else-if="refund_type_val == 2">
							<span @click="openPopup(1)">同意退货</span>
							<span @click="openPopup(2)">拒绝退货</span>
						</template>
						<template v-else>
							<span @click="openPopup(1)">同意换货</span>
							<span @click="openPopup(2)">拒绝换货</span>
						</template>
					</div>
				</div>
			</div>
		</div>
		<!-- 查看订单详情 -->
		<div class="lookOrder" @click="lookOrder">查看订单详情</div>
		<popUp
			v-if="isPopup"
			:type="2"
			:content="popContent"
			:confirm="popConfirm"
			@popupconfirm="popupconfirm"
			@popupcancel="cancel"></popUp>
  	</div>
</template>
<script>
	import common from '@/js/common';
	import popUp from '@/components/popUp.vue'
	export default {
		name:'index',
		data(){
			return {
				isPopup: '', // 是否显示弹窗
				shop_data: {},// 商品信息
				consignee: {}, // 收货人信息
				refund_data: {}, // 退款信息
				refund_status_list: [], // 退款状态说明
				restatus: '', // 退款状态
				isAgree: true,
				refund_type_val: '',// 退款换货状态
			}
		},
		computed: {
			isConfirm(){
				return [1,2].includes(this.refund_type_val);
			},
			popContent(){
				let text = '',isAgree = this.isAgree
				switch (this.refund_type_val){
					case 1: 
						text = isAgree ? '买家申请的是退款，您确定同意吗' : '您确定拒绝买家退款申请吗';
						break;
					case 2: 
						text = isAgree ? '买家申请的是退货，您确定同意吗' : '您确定拒绝买家退货申请吗';
						break;
					case 3: 
						text = isAgree ? '买家申请的是换货，您确定同意吗' : '您确定拒绝买家换货申请吗';
						break;
				}
				return text;
			},
			popConfirm(){
				let text = '',isAgree = this.isAgree
				switch (this.refund_type_val){
					case 1: 
						text = isAgree ? '确认退款' : '拒绝退款';
						break;
					case 2: 
						text = isAgree ? '确认退货' : '拒绝退货';
						break;
					case 3: 
						text = isAgree ? '确认换货' : '拒绝换货';
						break;
				}
			}
		},
		mounted(){
			var stoken = localStorage.getItem('stoken');
			if(!stoken){
				window.location.href='./shopLogin.html';
				return false;
			}
			this.request();
		},
		methods:{
			request(){
				var that = this;
				this.dataService.orderRefund({
					order_no: common.getUrlParam('order_no'),
					shop_id: common.getUrlParam('shop_id'),
					order_goods_no: common.getUrlParam("order_goods_no")
				}).then(function(resp) {
					that.dataService.handleResponse({
						data: resp,
						callback: function(data){
							that.refund_type_val = data.refund_type_val
							that.shop_data = {
								goods_id: data.goods_id,
								goods_name: data.goods_name,
								is_main: data.is_main,
								paytime: data.paytime,
								sprice: data.sprice,
								cprice: data.cprice,
								gimg: data.gimg
							};
							that.consignee = {
								consignee: data.consignee,
								telephone: data.telephone,
								caddress: data.caddress,
							}
							that.refund_data = {
								refund_type: data.refund_type,
								refund_reason: data.refund_reason,
								refund_desc: data.refund_desc,
								refund_sum: data.refund_sum,
								refund_imgs:data.refund_imgs
							}
							that.refund_status_list = data.refund_status_list?data.refund_status_list: [];
							that.restatus = data.restatus;
						}
					})
				})
			},
			// 返回
			goBack(){
				history.back(-1);
			},
			// 打开弹窗
			openPopup(num){
				this.isAgree = num == 1 ? true : false;
				this.isPopup = true;
			},
			// 点击确定
			popupconfirm(){
				let num = this.isAgree ? 1 : 2;
				this.isConfirm ? this.refund(num) : this.exchangeGoods(num);
			},
			// 退款接口
			refund(num){
				var that = this;
				this.dataService.shopRefundOpt({
					order_goods_no: common.getUrlParam('order_goods_no'),
					shop_id: common.getUrlParam('shop_id'),
					is_agree: num
				}).then(function(resp) {
					if(resp.data.code==1000){
						let refund_status_item = num == 1?{
								"opt_desc": "商家同意退款",
								"opt_time": new Date().Format("yyyy-MM-dd hh:mm:ss"),
								"opt_msg": "平台已同意买家退款申请，退款金额将退还至买家支付账户。"
							}:
							{
								"opt_desc": "商家拒绝退款",
								"opt_time": new Date().Format("yyyy-MM-dd hh:mm:ss"),
								"opt_msg": ""
							}
						that.refund_status_list.unshift(refund_status_item);
						that.restatus = 2;
						that.isPopup = false
					}else{
		//              alert(resp.data.)
					}
				})
			},
			// 退货接口
			exchangeGoods(num){
				var that = this;
				this.dataService.shopBarterOpt({
					order_goods_no: common.getUrlParam('order_goods_no'),
					shop_id: common.getUrlParam('shop_id'),
					is_agree: num
				}).then(function(resp) {
					if(resp.data.code==1000){
						let refund_status_item = num == 1?{
								"opt_desc": "商家同意换货",
								"opt_time": new Date().Format("yyyy-MM-dd hh:mm:ss"),
								"opt_msg": "商家已同意买家换货申请。"
							}:
							{
								"opt_desc": "商家拒绝换货",
								"opt_time": new Date().Format("yyyy-MM-dd hh:mm:ss"),
								"opt_msg": ""
							}
						that.refund_status_list.unshift(refund_status_item);
						that.restatus = 2;
						that.isPopup = false
					}else{
		//              alert(resp.data.)
					}
				})
			},
			// 取消弹窗
			cancel(){
				this.isPopup = false
			},
			// 查看订单详情
			lookOrder(){
				window.location.href = './storeOrderDetails.html?order_no='+common.getUrlParam('order_no')+'&shop_id='+common.getUrlParam('shop_id')+'&isLocal='+(this.shop_data.is_main==1?true:false)+"&order_goods_no=" + common.getUrlParam("order_goods_no");
			}
		},
		components:{
			popUp
		}
	}
</script>
<style lang="less">
  @import "storeOrderDispose.less";
</style>
