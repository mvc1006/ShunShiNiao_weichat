<template>
    <div class="container">
        <div class="header-top">
            <div class="back">
                <div class="go-back" @click="goBack"></div>
            </div>
            <div class="title" v-text="title"></div>
            <div class="add-new"
                v-if="addBtn"
                @click="toAddNew">添加</div>
            <div class="save-new" v-else @click="saveNewAddr">保存</div>
        </div>
        <div class="addr-cont">
            <!-- 地址列表 -->
            <div class="show-addr-list" v-if="addBtn">
                <div class="addr-list" v-if="addrList.length>0">
                    <ul class="addr-list-ul">
                        <li class="addr-one" v-for="(item,index) in addrList" :key="index">
                            <div class="addr-info" @click="goConfirm(item)">
                                <p>
                                    <span class="name" v-text="item.consignee"></span>
                                    <span class="tel" v-text="item.telephone"></span>
                                    <span class="default" v-if="item.is_default==1">默认</span>
                                </p>
                                <p class="addr-details">
                                   {{item.province}}{{item.city}}{{item.county}}{{item.address}}
                                </p>
                            </div>
                            <div class="edit" @click.stop="edit(index)">编辑</div>
                        </li>
                    </ul>
                </div>
                <div class="no-data" v-else></div>
            </div>
            <!-- 添加地址 -->
            <div class="add-new-addr" v-else>
                <ul class="info-list">
                    <li class="info-item">
                        <div class="write-info">
                            <input type="text" placeholder="收货人" v-model.trim="userName">
                        </div>
                        <div class="info-ico">
                            <div class="person-name-ico"></div>
                        </div>
                    </li>
                    
                    <li class="info-item">
                        <div class="write-info">
                            <input type="number" placeholder="手机号码" v-model.trim="userTel">
                        </div>
                        <div class="info-ico">
                            <div class="ico-text">+86</div>
                            <div class="person-write-ico"></div>
                        </div>
                    </li>
                    <li class="info-item">
                        <div class="write-info">
                            <span class="selectSite" @click="selectAddress" v-text="userAddr?userAddr:'所在地区'"></span>
                        </div>
                        <div class="info-ico">
                            <div class="person-write-ico"></div>
                        </div>
                    </li>
                    <li class="info-item">
                        <div class="write-info">
                            <textarea v-model.trim="userAddrDetail" cols="30" rows="3" placeholder="详细地址：如道路、门牌号、小区、楼栋号、单元等"></textarea>
                        </div>
                    </li>
                    <li class="info-item real-info">实名认证信息只用于跨境商品报关，请放心填写</li>
                    <li class="info-item">
                        <div class="write-info">
                            <input type="text" placeholder="真实姓名" v-model.trim="realName">
                        </div>
                    </li>
                    <li class="info-item">
                        <div class="write-info">
                            <input type="text" placeholder="身份证号码(我们将加密处理，请放心填写)" v-model.trim="userCode">
                        </div>
                    </li>
                    <li class="info-item set-default-box">
                        <div class="item-name">设为默认地址</div>
                        <div class="item-set">
                            <div class="set-default-active" v-if="isDetault" @click="setDefault"></div>
                            <div class="set-default" v-else @click="setDefault"></div>
                        </div>
                    </li>
                </ul>
                <div class="del-addr" v-if="isEdit" @click="delAddr">删除收货地址</div>
            </div>
        </div>
        <!-- 选择地址 -->
        <select-popup v-if="isSelectPop" :site='addrConcat'></select-popup>
        <component :is="pop" :type="popTips.type"
            :content="popTips.content"
            :time="'3000'"
            :cancel="popTips.cancel"
            :confirm="popTips.confirm"
            @popupcancel="cancelFun"
            @popupconfirm="confirmFun">
        </component>
    </div>
