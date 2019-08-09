import axios from 'axios';
const baseURL = 'https://dev.shunshiniao.net/';
// const baseURL = 'http://wxtest.shunshiniao.net/';
// sessionStorage.setItem("user-addr",'{"city_id":2389,"city_name":"济南市","lng":117.08297550812875,"lat":36.67221865823566,"token":"f8f3d2dd1439fe90f7cc09f29dfb5041"}');
// sessionStorage.setItem("user-location",'{"city_id":2389,"city_name":"济南市","lng":117.08297550812875,"lat":36.67221865823566,"token":"f8f3d2dd1439fe90f7cc09f29dfb5041"}');
axios.interceptors.request.use((config)=>{
    if(config.url == '/wxapi/region/getUserLocation' && !config.params.lng){
        config.method = 'OPTIONS';
    }
    return config
})

axios.interceptors.response.use((response)=>{
    return response;
})

const getUrlParam = (param='token')=>{
    var reg = new RegExp("(^|&)" + param + "=([^&]*)(&|$)");
    //匹配目标参数
    var url = window.location.search.substr(1).match(reg);
   //返回参数值
    if(url != null)
    return url[2];
    return null;
}
let cache_version = 1;
let get_cache_version = localStorage.getItem("cache_version");
if(cache_version != get_cache_version){
    localStorage.clear();
    localStorage.setItem("cache_version",cache_version);
}
let token = getUrlParam('token');
let user_id = getUrlParam('user_id');
let pid = getUrlParam('pid');
if(token){
    localStorage.setItem('token',token);
}else{
    token = localStorage.getItem('token');
}
if(user_id){
    localStorage.setItem('user_id',user_id);
}
if(pid){
    sessionStorage.setItem('pid',pid);
}
let stoken = localStorage.getItem('stoken');
const config = {
    timeout:5000,
    // 基础路径 目录
    baseURL:baseURL
}
const get = (api='',params={})=>{
    config.method = 'GET';
    config.url = api;
    config.params = params;
    return axios(config)
}
const post = (api,params)=>{
    return axios.post(api,params,config);
}
// params 参数1
/*
params = {
    data:data, // 为promise 对象 then 后的data
    callback:function(){}, // 成功后的回调
    callback1001:function(){}
}
*/
const handleResponse = (params) => {
    const promiseData = params.data.data;
    const handleFn = params.callback;
    const handleFn1001 = params.callback1001;
    const code = Number(promiseData.code);
    const httpData = promiseData.data;
    switch(code){
        case 1000:
            handleFn(httpData);
            break;
        case 2000:
            location.href = baseURL+'/weixin/index/check_user?redirect_url='+encodeURIComponent(location.href);
            // alert('请重新登陆!');
            break;
        case 2001:
            localStorage.setItem('stoken','');
            location.href = './shopLogin.html';
            break;
        case 1001:
            if(handleFn1001 && typeof(handleFn1001) == 'function'){
                handleFn1001(promiseData.msg);
            }else{
                alert(promiseData.msg);
            }
            break;
    }
}

//  获得用户信息
const getUserInfo = (params={}) => {
    params.token = token;
    let api = 'wxapi/user/getUserInfo';
    return get(api,params);
}

// 商品列表
const getProList = (params) => {
    params.token = token;
    let api = '/wxapi/goods/theList';
    return get(api,params);
}
// 获得用户收货地址
const getUserAddr = (params={}) => {
    params.token = token;
    let api = '/wxapi/user/userAddressList';
    return get(api,params)
}
// 添加新的收货地址
const addNewAddr = (params={})=>{
    params.token = token;
    let api = '/wxapi/user/addUserAddress';
    return get(api,params);
}
// 编辑用户地址
const editUserAddr = (params={})=>{
    params.token = token;
    let api = '/wxapi/user/editUserAddress';
    return get(api,params)
}
// 获得省市县列表
const getAreaList = (params={})=>{
    let api = '/wxapi/region/regionList';
    return get(api,params);
}


