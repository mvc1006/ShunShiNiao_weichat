<template>
    <div class="viewport">
        <!-- 头部 -->
        <div class="header">
            <span class="go-back" @click="goBack"></span>
            <div>报名内容</div>
        </div>
        <!-- 报名内容 -->
        <div class="applyList">
            <!-- 通用 -->
            <div class="applyItem">
                <div class="applyName">姓名<span>*</span></div>
                <div class="applyContent">
                    <input v-if="!is_apply" v-model="user_name" type="text" placeholder="请输入姓名">
                    <span v-if="is_apply" v-text="user_name"></span>
                </div>
            </div>
            <div class="applyItem">
                <div class="applyName">手机号码<span>*</span></div>
                <div class="applyContent">
                    <input v-if="!is_apply" v-model="mobile" type="number" placeholder="请输入手机号码">
                    <span v-if="is_apply" v-text="mobile"></span>
                </div>
            </div>
            <!-- 招商相关 -->
            <div class="applyItem" v-if="circleType">
                <div class="applyName">店铺/公司名称</div>
                <div class="applyContent">
                    <input v-if="!is_apply" v-model="agency_name" type="text" placeholder="请输入店铺/公司名称">
                    <span v-if="is_apply" v-text="agency_name"></span>
                </div>
            </div>
            <div class="applyItem" v-if="circleType">
                <div class="applyName">经营品类<span>*</span></div>
                <div class="applyContent">
                    <input v-if="!is_apply" v-model="cate_name" type="text" placeholder="请输入经营的品类">
                    <span v-if="is_apply" v-text="cate_name"></span>
                </div>
            </div>
            <div class="applyItem" v-if="circleType">
                <div class="applyName">所在地区<span>*</span></div>
                <div class="applyContent" @click="selectAddress">
                    <span v-if="site.province">{{site.province}}-{{site.city}}-{{site.county}}</span>
                    <span class="person-write-ico" v-if="!is_apply"></span>
                </div>
            </div>
            <!-- 招聘相关 -->
            <div class="applyItem" v-if="postType">
                <div class="applyName">学历<span>*</span></div>
                <div class="applyContent" @click="selectEducation">
                    <span class="gray" v-if="!site.province">请选择目前学历</span>
                    <span v-text="site.province"></span>
                    <span class="person-write-ico" v-if="!is_apply"></span>
                </div>
            </div>
            <div class="applyItem" v-if="postType">
                <div class="applyName">工作年限<span>*</span></div>
                <div class="applyContent">
                    <input v-if="!is_apply" v-model="work_years" type="number" placeholder="请输入工作年限">
                    <span v-if="is_apply" v-text="work_years"></span>
                </div>
            </div>
            <div class="applyItem" v-if="postType">
                <div class="applyName">工作经历<span>*</span></div>
            </div>
            <!-- 通用 -->
            <div class="applyItem">
                <div class="address" v-if="is_apply" v-html="address"></div>
                <textarea v-if='!is_apply' v-model="address" :placeholder="circleType?'详细地址：如道路、门牌号、小区、楼栋号、单元等':'请在此处编辑以往工作经历… …'"></textarea>
            </div>
        </div>
        <!-- 招商相关 -->
        <div class="applyList" v-if="circleType">
            <div class="applyItem">
                <div class="applyName">邀请人姓名</div>
                <div class="applyContent">
                    <input v-if="!is_apply" v-model="inviterName" type="text" placeholder="请输入邀请人姓名">
                    <span v-if="is_apply" v-text="inviterName"></span>
                </div>
            </div>
        </div>
        <!-- 提交 -->
        <div v-if="!is_apply" class="submit" @click="submit"><div :class="{'active':isSubmit}">提交</div></div>
        <select-popup v-if="isSelectPop" :selectType='selectType' :showLine='selectShowLine' :site='site'></select-popup>
        <pop-up v-if = 'isPopup' :type = '1' :time = "3000" :content = 'popContent'></pop-up>
    </div>
