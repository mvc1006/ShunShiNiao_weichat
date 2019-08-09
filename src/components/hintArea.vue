<template>
	<div class="hint-area">
		<div class="hint-name" v-text="title"></div>
		<div class="hint-content" v-html="hintContent"></div>
	</div>
</template>
<script>
	export default {
		name: 'hint',
		props: {
			title: {
				type: String,
				default: 'Tips',
			},
			content: {
				type: String,
				default: ''
			}
		},
		data () {
			return {
				hintContent: '',
			}
		},
		mounted(){
			
		},
		methods:{
			
		},
		watch: {
			content(){
				let hintContent = this.content.replace(/&lt;/g,"<");
				hintContent = hintContent.replace(/&gt;/g,">");
				hintContent = hintContent.replace(/&quot;/g,"'");
				hintContent = hintContent.replace(/&amp;nbsp;/g," ");
				hintContent = hintContent.replace(/white-space: nowrap;/g,"");
				this.hintContent = hintContent;
			}
		},
		computed: {
			
		},
	}
	</script>
<style lang='less'>
	@import url('../less/common.less');
	.hint-area{
		.flex();
		.flexWrap(wrap);
		.pxRem(margin-top,35);
		.pxRem(margin-left,16);
		.pxRem(margin-right,16);
		.pxRem(font-size,24);
		.hint-name{
			position: relative;
			overflow: hidden;
			.pxRem(line-height,56);
			.pxRem(padding-left,16);
			.pxRem(padding-right,30);
			background: @yellow-text;
			color: @white-color;
			&::after{
				position: absolute;
				right: 0;
				top: 0;
				.pxRem(right,-24);
				content: '';
				.border(56,transparent);
				.borderRight(24,transparent);
				.borderLeft(24,transparent);
				.borderTop(56,@background-color);
			}
		}
		.hint-content{
			width: 100%;
			.pxRem(padding,24);
			.pxRem(border-radius,8);
			.pxRem(font-size,24);
			.border(2,@yellow-text,dashed);
			background: #FFFCE3;
			color: #B58304;
		}
		br{
			// display: none
		}
	}
</style>
