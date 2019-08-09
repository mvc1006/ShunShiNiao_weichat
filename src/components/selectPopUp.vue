<template>
	<div class="select-popoup">
		<div class="select-area">
			<div class="selsec-name">
				<span class="cancel" @click="cancel">取消</span>
				<span>所在地区</span>
				<span class="confirm" @click="confirm">确定</span>
			</div>
			<div class="select-area-list">
				<div class="pitchOn"></div>
				<div class="pitchOn pitchOnBottom"></div>
				<div id="select_one" v-if="province_list.length > 0" class="select-list" @scroll="scollOne($event)" @touchend='touchendOne' @touchstart='touchstartOne'>
					<div class="stance"></div>
					<div class="stance"></div>
					<div class="stance"></div>
					<div class="stance"></div>
					<div v-for="(province,index) in province_list" :key="index" :class="{'active':activeOne==index}" v-text="province.region_name"></div>
					<div class="stance"></div>
					<div class="stance"></div>
					<div class="stance"></div>
					<div class="stance"></div>
				</div>
				<div id="select_two" v-if="city_list.length > 0" class="select-list" @scroll="scollTwo($event)" @touchend='touchendTwo' @touchstart='touchstartTwo'>
					<div class="stance"></div>
					<div class="stance"></div>
					<div class="stance"></div>
					<div class="stance"></div>
					<div v-for="(province,index) in city_list" :key="index" :class="{'active':activeTwo==index}" v-text="province.region_name"></div>
					<div class="stance"></div>
					<div class="stance"></div>
					<div class="stance"></div>
					<div class="stance"></div>
				</div>
				<div id="select_three" v-if="county_list.length > 0" class="select-list" @scroll="scollThree($event)" @touchend='touchendThree' @touchstart='touchstartThree'>
					<div class="stance"></div>
					<div class="stance"></div>
					<div class="stance"></div>
					<div class="stance"></div>
					<div v-for="(province,index) in county_list" :key="index" :class="{'active':activeThree==index}" v-text="province.region_name"></div>
					<div class="stance"></div>
					<div class="stance"></div>
					<div class="stance"></div>
					<div class="stance"></div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		name:'selectPopup',
		// 商品组数据，赠品是否已经达到上限
		props: {
			selectType: {
				type: String,
				default: 'site',
			},
			showLine: {
				type: Number,
				default: 3,
			},
			site: {
				type: Object,
				default: () => {
					return {}
				}
			}
		},
		data(){
			return {
				isFristLoad: true, // 是否为第一此加载
				province_list: [],// 省份
				city_list: [],// 城市
				county_list: [], // 地区
				province_id: '', // 选择的省份id
				city_id: '', // 选择的城市id
				activeOne: 0, // 默认第一项选中的
				activeTwo: 0, // 默认第二项选中的
				activeThree: 0, // 默认第三项选中的
				scollOneEnd: true, // 是否松开手指
				scollTwoEnd: true, // 是否松开手指
				scollThreeEnd: true, // 是否松开手指
				isload: false,
			}
		},
		mounted(){
			if(this.selectType == 'education'){
				this.province_list = [
					{region_id: 1,region_name:'高中'},
					{region_id: 2,region_name:'专科'},
					{region_id: 3,region_name:'本科'},
					{region_id: 4,region_name:'硕士'},
					{region_id: 5,region_name:'博士'},
				]
				let num = this.getSelectNum(this.province_list,0)?this.getSelectNum(this.province_list,0):2;
				this.scollOne(num);
				return false
			}
			this.getAddress(0,0);
		},
		methods:{
			// 一屏滚动
			scollOne(e){
				let itemHeight = Math.floor(45 * this.rpx);
				setTimeout(() => {
					let time = setInterval(() => {
						if(this.scollOneEnd){
							if(e.target){
								let scrollTop = e.target.scrollTop;
								this.activeOne = Math.round(scrollTop / itemHeight);
							}else{
								this.activeOne = e;
							}
							clearInterval(time);
							document.getElementById('select_one').scrollTop = this.activeOne * itemHeight;
							if(this.showLine==1) return false;
							this.getAddress(this.province_list[this.activeOne].region_id,1)
						}
					},10)
				},this.isFristLoad?50:300)
			},
			touchstartOne(){
				this.scollOneEnd = false;
			},
			touchendOne(){
				this.scollOneEnd = true;
			},
			// 二屏滚动
			scollTwo(e){
				let itemHeight = Math.floor(45 * this.rpx);
				setTimeout(() => {
					let time = setInterval(() => {
						if(this.scollTwoEnd){
							if(e.target){
								let scrollTop = e.target.scrollTop;
								this.activeTwo = Math.round(scrollTop / itemHeight);
							}else{
								this.activeTwo = e;
							}
							clearInterval(time);
							document.getElementById('select_two').scrollTop = this.activeTwo * itemHeight;
							if(this.showLine==2) return false;
							this.getAddress(this.city_list[this.activeTwo].region_id,2)
						}
					},10)
				},this.isFristLoad?50:300)
			},
			touchstartTwo(){
				this.scollTwoEnd = false;
			},
			touchendTwo(){
				this.scollTwoEnd = true;
			},
			// 三屏滚动
			scollThree(e){
				let itemHeight = Math.floor(45 * this.rpx);
				setTimeout(() => {
					let time = setInterval(() => {
						if(this.scollThreeEnd){
							if(e.target){
								let scrollTop = e.target.scrollTop;
								this.activeThree = Math.round(scrollTop / itemHeight);
							}else{
								this.activeThree = e;
							}
							clearInterval(time);
							document.getElementById('select_three').scrollTop = this.activeThree * itemHeight;
						}
					},10)
				},this.isFristLoad?50:300);
				this.isFristLoad = false;
			},
			touchstartThree(){
				this.scollThreeEnd = false;
			},
			touchendThree(){
				this.scollThreeEnd = true;
			},
			// 获取省市区
			getAddress(id,grade){
				if((grade == 1&&this.province_id == id)||(grade == 2&&this.city_id == id))return false;
				this.province_id = id;
				this.city_id = id;
				if(this.isload) return false;
				this.isload = true;
				this.dataService.getAreaList({
                    pid: id,
                }).then((resp) => {
                    this.dataService.handleResponse({
                        data: resp,
                        callback: (data)=>{
							this.isload = false;
							if(grade==0){
								setTimeout(()=>{
									this.province_list = data;
								})
								if(this.isFristLoad){
									let num = this.getSelectNum(data,0);
									if(num){
										this.scollOne(num);
									}else{
										if(this.showLine==1) return false;
										this.getAddress(data[0].region_id,1);
									}
									return false
								}
								if(this.showLine==1) return false;
								this.getAddress(data[0].region_id,1);
								return false;
							}
							if(grade==1){
								setTimeout(()=>{
									this.city_list = data;
								})
								if(this.isFristLoad){
									let num = this.getSelectNum(data,1);
									if(num){
										this.scollTwo(num);
									}else{
										if(this.showLine==2) return false;
										this.getAddress(data[0].region_id,2);
									}
									return false
								}
								if(this.showLine==2) return false;
								this.getAddress(data[0].region_id,2);
								this.scollTwo(0);
								return false;
							}
							if(grade == 2){
								setTimeout(()=>{
									this.county_list = data;
								})
								if(this.isFristLoad){
									let num = this.getSelectNum(data,2);
									if(num){
										this.scollThree(num);
										return false
									};
								}
								this.scollThree(0);
							}
                        },
                    })
                })
			},
			// 获取选择的是第几个
			getSelectNum(data,num){
				for(let i = 0; i < data.length; i++){
					if(num==0&&(data[i].region_id == this.site.province_id||data[i].region_name == this.site.province)){
						return i;
					}
					if(num==1&&(data[i].region_id == this.site.city_id||data[i].region_name == this.site.city)){
						return i;
					}
					if(num==2&&(data[i].region_id == this.site.county_id||data[i].region_name == this.site.county)){
						return i;
					}
				}
				return '';
			},
			// 取消选择
			cancel(){
				this.$eventBus.$emit("selectPopCancel");
			},
			// 确认选择
			confirm(){
				let data = {
					one: this.province_list[this.activeOne],
					two: this.showLine>=2?this.city_list[this.activeTwo]:{},
					three: this.showLine>=3?this.county_list[this.activeThree]:{},
				}
				this.$eventBus.$emit("selectPopConfirm",data);
			},
		},
		computed: {
			// rem单位换算
			rpx(){
				let winWidth = window.screen.width;
				return winWidth / 720;
			},
		},
		components:{}
	}