</template>
<script>
import areaPicker from '@/components/areaPicker.vue';
import popUp from '@/components/popUp';
import selectPopup from '@/components/selectPopup.vue'; // 选择地址
export default {
    name:'app',
    data(){
        return {
            addBtn:true, // 默认显示 地址列表界面
            pop:'',// 弹窗用的模班
            title:'我的收货地址', // 顶部根据不同情况显示的内容
            popTips:{ // 弹窗需要的数据
                type: 2,
                content:'',
                cancel:'取消',
                confirm:'删除'
            },
            // 收货地址相关
            addrList:[], // 已添加的地址列表
            editIndex:0, // 第几个地址
            // 编辑或者添加地址相关
            isEdit:false, // 是否显示删除地址
            isDetault:false, // 设置默认地址
            userName:'', // 姓名
            userCode:'',// 身份证号码
            realName:'',
            userTel:'',// 电话
            userAddr:'', //地址
            addrConcat:{},
            userAddrDetail:'',// 详细地址 -- 街道 单元号等
            addDefault:{
                province:'',
                city:'',
                district:''
            },
            isSelectPop: false, // 打开选择地址弹窗
        }
    },
    beforeMount(){
        this.getUserAddrList();
    },
    mounted(){
        this.init();
        this.common.goBack(this.goBack);
    },
    methods:{
        // 初始化页面
        init(){
            // 关闭选择弹窗
            this.$eventBus.$on("selectPopCancel",() => {
                this.isSelectPop = false;
            });
            // 关闭提示框
            this.$eventBus.$on("selectPopConfirm",(data) => {
                this.addrConcat.province_id = data.one.region_id;
                this.addrConcat.province = data.one.region_name;
                this.addrConcat.city_id = data.two.region_id;
                this.addrConcat.city = data.two.region_name;
                this.addrConcat.county_id = data.three.region_id;
                this.addrConcat.county = data.three.region_name;
                this.userAddr = data.one.region_name + ' ' + data.two.region_name + ' ' + data.three.region_name
                this.isSelectPop = false;
            });
            this.$eventBus.$on('hideAreaPicker',()=>{
                this.hidePicker();
            })
        },
        // 选择地区
        selectAddress(){
            if(this.is_apply) return false;
            this.selectType = 'site';
            this.selectShowLine = 3;
            this.isSelectPop = true;
        },
        addFormart(val){
            if(val){
                return val + ' ';
            }else{
                return '';
            }
        },
        clear(){
            this.userCode = '';
            this.realName = '';

            this.userName='';
            this.userTel='';
            this.userAddr='';
            this.addrConcat={};
            this.userAddrDetail='';
            this.isDetault=false;
            this.isEdit = false;
            this.editIndex = 0;
            this.addDefault={
                province:'',
                city:'',
                district:''
            }
        },
        // 编辑收货地址
        edit(index){
            this.title = '编辑收货地址';
            this.editIndex = index;
            const data = this.addrList[index];
            this.addBtn = false;
            this.isEdit = true;

            this.userName = data.consignee;
            this.userCode = data.idcard;
            this.realName = data.real_name;
            this.userTel = data.telephone;
            this.userAddr = data.province + ' ' + data.city + ' ' + data.county;
            this.addDefault={
                province:data.province,
                city:data.city,
                district:data.county
            };
            this.addrConcat = {
                province_id: data.province_id,
                province: data.province,
                city_id: data.city_id,
                city: data.city,
                county_id: data.county_id,
                county: data.county
            }
            this.userAddrDetail = data.address;
            this.isDetault = !!data.is_default;
        },
        // 关闭删除弹窗
        cancelFun(){
            this.$nextTick(()=>{
                this.pop = '';
            })
        },
        // 确定删除
        confirmFun(){
            this.editAddr({
                status:0
            })
            this.$nextTick(()=>{
                this.pop = '';
            })
        },
        // 返回
        goBack:function(){
            if(this.addBtn){
                history.back();
            }else{
                this.title = '我的收货地址';
                this.addBtn = true;
            }
            this.clear();
        },
        // 删除收货地址
        delAddr:function(){
            this.pop = popUp;
            this.popTips.type = 2;
            this.popTips.content = '确定要删除该地址吗？';
            const id = this.addrList[this.editIndex].user_address_id;
        },
        // 获取用户的地址列表
        getUserAddrList:function(){
            this.dataService.getUserAddr().then(resp=>{
                this.dataService.handleResponse({
                    data:resp,
                    callback:(data)=>{
                        this.addrList = data;
                    }
                })
            })
        },
        // 添加 按钮 跳转
        toAddNew:function(){
            this.addBtn = false;
            this.title = '添加收货地址';
        },
        // 保存新地址 -- 参数处理
        saveNewAddr:function(){
            const params = {};
            let regTel = /^1\d{10}$/;
            let idCode = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
            if(!this.userName){
                this.pop = popUp;
                this.popTips.type = 1;
                this.popTips.content = '姓名不能为空';
                return;
            }
            if(!this.userTel || !regTel.test(this.userTel)){
                this.pop = popUp;
                this.popTips.type = 1;
                this.popTips.content = '请输入正确的手机号';
                return;
            }
            if(!this.userAddrDetail){
                this.pop = popUp;
                this.popTips.type = 1;
                this.popTips.content = '请输入详细地址';
                return;
            }
            if(this.userCode && !idCode.test(this.userCode)){
                this.pop = popUp;
                this.popTips.type = 1;
                this.popTips.content = '请输入正确的身份证号码';
                return;
            }
            params.real_name = this.realName;
            params.idcard = this.userCode;
            params.consignee = this.userName;
            params.telephone = this.userTel;
            params.province_id = this.addrConcat.province_id;
            params.city_id = this.addrConcat.city_id;
            params.county_id = this.addrConcat.county_id;
            params.address = this.userAddrDetail;
            params.is_default = this.isDetault?'1':'0';
            if(this.isEdit){
                this.editAddr(params);
            }else{
                this.addAddrHttp(params);
            }
        },
        addAddrHttp(params){
            this.dataService.addNewAddr(params).then(resp=>{
                this.dataService.handleResponse({
                    data:resp,
                    callback:(data)=>{
                        this.getUserAddrList();
                        this.clear();
                        this.addBtn = true;
                    }
                })
            })
        },
        // 编辑地址
        editAddr(params){
            const id = this.addrList[this.editIndex].user_address_id;
            params.user_address_id = id
            this.dataService.editUserAddr(params).then(resp=>{
                this.dataService.handleResponse({
                    data:resp,
                    callback:(data)=>{
                        this.getUserAddrList();
                        this.clear();
                        this.addBtn = true;
                    }
                })
            })
        },
        // 设置是否是默认地址
        setDefault:function(){
            this.isDetault = !this.isDetault;
        },
        goConfirm(data){
            let isOrder = this.common.getUrlParam('isOrder');
            if(isOrder){
                localStorage.setItem('address',JSON.stringify(data));
                window.history.go(-1);
            }
        }
    },
    components:{
        popUp,
        selectPopup
    }
}
</script>
<style lang="less">
    @import url('../../less/myAddr.less');
    body{
        background: @background-color;
    }
    
    .container{
        .pxRem(font-size,24);
    }
    .picker-btns{
        position: absolute;
        .pxRem(top,120);
        left: 0;
        width: 100%;
        text-align: center;
    }
    .confirm,.cancel{
        display: inline-block;
        text-align: center;
        vertical-align: middle;
        .pxRem(width,100);
        .pxRem(font-size,28);
    }
    .selectSite{
        .pxRem(font-size,24);
        .pxRem(padding-left,20);
        color: @gray-light-text;
        display: block;
        width: 100%;
    }
</style>