// 获得用户现在的位置
const getUserNowAddr = (params = {}) => {
    params.token = token;
    let api = '/wxapi/region/getUserLocation';
    return get(api,params)
}
// 获得分类列表
const getClassifyList = (params = {})=>{
    let api = '/wxapi/goods/cateList';
    return get(api,params)
}
const getClassifyFilter = (params = {})=>{
    params.token = token;
    let api = '/wxapi/filter/cateList';
    return get(api,params)
}
// 获取商品详情
const getShopDetail = (params={})=>{
    params.token = token;
    let api = '/wxapi/goods/detail';
    return get(api,params);
}
// 获得收藏列表
const getFavList = (params={})=>{
    params.token = token;
    let api = '/wxapi/user/userFavorList';
    return get(api,params)
}
// 取消收藏
const delMyFav = (params = {})=>{
    params.token = token;
    let api = '/wxapi/user/cancelUserFavor';
    return get(api,params)
}

// 搜索关键字
const searchKey = (params={}) =>{
    params.token = token;
    let api = '/wxapi/goods/searchSug';
    return post(api,params);
}
// 获得浏览记录
const getHistory = (params={})=>{
    params.token = token;
    let api = '/wxapi/user/userViewHis';
    return get(api,params)
}

// 清空浏览记录
const getHistoryDel = (params={})=>{
    params.token = token;
    let api = '/wxapi/user/userViewHisDel';
    return get(api,params)
}

// 创建订单所需要的数据
const createOrderInfo = (params={}) => {
  params.token = token;
  let api = '/wxapi/order/createOrderInfo';
  return post(api,params);
}

// 后选赠品创建订单所需信息
const recreateGiveOrderInfo = (params = {}) => {
  params.token = token;
  let api = '/wxapi/order/recreateGiveOrderInfo';
  return post(api,params)
}

// 创建订单
const createOrder = (params={})=>{
  params.token = token;
  let api = '/wxapi/order/createOrder';
  return post(api,params)
}

// 后选赠品创建订单
const recreateGiveOrder = (params={}) => {
  params.token = token;
  let api = '/wxapi/order/recreateGiveOrder';
  return post(api,params)
}

// 获取商品规格信息
const specInfo = (params={}) => {
  params.token = token;
  let api = '/wxapi/goods/specInfo';
  return get(api,params)
}
// 获得订单列表
const getOrderList = (params = {})=>{
    params.token = token;
    let api = '/wxapi/user/orderList';
    return get(api,params)
}
// del order
const delMyOrder = ((params = {})=>{
    params.token = token;
    let api = '/wxapi/order/cancelOrder';
    return post(api,params);
})
//确认收货
const confirmOrder = (params = {})=>{
    params.token = token;
    let api = '/wxapi/order/confirmOrder';
    return post(api,params)
}

// 吊起支付接口
const pay = (params={}) => {
  let api = 'weixin/pay/pay';
  return get(api,params)
}


// 收藏
const addUserFavor = (params={}) => {
    params.token = token;
  let api = '/wxapi/user/addUserFavor';
  return post(api,params)
}

// 取消收藏
const cancelUserFavor = (params={}) => {
    params.token = token;
  let api = '/wxapi/user/cancelUserFavor';
  return post(api,params)
}

// 获取我的评价订单
const getMyOrderList = (params={})=>{
    params.token = token;
    let api = '/wxapi/user/goodsCommentList';
    return get(api,params);
}

// 获得分类链接
const getShareList = (params={})=>{
    params.token = token;
    let api = '';
    return get(api,params)
}
// 提交评价
const sendAppraise = (params)=>{
    params.append('token',token);
    let api = '/wxapi/order/doComment';
    return post(api,params)
}
// 订单详情
const orderDetails = (params={})=>{
    params.token = token;
    let api = '/wxapi/user/orderDetail';
    return get(api,params)
}

