<template>
	<div>
		<div class="shopGroup-area" id="shopGroup" @touchstart="touchStart($event)" :style="styleObject">
			<span class="shopGroup" @click="commonData.isGroup=true"></span>
			<span class="shopGroup-num">{{shopNum}}</span>
		</div>
		<!--<div class="shop-group-touch" :style="{display:isTouch?'block':'none'}" v-if="isTouch" @touchmove="touchMove" @touchend="touchEnd"></div>-->
		<div class="shop-Group" @click="closePopup" v-if="commonData.isGroup">
			<div class="group-area" @click.stop>
				<img src="../assets/shopGroupClose.png" class="groupClose" @click="closePopup" alt="">
				<!-- 没有主商品 -->
				<template v-if="!share_main_order_goods_id">
					<div class="noMainSHop" v-if="!commonData.isMain" @click="gotoMain">
						<img src="../assets/selectMainShop.png" alt="">
						<span>点击选择主商品</span>
					</div>
					<!-- 有主商品 -->
					<div class="group-main" v-if="commonData.isMain" @click="gotoDetails(-1)">
						<div class="group-main-area">
							<div class="group-main-img">
								<span :style="{backgroundImage: 'url(' + commonData.ssn_shopGroup.mainShop.thumb_img + ')'}"></span>
								<img @click.stop="deleteGroupMain()" class="group-present-delete" src="../assets/group_present_delete.png" alt="">
							</div>
							<div class="group-main-data">
								<span class="empty" @click.stop="empty">清空</span>
								<div class="group-main-name">{{commonData.ssn_shopGroup.mainShop.goods_name}}</div>
								<div class="group-main-spe">{{commonData.ssn_shopGroup.mainShop.selectedSpe}}</div>
								<div class="group-main-price">¥{{commonData.ssn_shopGroup.mainShop.actualPrice}} <span v-if="order_id && (commonData.ssn_shopGroup.mainShop.order_status==2 || commonData.ssn_shopGroup.mainShop.order_status==3)">(已付款)</span></div>
								<!-- <div class="group-main-price">已付款</div> -->
							</div>
						</div>
						<!-- 购买数量 -->
						<div class="shop-module">
							<div class="shop-module-title">购买数量</div>
							<div class="shop-module-data">
								<span class="num-area">{{commonData.ssn_shopGroup.mainShop.shopBuyNum}}</span>
							</div>
						</div>
					</div>
				</template>
				<!-- 赠品区域 -->
				<div class="group-present" v-if="isMaySelectSpe">
					<div class="group-present-title" v-if="!share_main_order_goods_id">
						<div class="group-present-present"><img src="../assets/bagComplimentary.png" alt=""><span>已选赠品</span></div>
						<div class="group-present-select" v-if="!commonData.isUpper" @click="gotoPresent"><span>去选择赠品</span><img src="../assets/red_right_arrows.png" alt=""></div>
						<div class="group-present-upper" v-if="commonData.isUpper"><span>赠品选择已达上限</span><img src="../assets/advance.png" alt=""></div>
					</div>
					<template v-if="!share_main_order_goods_id">
						<div class="group-present-list">
							<div class="group-present-item" v-for="(present,index) in commonData.ssn_shopGroup.presentList" :key="index" @click="gotoDetails(index)">
								<div class="group-present-img">
									<img :src="present.thumb_img" alt="">
									<img @click.stop="deleteGroupPresent(index)" class="group-present-delete" src="../assets/group_present_delete.png" alt="">
								</div>
								<div class="group-present-name">{{present.goods_name}}</div>
								<div class="group-present-price">¥{{present.actualPrice}}</div>
							</div>
							<div class="group-present-item" v-for="i in (3 - commonData.ssn_shopGroup.presentList.length)" @click="gotoPresent">
								<div class="group-present-img">+</div>
							</div>
							<div class="group-present-item">
								<img class="toUnlock" src="../assets/toUnlock.png" alt="">
							</div>
							<div class="group-present-item">
								<img class="toUnlock" src="../assets/toUnlock.png" alt="">
							</div>
						</div>
					</template>
					<template v-else>
						<div class="group-present-list share-present">
							<div class="group-present-item" v-for="i in [1,2]" :key="i"></div>
							<div class="group-present-item" v-for="(present,index) in commonData.ssn_shopGroup.presentList" :key="index">
								<div class="group-present-img">
									<img :src="present.thumb_img" alt="">
									<img @click.stop="deleteGroupPresent(index)" class="group-present-delete" src="../assets/group_present_delete.png" alt="">
								</div>
								<div class="group-present-name">{{present.goods_name}}</div>
								<div class="group-present-price">¥{{present.actualPrice}}</div>
							</div>
							<div class="group-present-item" v-if="commonData.ssn_shopGroup.presentList.length == 0">
								<div class="group-present-img">+</div>
							</div>
							<div class="group-present-item" v-for="i in [1,2]" :key="i"></div>
						</div>
					</template>
				</div>
			</div>
			<div @click.stop class="group-footer">
				<template v-if="isMaySelectSpe">
					<div class="group-present-total">(已选赠品价值：<span>¥{{presentTotal}}</span>)</div>
					<div class="total">
						合计: <span v-if="order_id && (commonData.ssn_shopGroup.mainShop.order_status==2 || commonData.ssn_shopGroup.mainShop.order_status==3)">¥0.00</span><span v-else>¥{{total}}</span> 
					</div> 
				</template>
				<div class="submit" @click.stop="submit">确定</div>
			</div>
		</div>
	</div>