</script>
<style lang='less' scoped>
	@import "../less/common";
	.select-popoup{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0,0,0,.3);
		z-index: 9999;
		.pxRem(font-size,24);
		.flex();
		.alignItems(flex-end);
	}
	.select-area{
		max-width: 720px;
		width: 100%;
		margin: 0 auto;
		background: @white-color;
	}
	.selsec-name{
		.flex();
		.justifyContent(space-between);
		.alignItems(center);
		.pxRem(padding-left,24);
		.pxRem(padding-right,24);
		.pxRem(line-height,96);
		.pxRem(font-size,28);
		.borderBottom(1);
		.cancel{
			.pxRem(font-size,26);
		}
		.confirm{
			.pxRem(font-size,26);
			color: @red-color
		}
	}
	.select-area-list{
		position: relative;
		.flex();
		.pxRem(height,405);
		.pxRem(line-height,45);
		>div{
			.flexGrow(1);
			flex: 1;
			.pxRem(padding-left,24);
			.pxRem(padding-right,24);
			overflow: auto;
			text-align: center;
		}
		.active{
			color: @red-color;
			.pxRem(font-size,28);
		}
		.pitchOn{
			position: absolute;
			.pxRem(top,180);
			width: 100%;
			.borderBottom(2)
		}
		.pitchOnBottom{
			.pxRem(top,225);
		}
		.stance{
			.pxRem(height,45);
		}
	}
	.select-list{
		>div{
			overflow:hidden;
			text-overflow:ellipsis;
			white-space:nowrap
		}
	}
</style>
