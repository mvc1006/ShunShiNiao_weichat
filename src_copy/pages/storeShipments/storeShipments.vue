<template>
	<div class="viewport" @click="isExpressListChoo = false">
		<!-- <div class="shade" v-if="expressListChoo.length > 0"></div> -->
		<!-- 头部返回 -->
		<div class="header">
			<span class="go-back" @click.stop="goBack"></span>
			<div v-text="amend?'修改物流' : '发货'">发货</div>
		</div>
		<!-- 收货地址 -->
		<div class="site">
			<div class="site-data">
				<!-- 收货人 -->
				<div class="consignee">
					<div class="consignee-title">收货人:</div>
					<div class="consignee-data">
						<span>{{user_address.consignee}}</span>
						<span>{{user_address.telephone}}</span>
					</div>
				</div>
				<div class="consignee consignee-site">
					<div class="consignee-title">收货地址:</div>
					<div class="consignee-data">
						<span>{{user_address.caddress}}</span>
					</div>
				</div>
			</div>
		</div>
		<!-- 彩带 -->
		<img class="colouredRibbon" src="../../assets/colouredRibbon.png" alt="">
		<!-- 快递信息 -->
		<div class="expressage">
			<div class="expressage-title">录入快递信息</div>
			<!-- <input type="text" placeholder="请输入快递公司" v-model="expressCompany" @focus="inputFocus" @input="express" @click.stop> -->
			<div class="expressage-input">
				<input type="text" placeholder="请输入快递单号或扫码" @input="inputText" v-model="expressOdd">
				<img class="delete" src="../../assets/delete.png" v-if="expressOdd" @click="inputDelete" alt="">
				<img class="scan" src="../../assets/scan.png" @click="checkRatify" alt="">
			</div>
			<div class="expressage-data">
				<div class="logistics-img">
					<img src="../../assets/logistics.png" alt="">
				</div>
				<!-- <img src="../../assets/logistics.png" alt=""> -->
				<span v-text="expressCompany"></span>
			</div>
			<div class="expressList" v-if="expressListChoo.length > 0">
				<div class="expressItem" v-for="(express,index) in expressListChoo" :key="index" @click.stop="selectExpress(index)">{{express.shipping_name}}</div>
			</div>
		</div>
		<!-- 订单详情 -->
		<div class="order-details">
			<div class="expressage-title">订单信息</div>
			<div class="shop-details">
				<div class="shop-img">
					<img :src="shop_data.gimg" alt="">
					<span v-if="shop_data.is_main==2" class="give"></span>
					<span v-if="shop_data.is_main==1" class="orderMainLocal"></span>
				</div>
				<div class="shop-data">
					<div class="shop-title">{{shop_data.gname}}</div>
					<div class="shop-spe">{{shop_data.skname}}</div>
					<div class="shop-price">销售价：<span>￥{{shop_data.sprice}}</span><span class="line">|</span>成本价：<span>￥{{shop_data.cprice}}</span></div>
				</div>
			</div>
			<!-- 配送方式 -->
			<div class="dispatching">
				<span>配送方式</span>
				<span>快递  {{express_fee}}</span>
			</div>
		</div>
		<!-- 本单合计 -->
		<div class="total dispatching">
			<span>本单合计</span>
			<span>￥{{Number(order_shop_sum)+Number(express_fee)}}</span>
		</div>
		<!-- 发货 -->
		<div class="shipments" @click.stop="shipments" v-text="amend?'确认修改' : '发货'"></div>
		<!-- 页面弹窗提示 -->
		<popUp v-if="isPopUp" :type="1" :time="popupTime" :content="popupContent"></popUp>
	</div>