</template>
<script>
	import {mapGetters} from 'vuex';
	import common from '../js/common';
	import popUp from '../components/popUp.vue';
	import localStorageCorrelation from '../js/localStorageCorrelation'
	export default {
		name:'screen',
		// 商品组数据，赠品是否已经达到上限  isSuspension为true 的时候不显示悬浮框(反写)
		props: ['share_main_order_goods_id',"isSuspension"],
		data(){
			return {
					isTouch: false, // 是否开始拖动
					touchX: 0,  // 滑动X坐标
					touchY: 0,  // 滑动Y坐标
					styleObject: {
					left: '',
					top: '',
					bottom: '',
				}
			}
		},
		mounted(){
			var that = this;
			this.commonData.isUpper = this.commonData.ssn_shopGroup.presentList.length>=5?true:false;
			window.addEventListener("touchmove", function(e){that.touchMove(e)});
			window.addEventListener("touchend", function(e){that.touchEnd(e)});
		},
		methods:{
			// 开始拖动
			touchStart(e){
				this.touchX = e.targetTouches[0].clientX;
				this.touchY = e.targetTouches[0].clientY;
				this.styleObject.left = document.getElementById('shopGroup').offsetLeft + 'px';
				this.styleObject.top = document.getElementById('shopGroup').offsetTop + 'px';
				this.isTouch = true;
			},
			// 拖动过程
			touchMove(e){
				if(this.isTouch){
					let winHeight = window.screen.height,winWidth = window.screen.width;
					let domWidth = document.getElementById('shopGroup').offsetWidth,domHeight = document.getElementById('shopGroup').offsetHeight;
					let left = parseInt(this.styleObject.left) + e.targetTouches[0].clientX - this.touchX;
					let top = parseInt(this.styleObject.top) + e.targetTouches[0].clientY - this.touchY;
					this.touchX = e.targetTouches[0].clientX;
					this.touchY = e.targetTouches[0].clientY;
					left = left<=0?0:left>winWidth-domWidth?winWidth-domWidth:left;
					top = top<=0?0:top>winHeight-domHeight?winHeight-domHeight:top;
					this.styleObject.left = left + 'px';
					this.styleObject.top =  top + 'px';
					this.styleObject.bottom =  'auto';
				}
			},
			// 拖动结束
			touchEnd(e){
				this.isTouch = false;
			},
			// 关闭弹出层
			closePopup(){
				this.commonData.isGroup=false;
			},
			// 去选择主商品
			gotoMain(){
				window.location.href = './selectShop.html?buyPresent=true'
			},
			// 去选赠品
			gotoPresent(){
				if(JSON.stringify(this.commonData.ssn_shopGroup.mainShop) == "{}") {
					localStorageCorrelation.openPopUp(this,{popupContent:'没有主商品不能选购赠品哦~'});
					return false
				};
				window.location.href = './selectShop.html?buyPresent=false';
			},
			// 删除主商品
			deleteGroupMain(){
				this.empty(true);
				localStorage.setItem("order_id",'');
				localStorage.setItem("main_order_goods_id",'');
				this.$store.commit("isMain",false);
				var ssn_shopGroup = this.commonData.ssn_shopGroup;
				ssn_shopGroup.mainShop = {};
				this.$store.commit("ssn_shopGroup",ssn_shopGroup);
				localStorageCorrelation.setLocalStorage(this);
				this.$eventBus.$emit("confirm");
			},
			// 删除赠品
			deleteGroupPresent(num){
				this.commonData.isUpper  = false;
				var ssn_shopGroup = this.commonData.ssn_shopGroup;
				ssn_shopGroup.presentList.splice(num,1);
				this.$store.commit("ssn_shopGroup",ssn_shopGroup);
				localStorageCorrelation.setLocalStorage(this);
				this.$eventBus.$emit("confirm");
			},
			// 提交订单
			submit(){
        if(JSON.stringify(this.commonData.ssn_shopGroup.mainShop) == "{}" && this.commonData.ssn_shopGroup.presentList.length <= 0){
          localStorageCorrelation.openPopUp(this,{popupContent:'没有商品不能下单哦'});
          return false;
        }
				if(!this.share_main_order_goods_id && JSON.stringify(this.commonData.ssn_shopGroup.mainShop) == "{}"){
					localStorageCorrelation.openPopUp(this,{popupContent:'没有主商品不能下单哦~'});
					return false;
				}
				window.location.href = './confirmOrder.html?share_main_order_goods_id=' + this.share_main_order_goods_id
			},
			// 清空商品组
			empty(isSkip){
				this.commonData.isMain = false;
				var ssn_shopGroup = {  // 商品组数据
					mainShop:{},
					presentList:[]
				};
				localStorage.setItem("order_id",'');
				localStorage.setItem("main_order_goods_id",'');
				this.$store.commit("ssn_shopGroup",ssn_shopGroup);
				localStorageCorrelation.setLocalStorage(this);
				this.$eventBus.$emit("confirm");
				if(!isSkip){
					window.location.href = './localService.html'
				}
			},
			// 跳转商品详情页
			gotoDetails(num){
				let mainShop = this.commonData.ssn_shopGroup.mainShop;
				if(num==-1){
					window.location.href = './sourceShopDetails.html?local='+(mainShop.goods_type==1?0:1)+'&isMainShop=true&id=' + mainShop.goods_id + '&isEmptyShopGroup='+this.commonData.isEmptyShopGroup;
					return false;
				}
				let presentList = this.commonData.ssn_shopGroup.presentList[num];
				window.location.href = './sourceShopDetails.html?local='+(presentList.goods_type==1?0:1)+'&isMainShop=false&id=' + presentList.goods_id + '&isEmptyShopGroup='+this.commonData.isEmptyShopGroup;
			}
		},
		computed: {
			order_id(){
				return localStorage.getItem("order_id") || '';
			},
			total(){
				if(JSON.stringify(this.commonData.ssn_shopGroup.mainShop) == '{}') return '0.00';
				return (this.commonData.ssn_shopGroup.mainShop.shopBuyNum * Number(this.commonData.ssn_shopGroup.mainShop.actualPrice)).toFixed(2);
			},
			presentTotal(){
				let presentList = this.commonData.ssn_shopGroup.presentList;
				if(presentList.length==0) return '0.00';
				let price = 0;
				for(let i = 0; i < presentList.length; i ++){
					price += Number(presentList[i].actualPrice)
				}
				return price.toFixed(2);
			},
			commonData(){
				return this.$store.state.commonData
			},
			shopNum(){
				var num = 0;
				if(JSON.stringify(this.commonData.ssn_shopGroup.mainShop) != '{}'){
					num ++;
				}
				num += this.commonData.ssn_shopGroup.presentList.length;
				return num;
			},
			isMaySelectSpe(){
				let isActivity = [1,3].includes(Number(this.commonData.ssn_shopGroup.mainShop.activity_id));
				return !isActivity;
			},
		},
		components:{}
	}
