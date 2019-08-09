<template>
    <div class="viewport">
		<!-- 头返回 -->
		<div class="header">
			<span class="go-back" @click="goBack"></span>
			<div class="page-title">确认订单</div>
		</div>
		<!-- 收货地址 -->
		<div class="site" @click="selectSite">
			<!-- <span class="site-img"></span> -->
			<img class="site_img" src="../../assets/site-img.png" alt="">
			<div class="site-data" v-if="!isUser_address">请输入收货地址</div>
			<div class="site-data" v-if="isUser_address">
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
					<div class="consignee-data"><span>{{user_address.province}}{{user_address.city}}{{user_address.county}}{{user_address.address}}</span></div>
				</div>
				<div class="consignee" v-if="user_address.real_name">
					<div class="consignee-title">身份证信息:</div>
					<div class="consignee-data">
						<span>{{user_address.real_name}}</span>
						<span>身份证尾号{{user_address.idcard.slice(-4)}}</span>
					</div>
				</div>
			</div>
			<img class="select-site" src="../../assets/advance.png" alt="">
		</div>
		<!-- 彩带 -->
		<img class="colouredRibbon" src="../../assets/colouredRibbon.png" alt="">
		<!-- 商品区域 -->
		<div class="shop-area" v-for="(good,index) in goods_list" :key="index">
			<!-- 主商品 -->
			<div class="main-shop" v-if="!share_main_order_goods_id">
				<!-- 店名-->
				<div class="trade-name" v-if="good.is_overseas == 0">
					<img class="trade-name-img" :src="good.shop_logo" alt="">
					<span>{{good.shop_name}}</span>
				</div>
				<!-- 商品区域 -->
				<div class="main-shop-area">
					<div class="main-shop-img">
						<span :style="{backgroundImage: 'url(' + good.thumb_img + ')'}"></span>
						<!-- <img :src="good.thumb_img" alt=""> -->
						<img class="corner-mark" v-if="good.goods_type==1" src="../../assets/orderMainSource.png" alt="">
						<img class="corner-mark" v-if="good.goods_type==2" src="../../assets/orderMainLocal.png" alt="">
					</div>
					<!-- 商品信息 -->
					<div class="main-shop-data">
						<div class="main-shop-name">{{good.goods_name}}</div>
						<div class="main-shop-specification">{{good.spec_key_name}}</div>
						<div class="main-shop-price">
							<div>
								<span class="main-shop-newPrice">¥{{good.shop_price}}</span>
								<!-- <span class="main-shop-newPrice" v-else>¥0.00</span> -->
								<span class="main-shop-oldPrice" v-if="Number(good.shop_price) < Number(good.market_price)">¥{{good.market_price}}</span>
								<span class="alreadyPayment" v-if="order_id && (commonData.ssn_shopGroup.mainShop.order_status==2 || commonData.ssn_shopGroup.mainShop.order_status==3)">已付款</span>
							</div>
							<span>x{{good.goods_num}}</span>
						</div>
					</div>
				</div>
				<!-- 配送方式 -->
				<div class="shop-module" v-if="good.goods_type==1">
					<div class="shop-module-title">配送方式</div>
					<div class="shop-module-data">
						<span>快递 {{good.express_fee||good.express_fee==0?good.express_fee : '包邮'}}</span>
					</div>
				</div>
				<div class="shop-module" v-if="good.goods_type==2">
					<div class="shop-module-title">配送方式</div>
					<div class="shop-module-data"><span>线下消费</span></div>
				</div>
			</div>
			<!-- 赠品区域 -->
			<div class="present-shop" v-if="good.give_limit != 0 && isActivity != 1">
				<!-- 赠品标题 -->
				<div class="present-shop-title" v-if="!share_main_order_goods_id">
					<div class="present-shop-state"><img src="../../assets/bagComplimentary.png" alt=""><span>已选赠品</span></div>
                    <template v-if="isShowSelect && good.give_limit == -1 || good.give_limit > good.give_list.length">
                        <audioFront></audioFront>
                        <div class="present-shop-select" @click="selectPresent">
                            <img src="../../assets/select_give.gif" alt="">
                        </div>
                    </template>
					<div class="present-shop-upper" v-else>
						赠品数量已达上限
					</div>
				</div>
				<!-- 未选中赠品 -->
				<div class="present-shop-empty" v-if="good.give_list.length==0">
					<img src="../../assets/present.png" alt="">
					<div>还有超多赠品可以选择哟~赶紧去看看</div>
				</div>
				<!-- 赠品列表 -->
				<div v-else class="present-shop-list">
					<div class="present-shop-item" v-for="(give,index) in good.give_list" :key="index">
						<div class="present-shop-area">
							<!-- 店名-->
							<div class="trade-name" v-if="give.is_overseas == 0">
								<img class="trade-name-img" :src="give.shop_logo" alt="">
								<span>{{give.shop_name}}</span>
							</div>
							<!-- 商品信息 -->
							<img class="corner-mark" v-if="give.goods_type==1" src="../../assets/orderCornerMark.png" alt="">
							<img class="corner-mark" v-if="give.goods_type==2" src="../../assets/orderLocaPresent.png" alt="">
							<div class="main-shop-area">
								<div class="main-shop-img">
									<!-- <imgclass="group-present-delete" src="../../assets/group_present_delete.png" alt=""> -->
									<img :src="give.thumb_img" alt="">
								</div>
								<!-- 商品信息 -->
								<div class="main-shop-data">
									<div class="main-shop-name">{{give.goods_name}}</div>
									<div class="main-shop-specification">{{give.spec_key_name}}</div>
									<div class="present-shop-explain">
										<div class="main-shop-price">
											<span class="main-shop-newPrice">¥{{give.shop_price}}</span><span class="main-shop-oldPrice">¥0.00</span>
										</div>
									</div>
								</div>
							</div>
							<!-- 配送方式 -->
							<div class="shop-module" v-if="give.goods_type==1">
								<div class="shop-module-title">配送方式</div>
								<div class="shop-module-data">
									<span>快递 {{give.express_fee||give.express_fee==0?give.express_fee:'包邮'}}</span>
								</div>
							</div>
							<div class="shop-module" v-if="give.goods_type==2">
								<div class="shop-module-title">配送方式</div>
								<div class="shop-module-data">
									<span>线下消费</span>
								</div>
							</div>
						</div>
						<div class="delete">
							<img src="../../assets/submitShopDelete.png" alt="" @click.stop="deletePresent(index)">
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- 订单说明 -->
		<div class="order_explain">
			<img src="../../assets/order_explain.png" alt="">
		</div>
		<!-- 底部结算 -->
		<div class="footer">
			<div class="group-present-total">(已选赠品价值：<span>¥{{presentTotal}}</span>)</div>
			<div class="total">合计: <span>¥{{total_price}}</span></div>
			<div class="submit" v-preventReClick @click.prevent="submit">提交订单</div>
		</div>
		<popUp v-if="isPopUp" :type="popupType" :time="popupTime" :content="popupContent" @popupconfirm='popupconfirm' @popupcancel='popupcancel'></popUp>
    </div>