</template>
<script>
	import common from '../../js/common';
	import popUp from '../../components/popUp.vue';
	import wx from 'weixin-js-sdk';
	export default {
		name:'index',
		data(){
			return {
				user_address: {},
				shop_data: {},
				order_shop_sum: '',
				express_fee: '', // 快递
				expressCompany: '自动匹配物流公司', // 快递公司
				expressOdd: '', // 快递单号
				express_id: '',// 快递公司id
				expressList: [], // 快递公司列表
				expressListChoo: [], // 可选择的快递公司列表
				isExpressListChoo: false, // 是否选择快递公司
				isClickExpress: false,
				isPopUp: false, // 是否显示弹窗
				popupTime: 3000,
				popupContent: '', // 弹窗显示内容
			}
		},
		computed: {
			amend(){
				let amend = common.getUrlParam("amend");
				if(amend == 1){
					document.getElementsByTagName("title")[0].innerHTML = '修改物流';
					return true
				}
				return false
			}
		},
		mounted(){
			var that = this;
			this.request();
			// 关闭提示框
			this.$eventBus.$on("closePopup",function(){
				that.isPopUp = false;
			});
		},
		methods:{
			// 请求后台初试化数据
			request(){
				var that = this;
				this.dataService.orderShipInfo({
					order_no: common.getUrlParam('order_no'),
					order_goods_no: common.getUrlParam('order_goods_no')
				}).then(function(resp) {
					that.dataService.handleResponse({
						data: resp,
						callback: function(data){
							that.dataService.shippingList().then(function(resp){
								that.dataService.handleResponse({
									data: resp,
									callback: function(data){
										that.expressList = data;
										// that.expressListChoo = data;
									}
								})
							});
							that.user_address = {
								consignee: data.consignee,
								telephone: data.telephone,
								caddress: data.caddress
							};
							that.shop_data = {
								gimg: data.gimg,
								gname: data.gname,
								is_main: data.is_main,
								sprice: data.sprice,
								cprice: data.cprice,
								gnum: data.gnum,
								skname: data.skname
							};
							that.order_shop_sum = data.order_shop_sum;
							that.express_fee = data.express_fee;
						}
					})
				})
			},
			// 输入快递单号
			inputText(){
				console.log(this.expressOdd)
				if(this.expressOdd.length >= 8 ){
					this.getCompany()
				}
			},
			// 确定快递公司id
			express(){
				this.expressListChoo = [];
				for(let i = 0; i < this.expressList.length; i ++){
					if(this.expressList[i].shipping_name.indexOf(this.expressCompany)!='-1'||this.expressList[i].shipping_code.indexOf(this.expressCompany)!='-1'){
						this.expressListChoo.push(this.expressList[i])
					}
				}
			},
			// input获取焦点
			inputFocus(){
				this.isExpressListChoo = true;
			},
			// 扫码确认快递单号
			checkRatify(){
				var url = window.location.href;
				this.dataService.get_wxconfig({
					url: url
				}).then((resp) => {
					this.dataService.handleResponse({
						data: resp,
						callback: (data) => {
							wx.config({
								debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
								appId: data.appId, // 必填，公众号的唯一标识
								timestamp: data.timestamp, // 必填，生成签名的时间戳
								nonceStr: data.nonceStr, // 必填，生成签名的随机串
								signature: data.signature,// 必填，签名
								jsApiList: ['scanQRCode','getLocation'] // 必填，需要使用的JS接口列表
							});
							wx.scanQRCode({
								needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
								scanType: ["barCode"], // 可以指定扫二维码还是一维码，默认二者都有
								success: (res) => {
									// var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
									this.expressOdd = res.resultStr.split(',')[1];
									this.getCompany();
								}
							});
						}
					})
				});
			},
			// 获取快递公司
			getCompany(){
				this.dataService.orderShipNumAutoCheck({
					ship_num: this.expressOdd
				}).then((resp) => {
					this.dataService.handleResponse({
						data: resp,
						callback: (data) => {
							this.expressListChoo = data;
						}
					})
				})
			},
			// 删除快递单号
			inputDelete(){
				this.expressOdd = '';
			},
			// 确认快递公司名称
			selectExpress(num){
				// this.isClickExpress = true;
				this.isExpressListChoo = false;
				this.expressCompany = this.expressListChoo[num].shipping_name;
				this.express_id = this.expressListChoo[num].shipping_id;
				this.expressListChoo = [];
			},
			// 提交发货
			shipments(){
				if( this.expressOdd == ''){
					this.isPopUp = true;
					this.popupContent = '请输入快递单号';
					return false;
				}
				if(this.express_id==''&&this.expressListChoo.length==0){
					this.isPopUp = true;
					this.popupContent = '请确定快递公司';
					return false;
				}
				var that = this;
				if(this.amend){
					this.dataService.orderShipEdit({
						order_no: common.getUrlParam('order_no'),
						order_goods_no: common.getUrlParam('order_goods_no'),
						shipping_id: this.express_id,
						ship_num: this.expressOdd,
					}).then(function(resp) {
						if(resp.data.code==1000){
							that.isPopUp = true;
							that.popupContent = '修改成功';
							setTimeout(function(){
								that.goBack();
							},that.popupTime);
							return false;
						}
						if(resp.data.code==1001){
							that.isPopUp = true;
							that.popupContent = resp.data.msg;
							return false;
						}
					})
					return false
				}
				this.dataService.orderShipOpt({
					order_no: common.getUrlParam('order_no'),
					order_goods_no: common.getUrlParam('order_goods_no'),
					shipping_id: this.express_id,
					ship_num: this.expressOdd,
				}).then(function(resp) {
					if(resp.data.code==1000){
						that.isPopUp = true;
						that.popupContent = '发货成功';
						setTimeout(function(){
							that.goBack();
						},that.popupTime);
						return false;
					}
					if(resp.data.code==1001){
						that.isPopUp = true;
						that.popupContent = resp.data.msg;
						return false;
					}
				})
			},
			// 返回上一页
			goBack(){
				window.history.go(-1);
			},
		},
		components:{
			popUp
		}
	}
</script>
<style lang="less">
	@import "../../less/common.less";
	@import "./storeShipments.less";
</style>