</template>
<script>
    import popUp from '@/components/popUp';
    import selectPopup from '@/components/selectPopup.vue';
    export default {
        name:'app',
        data(){
            return {
                isPopup: false, // 是否弹窗提示
                isSelectPop: false,// 是否显示选择弹窗
                selectShowLine: 3, // 选择框显示几行
                selectType: 'site', // 请求类型
                popContent: '', // 弹窗提示内容
                user_name: '', // 姓名
                mobile: '', // 手机号
                agency_name: '', // 公司名称
                cate_name: '' , // 经营品类
                site: {}, // 所在地区
                isSite: false, // 地址是否存在
                address: '', // 详细地址
                inviterName: '', // 邀请人姓名
                education: '', // 学历
                work_years: '', // 工作年限
            }
        },
        computed: {
            // 招商类型
            circleType(){
                if(this.common.getUrlParam("circleType") == 'null') return false;
                return Number(this.common.getUrlParam("circleType"));
            },
            // 招聘类型
            postType(){
                if(this.common.getUrlParam("postType") == 'null') return false;
                return Number(this.common.getUrlParam("postType")); 
            },
            // 合作类型id
            hire_business_id(){
                return Number(this.common.getUrlParam("hire_business_id"));
            },
            // 是否申请过
            is_apply(){
                return Number(this.common.getUrlParam("is_apply"));
            },
            // 是否可以提交
            isSubmit(){
                return this.user_name!=''&&this.mobile!=''&&((this.cate_name!=''&&this.isSite)||(this.isSite&&this.work_years!=''&&this.address!=''));
            }
        },
        mounted(){
            if(this.is_apply){
                if(this.circleType){
                    this.circleDetails();
                }else{
                    this.postDetails();
                }
            }
            this.eventBus();
        },
        methods:{
            goBack(){
                window.history.back();
            },
            // eventBus事件
            eventBus(){
                // 关闭提示框
                this.$eventBus.$on("closePopup",() => {
                    this.isPopup = false;
                });
                // 关闭选择弹窗
                this.$eventBus.$on("selectPopCancel",() => {
                    this.isSelectPop = false;
                });
                // 关闭提示框
                this.$eventBus.$on("selectPopConfirm",(data) => {
                    this.site.province_id = data.one.region_id;
                    this.site.province = data.one.region_name;
                    this.site.city_id = data.two.region_id;
                    this.site.city = data.two.region_name;
                    this.site.county_id = data.three.region_id;
                    this.site.county = data.three.region_name;
                    this.isSite = true;
                    this.isSelectPop = false;
                    this.isSubmit;
                });
            },
            // 招商详情
            circleDetails(){
                this.dataService.bizApplyDetail({
                    hire_business_id: this.hire_business_id,
                }).then((resp) => {
                    this.dataService.handleResponse({
                        data: resp,
                        callback: (data)=>{
                            if(data==null) return false;
                            this.user_name = data.user_name;
                            this.mobile = data.mobile;
                            this.agency_name = data.agency_name;
                            this.cate_name = data.cate_name;
                            this.site.province = data.province
                            this.site.city = data.city;
                            this.site.county = data.county;
                            let address = data.address.replace(/&lt;/g,"<");
                                address = address.replace(/&gt;/g,">");
                            this.address = address;
                        },
                    })
                })
            },
            // 招聘详情
            postDetails(){
                this.dataService.jobApplyDetail({
                    hire_jobs_id: this.hire_business_id,
                }).then((resp) => {
                    this.dataService.handleResponse({
                        data: resp,
                        callback: (data)=>{
                            this.user_name = data.user_name;
                            this.mobile = data.mobile;
                             this.site.province = data.education
                            // this.education = data.education;
                            this.work_years = data.work_years;
                            let address = data.work_experience.replace(/&lt;/g,"<");
                                address = address.replace(/&gt;/g,">");
                            this.address = address;
                        },
                    })
                })
            },
            // 选择地区
            selectAddress(){
                if(this.is_apply) return false;
                this.selectType = 'site';
                this.selectShowLine = 3;
                this.isSelectPop = true;
            },
            // 选择学历
            selectEducation(){
                if(this.is_apply) return false;
                this.selectType = 'education';
                this.selectShowLine = 1;
                this.isSelectPop = true;
            },
            // 提交
            submit(){
                let address = this.address.replace(/\n/g,"<br/>");
                let isHint = false,content = '',myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
                if(this.user_name == ''){
                    content = "请输入姓名";
                    isHint = true;
                }else if(this.mobile == ''){
                    content = '请输入手机号';
                    isHint = true;
                }else if(!myreg.test(this.mobile)){
                    content = '请输入正确的手机号';
                    isHint = true;
                }else if(this.circleType){
                    if(this.cate_name == ''){
                        content = '请输入经营品类';
                        isHint = true;
                    }else if(this.site.province_id == ''){
                        content = '请输入所在地区';
                        isHint = true;
                    }
                }else{
                    if(this.site.province_id == ''){
                        content = '请输入学历';
                        isHint = true;
                    }else if(this.work_years == ''){
                        content = '请输入工作年限';
                        isHint = true;
                    }else if(this.address == ''){
                        content = '请输入以往工作经历';
                        isHint = true;
                    }
                }
                if(isHint){
                    this.popUpHint(content);
                    return false;
                }
                if(this.circleType){
                    this.circleApply();
                }else{
                    this.postApply();
                }
            },
            // 招商报名
            circleApply(){
                this.dataService.bizApply({
                    hire_business_id: this.hire_business_id,
                    hire_type: this.circleType,
                    user_name: this.user_name,
                    mobile: this.mobile,
                    agency_name: this.agency_name,
                    cate_name: this.cate_name,
                    province_id: this.site.province_id,
                    city_id: this.site.city_id,
                    county_id: this.site.county_id,
                    address: this.address
                }).then((resp) => {
                    if(resp.data.code==1000){
                        this.popUpHint(resp.data.msg);
                        setTimeout(() => {
                            this.goBack();
                        },3000)
					}
                    this.dataService.handleResponse({
                        data: resp,
                        callback: (data) => {},
                        callback1001: (data) => {
                            this.popUpHint(data);
                        }
                    })
                })
            },
            // 招聘报名
            postApply(){
                let address = this.address.replace(/\n/g,"<br/>");
                this.dataService.jobApply({
                    hire_jobs_id: this.hire_business_id,
                    user_name: this.user_name,
                    mobile: this.mobile,
                    education: this.site.province,
                    work_years: this.work_years,
                    work_experience: address
                }).then((resp) => {
                    if(resp.data.code==1000){
                        this.popUpHint(resp.data.msg);
                        setTimeout(() => {
                            this.goBack();
                        },3000)
					}
                    this.dataService.handleResponse({
                        data: resp,
                        callback: (data) => {},
                        callback1001: (data) => {
                            this.popUpHint(data);
                        }
                    })
                })
            },
            // 弹窗提示
            popUpHint(content){
                this.isPopup = true;
                this.popContent = content;
            }
        },
        components:{
            selectPopup,
            popUp
        }
    }