// 获取评论列表
  const goodsCommentList = (params={}) => {
  params.token = token;
  let api = "/wxapi/goods/goodsCommentList";
  return get(api,params);
}
// 提醒发货
const remindDelivery = (params={})=>{
    params.token = token;
    let api = '/wxapi/order/remindDeliver';
    return post(api,params);
}
// 退货 换货 退款 ----- 提交
const applyReturn = (params = {})=>{
    params.token = token;
    let api = '/wxapi/order_refund/applyRefund';
    return post(api,params)
}
//原因
const returnReason = (params = {})=>{
    params.token = token;
    let api = '/wxapi/order_refund/refundReasonList';
    return get(api,params)
}
// 撤销
const cancelReturn = (params = {})=>{
    params.token = token;
    let api = '/wxapi/order_refund/cancelRefund';
    return post(api,params);
}
// 退换货详情
const returnDetails = (params = {})=>{
    params.token = token;
    let api = '/wxapi/order_refund/refundDetail';
    return get(api,params);
}
// 售后列表
const returnList = (params = {})=>{
    params.token = token;
    let api = '/wxapi/order_refund/refundList';
    return get(api,params);
}

// 申请店主
const shopApply = (params = {}) => {
  params.token = token;
  let api = '/wxapi/user/shopApply';
  return post(api,params);
}

// 店铺商品列表
const goodsList = (params = {}) => {
  params.stoken = stoken;
  let api = '/wxapi/shop/goodsList';
  return post(api,params);
}

// 商品删除
const delGoods = (params = {}) => {
  params.stoken = stoken;
  let api = '/wxapi/shop/delGoods';
  return post(api,params);
}

// 获取店铺商品信息
const goodsInfo = (params = {}) => {
  params.stoken = stoken;
  let api = '/wxapi/shop/goodsInfo';
  return post(api,params);
}

// 店铺商品编辑
const editGoods = (params = {}) => {
  params.stoken = stoken;
  let api = '/wxapi/shop/editGoods';
  return post(api,params);
}

// 商品上架下架
const onsaleGoods = (params = {}) => {
  params.stoken = stoken;
  let api = '/wxapi/shop/onsaleGoods';
  return post(api,params);
}

// 店铺商品搜索
const goodsSearch = (params = {}) => {
  params.stoken = stoken;
  let api = '/wxapi/shop/goodsSearch';
  return post(api,params);
}

// 店铺订单列表
const orderList = (params = {}) => {
  params.stoken = stoken;
  let api = '/wxapi/shop/orderList';
  return post(api,params);
}

// 获取店铺信息
const shopInfo = (params = {}) => {
  params.token = token;
  let api = '/wxapi/goods/shopInfo';
  return get(api,params);
}

// 绑定银行卡
const bindBank = (params = {})=>{
    params.stoken = stoken;
    let api = '/wxapi/shop_base/setBankAccount';
    return post(api,params)
}
// 银卡列表
const bankList = (params = {})=>{
    params.stoken = stoken;
    let api = '/wxapi/shop_base/bankList';
    return get(api,params);
}
// 我绑定的银行卡
const getMyBindBank = (params = {})=>{
    params.stoken = stoken;
    let api = '/wxapi/shop_base/bankAccountInfo';
    return post(api,params)
}

// 获取店铺订单详情
const storeOrderDetail = (params = {}) => {
  params.stoken = stoken;
  let api = '/wxapi/shop/orderDetail';
  return post(api,params)
}

// 获取店铺退款订单
const orderRefund = (params = {}) => {
  params.stoken = stoken;
  let api = '/wxapi/shop/orderRefund';
  return post(api,params)
}

// 商家同意退款
const shopRefundOpt = (params = {}) => {
  params.stoken = stoken;
  let api = '/wxapi/shop/shopRefundOpt';
  return post(api,params)
}
// 商家同意换货
const shopBarterOpt = (params = {}) => {
  params.stoken = stoken;
  let api = '/wxapi/shop/shopBarterOpt';
  return post(api,params)
}
// 设置密码
const setPsw = (params = {})=>{
    params.stoken = stoken;
    let api = '/wxapi/shop_base/setCashPwd';
    return post(api,params);
}
// 资产收入--商家
const getIncome = (params = {})=>{
    params.stoken = stoken;
    let api = '/wxapi/finance/financeInfo';
    return get(api,params)
}
//收支明细
const incomeDetails = (params = {})=>{
    params.stoken = stoken;
    let api = '/wxapi/finance/balanceFlow';
    return get(api,params)
}

