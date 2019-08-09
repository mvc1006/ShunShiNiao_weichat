<template>
	<div class="evaluate-list">
		<div class="evaluate-item" :key="index" v-for="(comment,index) in comment_list">
			<div class="head-portrait">
				<img :src="comment.avatar" v-if="comment.avatar">
				<img src="../assets/anonymityImg.png" v-else>
			</div>
			<div class="evaluate-data">
				<!-- 用户信息 -->
				<div class="user-data">
					<span>{{comment.user_nickname}}</span>
					<span>{{comment.create_time}}</span>
				</div>
				<!-- 评价星级 -->
				<div class="star-level">
					<span>评分</span>
					<div>
						<img v-for="i in comment.goods_point" :key='i' src="../assets/star_active.png" alt="">
						<img v-for="i in (5 - comment.goods_point)" src="../assets/star_gray.png" alt="">
					</div>
				</div>
				<!-- 评价内容 -->
				<div class="evaluate-content">{{comment.text}}</div>
				<!-- 全文 -->
				<div class="full-text"  v-if="comment.showAll"  @click="showAllText(comment)">{{comment.btnText}}</div>
				<!-- 评论图片 -->
				<div class="evaluate-img">
					<img v-for="(item,index) in comment.image_list" 
						:class="className(comment.image_list)"
						:src="item"  :data-large="comment.image_list_o[index]"  v-gallery="item.id" :key="index" alt="">
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		name:'evaluate',
		props: ["comment_list"],
		data(){
			return {
				starLevel: 3,
				list:[]
			}
		},
		computed:{
		
		},
		methods:{
			className(img){
				let className = '',imgLength  = img.length;
				switch (imgLength){
					case 1: 
					className = 'oneImg';
					break;
					case 2:
					className = 'twoImg';
					break;
					case 3:
					case 5: 
					case 6: 
					case 7: 
					case 9:
					className = 'threeImg';
					break;
					case 4:
						className = 'threeImg fourImg';
						break;
					case 8:
					className = 'eightImg';
					break; 
				}
				return className;
			},
			showAllText(item){
				// 全部显示的时候为1
				if(item.click){
					item.text = item.content.substr(0,100)+'...';
					item.btnText = '全文';
				}else{
					item.text = item.content;
					item.btnText = '收起';
				}
				item.click = !item.click;
			}
		},
	}
</script>
<style lang="less">
	@import "../less/common.less";
	.evaluate-list{
		border-top: 1px solid #F9F9F9;
		border-bottom: 1px solid #F9F9F9;
	}
	.evaluate-item{
		.pxRem(margin-top,16);
		.pxRem(padding-left,18);
		.pxRem(padding-right,22);
		.pxRem(padding-top,32);
		.flex();
		background: @white-color;
	}
	/* 头像 */
	.head-portrait{
		.pxRem(width,96);
		.pxRem(height,96);
		border-radius: 50%;
		overflow: hidden;
		flex-shrink: 0;
	}
	/* 评论信息 */
	.evaluate-data{
		flex-grow: 1;
		.pxRem(padding-left,16);
		.pxRem(padding-bottom,48);
		line-height: 1;
		.borderBottom(2);
	}
	.evaluate-item:last-child .evaluate-data{
		border: none;
	}
	/* 用户信息 */
	.user-data{
		.flex();
		.justifyContent(space-between);
		.pxRem(font-size,24);
		color: @gray-light-text;
		.pxRem(margin-bottom,22);
	}
	.user-data>span:first-child{
		color: #529ADF;
	}
	/* 评分 */
	.star-level{
		.pxRem(font-size,20);
		color: @gray-text;
		.pxRem(margin-bottom,16);
		.flex();
		.alignItems();
	}
	.star-level>span{
		.pxRem(margin-right,16)
	}
	.star-level img{
		.pxRem(width,30);
		.pxRem(height,30);
	}
	/* 评价内容 */
	.evaluate-content{
		.pxRem(font-size,24);
		.pxRem(line-height,36);
		color: @gray-text;
		.pxRem(margin-bottom,36)
	}
	/* 全文 */
	.full-text{
		.pxRem(font-size,20);
		color: #529ADF;
		.pxRem(margin-bottom,26)
	}
	/* 评论图片 */
	.evaluate-img{
		.flex();
		.flexWrap(wrap);
		>.oneImg{
			.pxRem(width,336);
			.pxRem(height,336);
		}
		>.twoImg{
			.pxRem(width,248);
			.pxRem(height,248);
		}
		>.threeImg{
			.pxRem(width,160);
			.pxRem(height,160);
		}
		>.fourImg:nth-child(2){
			.pxRem(margin-right,160);
		}
		>.eightImg{
			.pxRem(width,116);
			.pxRem(height,116);
		}
	}
	.evaluate-img>img{
		.pxRem(border-radius,8);
		.pxRem(margin-right,16);
		.pxRem(margin-bottom,16);
	}
</style>
