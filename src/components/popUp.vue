/**
  弹窗组件(可以传入五个参数)
    type 表示显示那种弹窗 1为提示弹窗 2位选择弹窗 默认为1
    content 表示当前弹窗的说明
    time 表示弹窗多久消失 只有type值为1的时候生效
    cancel 表示取消区域显示的文字，默认取消 只有type值为2的时候生效
    confirm 表示确定区域显示的文字，默认确定 只有type值为2的时候生效
  此组件可以闯传入两个函数 只有type值为2的时候生效
    一个为点击确定时 方法名为 popupconfirm
    一个为点击取消时 方法名为 popupcancel
*/
<template>
	<div class="popUp" v-if='isType' @click='cancelFun'>
		<div v-if='isType==2' class="popUp-select">
			<div class="popUp-name" v-html="contentText"></div>
			<div class="popUp-btn">
				<div @click.stop='cancelFun' class="popUp-cancel">{{cancelText}}</div>
				<div @click.stop='confirmFun' class="popUp-confirm">{{confirmText}}</div>
			</div>
			<!-- <div @click='cancelFun' class="popUp-delete"><img src='../assets/download.jpg' alt=""></div> -->
		</div>
		<div v-if='isType==1' class="popUp-hint" v-html="contentText"></div>
	</div>
</template>
<script>
	import common from '../js/common';
	import localStorageCorrelation from '../js/localStorageCorrelation'
	export default {
		name: 'popUp',
		props:['type','content','time','cancel','confirm',"isMainShop",'pageName'],
		data () {
			return {
				isType: 1, // 显示那个弹窗
				cancelText: '取消', // 取消框显示文字
				confirmText: '确定', // 确定框显示文字
				contentText: '提示', // 提示文字
			}
		},
		computed: {
			commonData(){
				return this.$store?this.$store.state.commonData:'';
			}
		},
		mounted(){
			var time = 3000;
			if(this.type){
				this.isType = this.type;
			}
			if(this.content){
				this.contentText = this.content;
			}
			if(this.cancel){
				this.cancelText = this.cancel;
			}
			if(this.confirm){
				this.confirmText = this.confirm;
			}
			if(this.time){
				time = this.time
			}
			if(this.isType==1){
				setTimeout(()=>{
					this.isType = false;
					if(this.commonData){
						this.commonData.isPopUp = false;
					}
					this.$eventBus.$emit("closePopup");
				},time)
			}
		},
		methods:{
			confirmFun(){
				this.isType = false;
                this.$emit('popupconfirm');

				if(!this.commonData.isSkipOtherPage){
					var ssn_shopGroup =  this.commonData.ssn_shopGroup,
						pid = Number(common.getUrlParam("pid")) || '';
					if(this.isMainShop){
						ssn_shopGroup.presentList = [];
						if(pid){
							localStorage.setItem("pid",pid);
						}else{
							localStorage.setItem("pid",'');
						}
					}else{
						if(ssn_shopGroup.presentList.length>=5){
							if(JSON.stringify(this.commonData.ssn_shopGroup.mainShop)=='{}'){
								window.location.href = './selectShop.html?buyPresent=true&isActivity='+this.commonData.isActivity;
							}else{
								window.location.href = "./confirmOrder.html";
							}
							return false;
						}
						ssn_shopGroup.mainShop = {};
						ssn_shopGroup.presentList.splice(0,ssn_shopGroup.presentList.length-1);
					}
					this.commonData.isSpe = false;
					this.commonData.ssn_shopGroup = ssn_shopGroup;
					localStorageCorrelation.setLocalStorage(this);
					localStorage.setItem("order_id",'');
					localStorage.setItem("main_order_goods_id",'');
					localStorage.setItem("give_count",this.commonData.shopData.give_count);
					var isActivity = [1,3].includes(Number(this.commonData.isActivity));
					if(!this.isMainShop) {
						if(this.pageName=='shopDetails'){
							history.back(-1);
						}
						return false
					}
					if(this.commonData.isGotoPresent&&!isActivity){
						window.location.href = './selectShop.html?buyPresent=false&isActivity='+this.commonData.isActivity;
					}else{
						window.location.href = "./confirmOrder.html";
					}
				}
			},
			cancelFun(){
				this.isType = false;
				this.$emit('popupcancel');
                this.$eventBus.$emit("closePopup");
				if(this.commonData){
					this.commonData.isPopUp = false;
					localStorageCorrelation.getLocalStorage(this);
				}
			}
		},
	}
</script>
<style lang='less'>
	@import url('../less/common.less');
	.popUp{
		position: fixed;
		top: 0;
		left: 0;
		.flex();
		.alignItems();
		width: 100%;
		height: 100%;
		background: rgba(0,0,0,.2) !important;
		.pxRem(font-size,28);
		text-align: center;
		z-index: 999999;
	}
	/* 选择 */
	.popUp-select{
		position: relative;
		width: 85%;
		margin: 0 auto;
		background: #fff;
		.borderRadius(10);
	}
	.popUp-name{
		.pxRem(padding-top,40);
		.pxRem(padding-bottom,40);
		.pxRem(padding-left,40);
		.pxRem(padding-right,40);
		.pxRem(line-height,40);
		.borderBottom(2);
	}
	.popUp-btn{
		.flex();
		.justifyContent(space-between);
		.pxRem(font-size,32);
	}
	.popUp-btn>div{
		.flexGrow(1);
		.pxRem(padding-top,16);
		.pxRem(padding-bottom,16);
		.borderLeft(2);
	}
	.popUp-btn>div:first-child{
		border: none;
		color: #7B7B7B;
	}
	.popUp-confirm{
		color: #BF5F54;
	}
	.popUp-delete{
		position: absolute;
		width: 100%;
		.flex();
		.justifyContent();
		.pxRem(padding-top,30);
		.pxRem(padding-bottom,30);
	}
	.popUp-delete>img{
		width: 33px;
		height: 33px;
	}
	/* 提示 */
	.popUp-hint{
		width: 70%;
		margin: 0 auto;
		background: rgba(0,0,0,.7);
		color: @white-color;
		text-align: center;
		.pxRem(padding-top,10);
		.pxRem(padding-bottom,10);
		.pxRem(padding-left,10);
		.pxRem(padding-right,10);
		.pxRem(font-size,24);
		.borderRadius(10);
		animation: .5s popUp;
	}
	@keyframes popUp {
		0% {transform: scale(1)}
		50% {transform: scale(1.2)}
		100% {transform: scale(1)}
	}
</style>