// 获取商品订单列表 源头
const orderListSource = (params = {}) => {
  params.stoken = stoken;
  let api = '/wxapi/shop/orderListSource';
  return post(api,params)
}

// 获取商铺订单详情
const orderDetailSource = (params = {}) => {
  params.stoken = stoken;
  let api = '/wxapi/shop/orderDetailSource';
  return post(api,params)
}

// 提现记录
const alreadyComeList = (params = {})=>{
    params.stoken = stoken;
    let api = '/wxapi/finance/cashApplyFlow';
    return get(api,params)
}
//结算中
const shopClosing = (params = {})=>{
    params.stoken = stoken;
    let api = '/wxapi/finance/settlingFlow';
    return get(api,params);
}

//提现明细详情
const shopComeAlreadyDetails = (params = {})=>{
    params.stoken = stoken;
    let api = '/wxapi/finance/cashApplyFlowDetail';
    return get(api,params)
}
// 申请提现
const cashApply = (params={})=>{
    params.stoken = stoken;
    let api = '/wxapi/finance/cashApply';
    return post (api,params)
}

// 订单发货详情
const orderShipInfo = (params = {}) => {
  params.stoken = stoken;
  let api = '/wxapi/shop/orderShipInfo';
  return post(api,params)
}

// 提交发货
const orderShipOpt = (params = {}) => {
  params.stoken = stoken;
  let api = '/wxapi/shop/orderShipOpt';
  return post(api,params)
}

// 修改物流
const orderShipEdit = (params = {}) => {
    params.stoken = stoken;
    let api = '/wxapi/shop/orderShipEdit';
    return post(api,params)
}

// 获取快递公司
const shippingList = (params = {}) => {
  params.stoken = stoken;
  let api = '/wxapi/shop/shippingList';
  return post(api,params)
} 
// 自动识别快递公司
const orderShipNumAutoCheck = (params = {}) => {
    params.stoken = stoken;
    let api = '/wxapi/shop/orderShipNumAutoCheck';
    return post(api,params)
  } 
// 物流信息
const getExpress = (params={})=>{
    params.token = token;
    let api = '/wxapi/order/expressInfo';
    return get(api,params)
}
// 获得手机验证码
const getMobileCode = (params = {})=>{
    let api = '/wxapi/shop_base/sendLoginCode';
    return post(api,params)
}
// 登陆
const login = (params = {})=>{
    params.token = token;
    let api = '/wxapi/shop_base/doLogin';
    return post (api,params)
}

// 设置密码
const setLoginPsw = (params = {})=>{
    params.stoken = stoken;
    let api = '/wxapi/shop_base/setPwd';
    return post(api,params);
}
// 获得商家信息
const getShopInfo = (params={})=>{
    params.stoken = stoken;
    let api = '/wxapi/shop/shopInfo';
    return post(api,params)
}

// 获取微信配置
const get_wxconfig = async (params = {}) => {
  let api = '/wxapi/user/get_wxconfig';
  return post(api,params)
}

// 核销页面
const checkOrderInfo = (params = {}) => {
  params.stoken = stoken;
  let api = '/wxapi/shop/checkOrderInfo';
  return get(api,params)
}

// 确认核销
const doCheckOrderCode = (params = {}) => {
  params.stoken = stoken;
  let api = '/wxapi/shop/doCheckOrderCode';
  return post(api,params)
}
// 超级店铺创建订单
const superShopCreateOrder = (params = {})=>{
    params.token = token;
    let api = '/wxapi/order/createSuperShopOrder';
    return post(api,params)
}

// 获取用户推广二维码
const userTicket = (params = {})=>{
  params.token = token;
  let api = '/wxapi/user/userTicket';
  return get(api,params)
}

const myMembers = (params = {})=>{
  params.token = token;
  let api = '/wxapi/user/myMembers';
  return get(api,params)
}