</script>
<style lang='less' scoped>
  @import "../less/common";
  // 商品组合
  .shopGroup-area{
    position: fixed;
    .pxRem(left,16);
    .pxRem(bottom,112);
    z-index: 9999;
    .shopGroup{
      display: block;
    }
  }
  .shopGroup-num{
    position: absolute;
    right: 0;
    top: 0;
    .pxRem(width,24);
    text-align: center;
    .pxRem(line-height,24);
    .pxRem(font-size,16);
    .border(1,@red-color);
    background: @white-color;
    color: @red-color;
    border-radius: 50%;
  }
  .shopGroup{
    display: block;
  }
  .shop-Group{
    position: fixed;
    top: 0;
    left: 0;
    .flex();
    .flexWrap(wrap);
    align-content: flex-end;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.3);
    z-index: 99999;
    .pxRem(font-size,24);
    color: @gray-text;
    overflow: hidden;
  }
  .shop-Group>div{
    max-width: 720px;
    margin: 0 auto;
    width: 100%;
    background: @white-color;
    .borderBottom(1);
    box-sizing: border-box;
  }
  /* 商品组区域 */
  .group-area{
    position: relative;
    .pxRem(max-height,576);
    .pxRem(border-top-left-radius,16);
    .pxRem(border-top-right-radius,16);
    .pxRem(padding,32);
    // overflow: hidden;
    >.groupClose{
      position: absolute;
      .pxRem(width,36);
      .pxRem(height,36);
      .pxRem(right,26);
      .pxRem(top,-62);
    }
  }
  /* 没有主商品 */
  .noMainSHop{
    .pxRem(padding-top,28);
    .pxRem(padding-bottom,56);
    line-height: 1;
    .pxRem(font-size,20);
    color: @gray-light-text;
    text-align: center;
  }
  .noMainSHop>img{
    .pxRem(width,142);
    .pxRem(height,123);
    display: block;
    margin: 0 auto;
    .pxRem(margin-bottom,17)
  }
  .group-main{
	  .borderBottom(2,@border-color,dashed);
  }
  /* 有主商品 */
  .group-main-area{
    .flex();
  }
  /* 商品图片 */
  .group-main-img{
    position: relative;
    .pxRem(width,160);
    .pxRem(height,160);
    flex-shrink: 0;
    .pxRem(border-radius,8);
    overflow: hidden;
    >span{
      display: block;
      .pxRem(width, 160);
      .pxRem(height, 160);
      background-position: center;
      background-size: auto 100%;
      background-repeat: no-repeat;
    }
  }
  .group-main-data{
    position: relative;
    .pxRem(padding-left,16);
    .pxRem(padding-right,50);
    .flexGrow(1);
    .flex(column);
    .justifyContent(space-between);
    >.empty{
       position: absolute;
        right: 0;
        color: @red-color;
     }
  }
  /* 商品名称 */
  .group-main-name{
    .pxRem(height,72);
    .pxRem(line-height,36);
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  /* 商品规格 */
  .group-main-spe{
    .pxRem(font-size,20);
    color: @gray-light-text;
    line-height: 1;
    // .pxRem(margin-top,14);
  }
  /* 商品价格 */
  .group-main-price{
    .pxRem(font-size,26);
    color: @red-color;
    line-height: 1;
    // .pxRem(margin-top,23)
    >span{
      .pxRem(font-size,20);
      color: @gray-light-text
    }
  }
  /* 商品模板区域 */
  .shop-module{
    .pxRem(margin-top,15);
    .pxRem(margin-bottom, 20);
    .pxRem(line-height,50);
    .flex();
    justify-content: space-between;
    .alignItems();
  }
  .shop-module-data{
    .flex();
    .alignItems();
    .pxRem(font-size,20);
  }
  .shop-module-data>img{
    .pxRem(width,16)
  }
  .num-regulation{
    .pxRem(width,60);
    .pxRem(line-height,48);
    text-align: center;
    .pxRem(font-size,22);
    color: @gray-light-text;
    background: @background-color;
  }
  .num-area{
    .pxRem(padding-left,16);
    .pxRem(padding-right,16);
    color: @gray-text;
    .pxRem(font-size,24);
  }
  /* 赠品区域 */
  .group-present{
    
  }
  /* 赠品头部 */
  .group-present-title{
    .flex();
    justify-content: space-between;
    .alignItems();
    .pxRem(font-size,28);
    color: @red-color;
    line-height: 1;
    .pxRem(margin-top,20);
    .pxRem(margin-bottom,24);
    .group-present-select{
      justify-content: flex-end;
    }
  }
  .group-present-title>div{
    width: 50%;
    .flex();
    .alignItems();
  }
  .group-present-select{
    .pxRem(font-size,20);
  }
  .group-present-upper{
    justify-content: flex-end;
    color: @gray-light-text;
    .pxRem(font-size,20);
  }
  /* 赠品头部图片 */
  .group-present-present>img{
    .pxRem(width,28);
    .pxRem(height,28);
    .pxRem(margin-right,8);
  }
  .group-present-upper>img,.group-present-select>img{
    .pxRem(height,16);
    .pxRem(margin-left,8);
  }
  /* 赠品商品区域 */
  .group-present-list{
    .flex();
    justify-content: space-between;
    overflow: hidden;
  }
  .group-present-item{
    flex-grow: 1;
    width: 20%;
    >.toUnlock{
      display: block;
      .pxRem(width,120);
      .pxRem(height,120);
    }
  }
  .group-present-img{
    position: relative;
    .flex();
    .alignItems();
    .justifyContent();
    .pxRem(width,120);
    .pxRem(height,120);
    .pxRem(border-radius,8);
    background: @background-color;
    .pxRem(font-size,60);
    color: #737373;
    overflow: hidden;
  }
  .group-present-delete{
    position: absolute;
    top: 0;
    right: 0;
    .pxRem(width,46);
    .pxRem(height,46);
    z-index: 9999;
  }
  .group-present-name{
    .pxRem(font-size,20);
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .group-present-price{
    text-decoration: line-through;
    .pxRem(font-size,20);
    .pxRem(line-height,36);
    color: @red-color;
  }
  .share-present{
	//   .group-present-img{
	// 	  background: @white-color;
	//   }
  }
  /* 底部结算 */
  .group-footer{
    .flex();
    justify-content: flex-end;
    width: 100%;
    .pxRem(line-height,96);
    background: @white-color;
    flex-shrink: 0;
    flex-grow: 0;
  }
  .group-present-total{
    .pxRem(font-size,20);
    .pxRem(margin-right,32);
    >span{
      color: @red-color;
    }
  }
  .submit{
    background: @red-color;
    color: @white-color;
    .pxRem(width,160);
    .pxRem(font-size,28);
    .pxRem(margin-left,16);
    text-align: center;
    flex-shrink: 0;
    flex-grow: 0;
  }
  .total>span{
    color: @red-color;
  }
  /* 滑动的事件 */
  .shop-group-touch{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
  }
</style>
