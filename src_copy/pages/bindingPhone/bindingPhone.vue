<template>
	<div class="viewport">
		<div class="header">
			<span class="go-back" @click="goBack"></span>
			<div>绑定手机号</div>
		</div>
		<div class="binding" v-if="!isBinding">
			<div class="other-list">
				<div class="other-item">
					<input type="number" placeholder="请输入手机号" v-model="mobile" @input="isGainCode=this.mobild!=''?true:false">
				</div>
				<div class="other-item">
					<input type="number" placeholder="请输入验证码" v-model="code">
					<div class="gain" @click="sendVerifyCode" :class="isGainCode?'active':''">{{gainText}}</div>
				</div>
			</div>
			<div @click="confirm" class="confirm" :class="mobile!=''&&code!=''?'active':''">确定</div>
		</div>
		<div class="changePhone" v-if='isBinding'>
			<img class="phoneImg" src="../../assets/bindingPhone.png" alt="">
			<div class="phoneNum">绑定手机号：{{mobileUrl}}</div>
			<div class="changeBtn" @click="changePhone">更换手机号</div>
		</div>
		<popUp v-if="isPopUp" :type='1' :time='3000' :content='popContent'></popUp>
	</div>
</template>
<script>
	import popUp from '@/components/popUp'
	export default {
		name:'index',
		data(){
			return {
				isBinding: false,
				isPopUp: false, // 弹窗提示
				popContent: '', // 弹窗提示文字
				mobile: '', // 手机号
				code: '', // 验证码
				gainText: '点击获取', // 获取验证码
				isGainCode: false,
				mobileUrl: '', // 已经绑定的手机号
			}
		},
		// 初始化函数
		mounted(){
		// 关闭提示框
			this.$eventBus.$on("closePopup",()=>{
				this.isPopUp = false;
			});
			let mobile = this.common.getUrlParam('mobile');
			if(mobile == 'null'||mobile=='undefined'||mobile==''){
				this.mobileUrl = false;
			}else{
				this.isBinding = true;
				this.mobileUrl = mobile;
			}
		},
		// 计算属性
		computed:{

		},
		// 定义函数
		methods:{
			// 返回
			goBack(){
				if(this.mobileUrl&&!this.isBinding){
					this.isBinding = true;
					return false
				}
				window.history.go(-1)
			},
			// 发送短信验证码
			sendVerifyCode(){
				if(this.mobile==''){
					this.isPopUp = true;
					this.popContent = '请先输入手机号';
					return false
				}
				var myreg=/^[1][0-9]{10}$/;
				if (!myreg.test(this.mobile)){
					this.isPopUp = true;
					this.popContent = '请输入正确的手机号';
					return false
				}
				this.dataService.sendVerifyCode({
					mobile: this.mobile
				}).then((resp)=>{
					this.dataService.handleResponse({
						data: resp,
						callback: (data)=>{
							this.gainText = '60秒';
							this.isGainCode = false;
							let time = setInterval(()=>{
								let gainText = parseInt(this.gainText) - 1;
								this.gainText = gainText+"秒";
								if(gainText<=0){
									this.isGainCode = true;
									this.gainText = '重新获取'
									clearInterval(time);
								}
							},1000)
                        },
                        callback1001:(data)=>{
                            this.isPopUp = true;
							this.popContent = data;
                        }
					})
				})
			},
			// 绑定手机号
			bindMobile(){
				this.dataService.bindMobile({
					mobile: this.mobile,
					code: this.code
				}).then((resp)=>{
					// if(resp.data.code==1000){
					// 	this.isPopUp = true;
					// 	this.popContent = '绑定成功';
					// 	setTimeout(()=>{
                    //         let userInfo = JSON.parse(sessionStorage.getItem('user-info'));
                    //         userInfo.mobile = this.mobile;
                    //         sessionStorage.setItem('user-info',JSON.stringify(userInfo))
					// 		location.href = './setting.html?mobile=' + this.mobile;
					// 	},3000)
					// }
					this.dataService.handleResponse({
						data: resp,
						callback1001:(data) =>{
							this.isPopUp = true;
							this.popContent = data;
                        },
                        callback:(data)=>{
                            this.isPopUp = true;
                            this.popContent = '绑定成功';
                            setTimeout(()=>{
                                let userInfo = JSON.parse(sessionStorage.getItem('user-info'));
                                userInfo.mobile = this.mobile;
                                sessionStorage.setItem('user-info',JSON.stringify(userInfo))
                                location.href = './setting.html?mobile=' + this.mobile;
                            },3000)
                        }
					})
				})
			},
			// 确定
			confirm(){
				if(this.mobile==''||this.code=='') return false;
				this.bindMobile();
			},
			// 更换手机号
			changePhone(){
				this.isBinding = false;
			}
		},
		watch: {
			
		},
		components:{
			popUp
		}
	}
</script>
<style lang="less">
	@import "../../less/common.less";
	body{
		background: @background-color
	}
	.viewport{
		max-width: 720px;
		margin: 0 auto;
		background-size: 100%;
		height: 100%;
		color: @gray-text;
		.pxRem(font-size,24);
		.pxRem(padding-top,96);
	}
	  /* 头部 */
	.header{
		position: fixed;
		width: 100%;
		left: 0;
		top: 0;
		.pxRem(line-height,56);
		.pxRem(font-size,28);
		.pxRem(padding,20);
		.flex();
		.alignItems();
		.justifyContent(space-between);
		.borderBottom(1);
		background: @white-color;
		z-index: 99999;
		>div{
			width: 100%;
			text-align: center;
		}
		>.go-back{
			position: absolute;
			.pxRem(left,30);
			.pxRem(width,16);
		}
	}
	.other-list{
		.pxRem(margin-top,16);
		.other-item{
			.flex();
			.justifyContent(space-between);
			.alignItems();
			.pxRem(height,96);
			.pxRem(padding-left,32);
			.pxRem(padding-right,16);
			background: @white-color;
			.borderBottom(1);
			&:last-child{
				border-bottom: none
			}
			>.gain{
				.border(1);
				.pxRem(min-width, 112);
				.pxRem(padding-left,16);
				.pxRem(padding-right,16);
				.pxRem(line-height,48);
				.pxRem(border-radius,30);
				.pxRem(font-size,20);
				text-align: center;
				color: @gray-light-text;
				box-sizing: border-box;
				&.active{
					color: @red-color;
					border-color: @red-color
				}
			}
			>input{
				.flexGrow(1);
				border: none;
			}
			>input::-webkit-input-placeholder{
				color: @gray-light-text;
			}
		}
	}
	.confirm{
		margin: 0 auto;
		.pxRem(margin-top,200);
		.pxRem(width,600);
		.pxRem(line-height,82);
		.pxRem(border-radius,45);
		opacity: .5;
		text-align: center;
		background: @red-color;
		color: @white-color;
		&.active{
			opacity: 1;
		}
	}
	.changePhone{
		.pxRem(font-size,32);
		text-align: center;
		.phoneImg{
			display: block;
			margin: 0 auto;
			.pxRem(width,230);
			.pxRem(height,228);
			.pxRem(margin-bottom,60);
			.pxRem(margin-top,120);
		}
		.changeBtn{
			position: fixed;
			bottom: 0;
			width: 100%;
			.pxRem(line-height,96);
			.pxRem(font-size,24);
			color: @red-color;
			background: @white-color;
		}
	}
</style>