const userVtel = (params = {})=>{
    params.token = token;
    let api = '/wxapi/goods/shopTel';
    get(api,params).then(resp=>{
        handleResponse({
            data:resp,
            callback:(data)=>{
                location.href = 'tel:'+data.tel;
            }
        })
    })
}

// 获取商圈店铺
const shopList = (params = {}) => {
    params.token = token;
    let api = '/wxapi/areaer/shopList';
    return get(api,params)
}

// 获取商圈店铺信息
const areaerShopDetail = (params = {}) => {
    params.token = token;
    let api = '/wxapi/areaer/shopDetail';
    return get(api,params)
}

// 圈主管理店铺
const shopMng = (params = {}) => {
    params.token = token;
    let api = '/wxapi/areaer/shopMng';
    return get(api,params)
}

// 获取圈主商家营业额
const shopSalesFlow = (params = {}) => {
    params.token = token;
    let api = '/wxapi/areaer/shopSalesFlow';
    return get(api,params)
}

// 获取圈主资产详情
const areaerFinanceInfo = (params = {}) => {
    params.token = token;
    let api = '/wxapi/areaer/financeInfo';
    return get(api,params)
}

// 获取圈主收支明细
const areaerBalanceFlow = (params = {}) => {
    params.token = token;
    let api = '/wxapi/areaer/balanceFlow';
    return get(api,params)
}

// 设置圈主提现密码
const areaerSetCashPwd = (params = {}) => {
    params.token = token;
    let api = '/wxapi/areaer/setCashPwd';
    return get(api,params)
}

// 设置圈主提现银行账户
const areaerSetBankAccount = (params = {}) => {
    params.token = token;
    let api = '/wxapi/areaer/setBankAccount';
    return get(api,params)
}

// 获取圈主提现银行账户信息
const areaerBankAccountInfo = (params = {}) => {
    params.token = token;
    let api = '/wxapi/areaer/bankAccountInfo';
    return get(api,params)
}

// 提现记录
const areaerCashApplyFlow = (params = {}) => {
    params.token = token;
    let api = '/wxapi/areaer/cashApplyFlow';
    return get(api,params)
}

// 提现记录详情
const areaerCashApplyFlowDetail = (params = {}) => {
    params.token = token;
    let api = '/wxapi/areaer/cashApplyFlowDetail';
    return get(api,params)
}

// 圈主提现
const areaerCashApply = (params = {}) => {
    params.token = token;
    let api = '/wxapi/areaer/cashApply';
    return get(api,params)
}

// 发送短信验证码
const sendVerifyCode = (params = {}) => {
    params.token = token;
    let api = '/wxapi/user/sendVerifyCode';
    return post(api,params)
}

// 绑定手机号
const bindMobile = (params = {}) => {
    params.token = token;
    let api = '/wxapi/user/bindMobile';
    return post(api,params)
}

//获得城市联盟的列表
const getCityConcatList = (params = {}) => {
    params.token = token;
    let api = '/wxapi/city_activity/citys_union_list';
    return get(api,params)
}
// 城市联盟详情
const getCityConcatDetails = (params = {}) => {
    params.token = token;
    let api = '/wxapi/city_activity/citys_union_cont';
    return get(api,params);
}
// 城市联盟 提交
const cityConcatSubmit = (params = {})=>{
    params.token = token;
    let api = '/wxapi/city_activity/activity_join';
    return get(api,params);
}
// 城市联盟获得是否关注了公众号
const isFollow = (params = {})=>{
    params.token = token;
    let api = '/wxapi/city_activity/check_subscribe';
    return get(api,params);
}
/******** 招商合作相关 **********/
// 招商合作图文详情
const bizInfo = (params = {}) => {
    params.token = token;
    let api = '/wxapi/hire/bizInfo';
    return get(api,params);
}
// 招商合作申请
const bizApply = (params = {}) => {
    params.token = token;
    let api = '/wxapi/hire/bizApply';
    return post(api,params);
}
// 招商合作申请详情
const bizApplyDetail = (params = {}) => {
    params.token = token;
    let api = '/wxapi/hire/bizApplyDetail';
    return post(api,params);
}
// 招聘岗位列表
const jobList = (params = {}) => {
    params.token = token;
    let api = '/wxapi/hire/jobList';
    return post(api,params);
}
// 招聘岗位图文详情
const jobDetail = (params = {}) => {
    params.token = token;
    let api = '/wxapi/hire/jobDetail';
    return post(api,params);
}
// 招聘岗位申请
const jobApply = (params = {}) => {
    params.token = token;
    let api = '/wxapi/hire/jobApply';
    return post(api,params);
}
// 招聘岗位申请详情
const jobApplyDetail = (params = {}) => {
    params.token = token;
    let api = '/wxapi/hire/jobApplyDetail';
    return post(api,params);
}