</script>
<style lang="less">
    @import url('../../less/header.less');
    *{
        box-sizing: border-box;
    }
    body{
        background: @background-color;
    }
    .viewport{
        max-width: 720px;
        margin: 0 auto;
        background-size: 100%;
        color: @gray-text;
        .pxRem(font-size,24);
        .pxRem(padding-top,96);
        .pxRem(padding-bottom,96);
        >div{
            background: @white-color;
        }
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
        background: @white-color;
        z-index: 99999;
    }
    .header>div{
        width: 100%;
        text-align: center;
    }
    .header>.go-back{
        position: absolute;
        .pxRem(left,30);
        .pxRem(width,16);
    }
    // 报名内容
    .applyList{
        .pxRem(margin-top,16)
    }
    .applyItem{
        .flex();
        .justifyContent(space-between);
        // .alignItems();
        .pxRem(line-height,96);
        .pxRem(padding-left,32);
        .pxRem(padding-right,32);
        color: @simple-gray-color;
        .borderBottom(2);
        textarea{
            width: 100%;
            .pxRem(height,160);
            .pxRem(line-height,48);
            .pxRem(font-size,24);
            border: none;
            &::-webkit-input-placeholder{
                color: @gray-light-text
            }
        }
        .address{
            .pxRem(min-height,180);
            line-height: 2;
            .pxRem(padding-top,16);
        }
    }
    .applyName{
        .flexShrink(0);
        >span{
            color: @red-color;
        }
    }
    .applyContent{
        .flexGrow(1);
        .flex();
        .justifyContent(flex-end);
        .alignItems();
        overflow: hidden;
        >span{
            color: @gray-text;
            .pxRem(margin-left,8);
        }
        >input{
            display: block;
            width: 100%;
            height: 100%;
            text-align: right;
            .pxRem(font-size,24);
            border: none;
            &::-webkit-input-placeholder{
                color: @gray-light-text
            }
        }
        .gray{
            color: @gray-light-text;
        }
    }
    .submit{
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        .pxRem(line-height,96);
        .pxRem(font-size,28);
        text-align: center;
        color: @white-color;
        z-index: 9999;
        >div{
            width: 100%;
            background: @red-color;
            opacity: .3;
            &.active{
                opacity: 1;
            }
        }
    }
</style>