</template>
<script>
	import common from '@/js/common'
	import localStorageCorrelation from '@/js/localStorageCorrelation';
    import popUp from '@/components/popUp.vue';
    import audioFront from '@/components/audioFront'
	export default {
		name:'particulars',
		data(){
			return {
				buyNum: "1",
				goods_list: '', // 商品列表
				address: '', // 本地保存的地址
				user_address: {}, // 收货地址
				isUser_address: '', // 是否存在收货地址
				express_fee: '', // 邮费
				total_goods_price: '', // 总价
				isPopUp: false, // 是否显示提示文字
				popupType: 1, // 弹窗类型
				popupTime: 3000, // 弹窗显示时间
				popupContent: "",// 弹窗显示文字
				total_price: '', // 总价格
				order_id: '',// 订单id
				isActivity: '',// 是否为活动商品
				isHasPresent: 1, // 是否还有赠品可以选择
				deletePresentNum: false, // 删除的是那个赠品
			}
		},
		mounted(){
			var that = this;
			this.order_id = localStorage.getItem('order_id')?JSON.parse(localStorage.getItem('order_id')):'';
			localStorageCorrelation.getLocalStorage(this);
			this.user_address = localStorage.getItem('address')?JSON.parse(localStorage.getItem('address')):{};
			this.checkList();
			this.request();
			this.$eventBus.$on('closePopup',() => {
				if(this.popupType == 1){
					that.goBack();
				}
			})
		},
		methods:{
			checkList(){
				let addr = JSON.parse(sessionStorage.getItem('user-addr')),param = {};
				let goods_give_item_id = [],select_give_goods_id = [],obj = '';
				for(let i = 0; i < this.commonData.ssn_shopGroup.presentList.length; i ++){
					goods_give_item_id.push(this.commonData.ssn_shopGroup.presentList[i].actualSpe);
					select_give_goods_id.push(this.commonData.ssn_shopGroup.presentList[i].goods_id);
				}
				param.from = 'selectPage';
				param.tab_type = 2;
				param.city_id = addr.city_id;
				param.lng = addr.lng;
				param.lat = addr.lat;
				param.select_give_goods_id = select_give_goods_id.join(",");
				param.goods_give_item_id = goods_give_item_id.join(",");
				param.select_main_goods_id = this.commonData.ssn_shopGroup.mainShop.goods_id;
      			param.goods_main_item_id =  this.commonData.ssn_shopGroup.mainShop.actualSpe?this.commonData.ssn_shopGroup.mainShop.actualSpe:0
				this.dataService.checkList(param).then((resp) => {
					this.dataService.handleResponse({
						data: resp,
						callback: (data) => {
							this.isHasPresent = data.has;
						},
						callback1001: () => {
							this.openPopUp(1,resp.data.msg + ',请重新选择');
						}
					})
				})
			},
			// 订单需要信息
			orderData(){
				var goods_give_item_id = [],select_give_goods_id = [],give_goods_num = [];
				for(let i = 0; i < this.commonData.ssn_shopGroup.presentList.length; i ++){
					goods_give_item_id.push(this.commonData.ssn_shopGroup.presentList[i].actualSpe?this.commonData.ssn_shopGroup.presentList[i].actualSpe:0);
					select_give_goods_id.push(this.commonData.ssn_shopGroup.presentList[i].goods_id);
					give_goods_num.push(1)
				}
				return {
					main_goods_id: this.commonData.ssn_shopGroup.mainShop.goods_id,
					main_goods_item_id: this.commonData.ssn_shopGroup.mainShop.actualSpe?this.commonData.ssn_shopGroup.mainShop.actualSpe:0,
					main_goods_num: this.commonData.ssn_shopGroup.mainShop.shopBuyNum,
					give_goods_id: select_give_goods_id.join(","),
					give_goods_item_id: goods_give_item_id.join(","),
					give_goods_num: give_goods_num.join(','),
					user_address_id: this.user_address.user_address_id,
					order_id:this.order_id
				};
			},
			request(){
				var that = this,param = this.orderData();
				if(this.dlf_id){
					param.dlf_id = this.dlf_id
				}
				if(this.share_main_order_goods_id){
					param.share_main_order_goods_id = this.share_main_order_goods_id;
					this.dataService.shareCreateOrderInfo(param).then(function(resp){
						that.dataService.handleResponse({
							data: resp,
							callback: function(data){
								that.formattingOrderData(data);
							},
							callback1001:function(){
								that.openPopUp(1,resp.data.msg + ',请重新选择');
							}
						})
					});
					return false;
				}
				if(this.order_id){
					this.dataService.recreateGiveOrderInfo(param).then(function(resp){
						that.dataService.handleResponse({
							data: resp,
							callback: function(data){
								that.formattingOrderData(data);
							},
							callback1001:function(){
								that.openPopUp(1,resp.data.msg + ',请重新选择');
							}
						})
					});
					return false;
				}
				this.dataService.createOrderInfo(param).then(function(resp){
					that.dataService.handleResponse({
						data: resp,
							callback: function(data){
							that.formattingOrderData(data);
						},
						callback1001:function(){
							that.openPopUp(1,resp.data.msg + ',请重新选择');
						}
					})
				})
			},
			// 格式化订单数据
			formattingOrderData(data){
				localStorage.setItem('address','');
				this.total_price = Number(data.total_price).toFixed(2);
				this.goods_list = data.goods_list;
				this.isActivity = data.goods_list[0].activity_id;
				this.user_address = data.user_address;
				this.express_fee = data.express_fee;
				this.total_goods_price = data.total_goods_price;
				if(this.user_address) this.isUser_address = true;
			},
			openPopUp(type,content){
				this.isPopUp = true;
				this.popupType = type;
				this.popupContent = content;
			},
			// 弹窗确定
			popupconfirm(){
				if(this.deletePresentNum || this.deletePresentNum === 0){
					let ssn_shopGroup = this.commonData.ssn_shopGroup;
					let good_id = this.goods_list[0].give_list[this.deletePresentNum].goods_id;
					for(let i = 0; i < ssn_shopGroup.presentList.length; i++){
						if(good_id == ssn_shopGroup.presentList[i].goods_id){
							ssn_shopGroup.presentList.splice(i,1);
						}
					}
					localStorage.setItem("ssn_shopGroup",JSON.stringify(ssn_shopGroup));
					this.deletePresentNum = false;
					window.location.reload();
					return false
				}
				window.location.href = './myAddr.html?isOrder=1'
			},
			// 弹窗取消
			popupcancel(){
				this.isPopUp = false;
			},
			// 选择收货地址
			selectSite(){
				window.location.href = './myAddr.html?isOrder=1'
			},
			// 返回
			goBack(){
				window.history.go(-1);
			},
			// 去选择赠品
			selectPresent(){
				var id = 1;
				window.location.href = './selectShop.html?buyPresent=false&id='+id
			},
			// 提交订单
			submit(e){
				if(e.target.disabled) return false;
				var that = this,param = this.orderData();
				if(this.share_main_order_goods_id){
					param.share_main_order_goods_id = this.share_main_order_goods_id
					this.dataService.shareCreateOrder(param).then(function(resp){
                        if(resp.data.code == 1711 ){
                            that.openPopUp(2,resp.data.msg);
                            return false
                        }
						that.dataService.handleResponse({
							data: resp,
							callback: function(data){
								localStorage.setItem("order_id",'');
								localStorage.setItem("main_order_goods_id",'');
								that.commonData.ssn_shopGroup = {
									mainShop: {},
									presentList: [],
								};
								localStorageCorrelation.setLocalStorage(that);
								localStorage.setItem("address",'');
								if(JSON.stringify(data)=='[]'){
									window.location.href = './order.html#/line' + (that.goods_list[0].goods_type==1?'#/line':"#/local");
									return false;
								}
								window.location.href = data.url
							}
						})
					})
					return false;
				}
				if(this.order_id){
					this.dataService.recreateGiveOrder(param).then(function(resp){
                        if(resp.data.code == 1711 ){
                            that.openPopUp(2,resp.data.msg);
                            return false
                        }
						that.dataService.handleResponse({
							data: resp,
							callback: function(data){
								localStorage.setItem("order_id",'');
								localStorage.setItem("main_order_goods_id",'');
								that.commonData.ssn_shopGroup = {
									mainShop: {},
									presentList: [],
								};
								localStorageCorrelation.setLocalStorage(that);
								localStorage.setItem("address",'');
								if(JSON.stringify(data)=='[]'){
									window.location.href = './order.html#/line' + (that.goods_list[0].goods_type==1?'#/line':"#/local");
									return false;
								}
								window.location.href = data.url
							}
						})
					})
					return false;
				}
				if(this.dlf_id){
					param.dlf_id = this.dlf_id
				}
				if(this.pid){
					param.share_user_id = this.pid;
				}
				localStorage.setItem("pid","");
				this.dataService.createOrder(param).then(function(resp){
                    if(resp.data.code == 1711 ){
                        that.openPopUp(2,resp.data.msg);
                        return false
                    }
					that.dataService.handleResponse({
						data: resp,
						callback: function(data){
							that.commonData.ssn_shopGroup = {
								mainShop: {},
								presentList: [],
							};
							localStorageCorrelation.setLocalStorage(that);
							localStorage.setItem("address",'');
							localStorage.setItem('dlf_id','');
							window.location.href = data.url
						}
					})
				})
			},
			// 删除赠品
			deletePresent(num){
				this.deletePresentNum = num;
				this.openPopUp(2,'确定删除该赠品吗?');
			},
		},
		// 定义计算属性
		computed:{
			commonData(){
				return this.$store.state.commonData
			},
			dlf_id(){
				if(this.commonData.ssn_shopGroup.mainShop.activity_id != 5){
					return undefined;
				}
				return Number(localStorage.getItem('dlf_id')) || undefined;
			},
			presentTotal(){
				let presentList = this.commonData.ssn_shopGroup.presentList;
				if(presentList.length==0) return '0.00';
				let price = 0;
				for(let i = 0; i < presentList.length; i ++){
					price += Number(presentList[i].actualPrice)
				}
				return price.toFixed(2)
			},
			isShowSelect(good){ // 是否可以选择赠品
				if(this.commonData.ssn_shopGroup.presentList.length>=5) return false
				if(this.isHasPresent == 0) return false;
				return true
			},
			share_main_order_goods_id(){
				return Number(common.getUrlParam("share_main_order_goods_id")) || ''
			},
			pid(){
				return Number(sessionStorage.getItem("pid")) || ''
			}
		},
		components: {
            popUp,
            audioFront
		}
	}
</script>
<style lang="less">
  @import "confirmOrder.less";
</style>