/******** 活动 **********/
// 超级抽奖报名
const bigLotteryApply = (params = {}) => {
    params.token = token;
    let api = '/wxapi/activity/bigLotteryApply';
    return post(api,params)
}
// 超级抽奖信息
const bigLotteryInfo = (params = {}) => {
    params.token = token;
    let api = '/wxapi/activity/bigLotteryInfo';
    return get(api,params)
}
// 新人专享
const newerOrderFlow = (params = {}) => {
    params.token = token;
    let api = '/wxapi/activity/newerOrderFlow';
    return get(api,params)
}
// 每日抽奖信息
const dailyLotteryInfo = (params = {}) => {
    params.token = token;
    let api = '/wxapi/activity/dailyLotteryInfo';
    return get(api,params)
}
// 每日抽奖
const dailyLotteryDo = (params = {}) => {
    params.token = token;
    let api = '/wxapi/activity/dailyLotteryDo';
    return post(api,params)
}
// 用户中奖记录
const dailyLotteryFlow = (params = {}) => {
    params.token = token;
    let api = '/wxapi/activity/dailyLotteryFlow';
    return get(api,params)
}
// 用户中奖记录详情
const dailyLotteryDetail = (params = {}) => {
    params.token = token;
    let api = '/wxapi/activity/dailyLotteryDetail';
    return get(api,params)
}
// 用户虚拟电话
const userTel = (params = {}) => {
    params.stoken = stoken;
    let api = '/wxapi/shop/userTel';
    return post(api,params)
}

// 获取赠品是否可选
const checkList = (params = {}) => {
    params.token = token;
    let api = '/wxapi/goods/checkList';
    return get(api,params)
}
// 筛选获得距离
const getDistanceList = (params = {})=>{
    params.token = token;
    let api = '/wxapi/filter/regionList'
    return get(api,params)
}
// 筛选获得本地分类
const getTagList = (params = {}) => {
    params.token = token;
    let api =  '/wxapi/filter/tagList';
    return get(api,params)
}
const getBrandList = (params = {})=>{
    params.token = token;
    let api = '/wxapi/filter/brandList';
    return get(api,params);
}

// 获取是否可以选为赠品
const checkBuy = (params = {}) => {
    params.token = token;
    let api = '/wxapi/order/checkBuy';
    return get(api,params)
}

const getBindWechatInfo = (params = {})=>{
    params.stoken = stoken;
    let api = '/wxapi/finance/getBindWxInfo';
    return get(api,params)
}
const getNewOrderInfo = (params = {})=>{
    params.token = token;
    let api = '/wxapi/order/lastOrderInfo';
    return get(api,params)
}

const getCityList = (params = {})=>{
    let api = '/wxapi/region/cityList';
    return get(api,params)
}

// 血本卖我的收益
const myIncome = (params = {}) => {
    params.token = token;
    let api = '/wxapi/user/myIncome';
    return get(api,params)
}

// 新手指引
const newGuidelines = (params ={}) => {
    params.token = token;
    let api = '/wxapi/user/isFristOpen';
    return post(api,params)
}

// 分享赚列表
const shareOrderList = (params = {}) => {
    params.token = token;
    let api = '/wxapi/share_order/theList';
    return get(api,params)
}
// 分享赚创建订单信息
const shareCreateOrderInfo = (params = {}) => {
    params.token = token;
    let api = '/wxapi/share_order/createOrderInfo';
    return get(api,params)
}
// 分享赚创建订单
const shareCreateOrder = (params = {}) => {
    params.token = token;
    let api = '/wxapi/share_order/createOrder';
    return get(api,params)
}
// 用户不同状态订单数统计
const orderCount = (params = {}) => {
    params.token = token;
    let api = '/wxapi/user/orderCount';
    return get(api,params)
}
// 获取用户员工号下的粉丝及推广码
const workerMembers = (params = {}) => {
    params.token = token;
    let api = '/wxapi/user/workerMembers';
    return get(api,params)
}
// 获取用户信息
const getUserInfoLocal = ()=>{
    const user = sessionStorage.getItem('user-info');
    if(!user){
        getUserInfo().then((resp)=>{
            handleResponse({
                data:resp,
                callback:(data)=>{
                    sessionStorage.setItem('user-info',JSON.stringify(data));
                }
            })
        });
    }
}
getUserInfoLocal();
export default{
    baseURL,
    get,
    post,
    handleResponse,
    getUserInfo,
    getProList,
    getUserAddr,
    addNewAddr,
    editUserAddr,
    getUserNowAddr,
    getClassifyList,
    getClassifyFilter,
    getShopDetail,
    getAreaList,
    getFavList,
    delMyFav,
    searchKey,
    getHistory,
    getHistoryDel,
    createOrder,
    createOrderInfo,
    getOrderList,
    delMyOrder,
    confirmOrder,
    specInfo,
    pay,
    addUserFavor,
    cancelUserFavor,
    getMyOrderList,
    getShareList,
    sendAppraise,
    orderDetails,
    goodsCommentList,
    remindDelivery,
    applyReturn,
    returnReason,
    cancelReturn,
    returnDetails,
    returnList,
    shopApply,
    goodsList,
    delGoods,
    goodsInfo,
    editGoods,
    onsaleGoods,
    goodsSearch,
    orderList,
    shopInfo,
    bindBank,
    bankList,
    getMyBindBank,
    storeOrderDetail,
    orderRefund,
    shopRefundOpt,
    shopBarterOpt,
    setPsw,
    getIncome,
    incomeDetails,
    orderListSource,
    orderDetailSource,
    alreadyComeList,
    shopClosing,
    shopComeAlreadyDetails,
    cashApply,
    orderShipInfo,
    orderShipOpt,
    orderShipEdit,
    shippingList,
    orderShipNumAutoCheck,
    getExpress,
    getMobileCode,
    login,
    setLoginPsw,
    getShopInfo,
    get_wxconfig,
    checkOrderInfo,
    doCheckOrderCode,
    recreateGiveOrderInfo,
    recreateGiveOrder,
    superShopCreateOrder,
    userTicket,
    myMembers,
    userVtel,
    shopList,
    areaerFinanceInfo,
    areaerShopDetail,
    shopMng,
    shopSalesFlow,
    areaerSetCashPwd,
    areaerSetBankAccount,
    areaerBankAccountInfo,
    areaerBalanceFlow,
    areaerCashApplyFlow,
    areaerCashApplyFlowDetail,
    areaerCashApply,
    sendVerifyCode,
    bindMobile,
    bigLotteryApply,
    bigLotteryInfo,
    newerOrderFlow,
    dailyLotteryInfo,
    dailyLotteryFlow,
    getCityConcatList,
    getCityConcatDetails,
    cityConcatSubmit,
    isFollow,
    dailyLotteryDo,
    dailyLotteryDetail,
    bizInfo,
    bizApply,
    bizApplyDetail,
    jobList,
    jobDetail,
    jobApply,
    jobApplyDetail,
    userTel,
    checkList,
    getDistanceList,
    getTagList,
    getBrandList,
    checkBuy,
    getBindWechatInfo,
    getNewOrderInfo,
    getCityList,
    myIncome,
    newGuidelines,
    shareOrderList,
    shareCreateOrderInfo,
    shareCreateOrder,
    orderCount,
    workerMembers,
}

