(function(){
    var isPageHide = false;
    window.addEventListener('pageshow', function () {
        if (isPageHide) {
            window.location.reload();
        }
    });
    window.addEventListener('pagehide', function () {
        isPageHide = true;
    });
}());
import wxconfig from './wxConfig.js'
import wx from 'weixin-js-sdk';
import userAddress from './location'

Date.prototype.Format = function(fmt)
{
  var o = {
    "M+" : this.getMonth()+1,                 //月份
    "d+" : this.getDate(),                    //日
    "h+" : this.getHours(),                   //小时
    "m+" : this.getMinutes(),                 //分
    "s+" : this.getSeconds(),                 //秒
    "q+" : Math.floor((this.getMonth()+3)/3), //季度
    "S"  : this.getMilliseconds()             //毫秒
  };
  if(/(y+)/.test(fmt))
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
  for(var k in o)
    if(new RegExp("("+ k +")").test(fmt))
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
  return fmt;
}
const setPxRem = (doc=document, win=window)=>{
    var docEl = doc.documentElement,
    resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
    recalc = function () {
      var clientWidth = docEl.clientWidth;
      if(clientWidth>720) clientWidth=720;
      if (!clientWidth) return;
      docEl.setAttribute("style","font-size: "+Math.floor(clientWidth/10)+"px !important");
    };
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
}

const getUrlParam = (param='token')=>{
    var reg = new RegExp("(^|&)" + param + "=([^&]*)(&|$)");
    //匹配目标参数
    var url = window.location.search.substr(1).match(reg);
   //返回参数值
    if(url != null)
    return url[2];
    return null;
}

const toFixed = (num)=>{
    if(!num){
        num = 0;
    }else{
        num = Number(num);
    }
    return num.toFixed(2);
}

const goBack = (callback) => {
    window.addEventListener("popstate", function(e) {
        callback();
    }, false);
    var state = {
        title: "title",
        url: ""
    };
    window.history.pushState(state, "title", "");
}
// 拼接url
const initUrl = (url,param = {})=>{
    for([key,value] of Object.entries(param)){
        let reg = new RegExp('('+key+'=)\\w+','gi');
        if(url.search(reg)>=0){
            url = url.replace(reg,key+'='+value)
        }else{
            let hash = '',
            symbol = '?';
            if(url.includes('#')){
                hash = url.slice(url.indexOf('#'),url.length);
                url = url.slice(0,url.indexOf('#'));
            }
            symbol = url.includes('?') ? '&' : '?';
            url = url + symbol + key + '=' + value + hash;
        }
    }
    return url;
}

const shareFun = (title,desc,imgUrl,url) => {
    wxconfig();
    let link = location.href;
    if(url){
        link = url;
    }
    link = initUrl(link,{
      pid:localStorage.getItem('user_id'),
      user_id:'',
      token:''
    })
    wx.ready(function () {      //需在用户可能点击分享按钮前就先调用
        if(wx.onMenuShareTimeline){
            wx.onMenuShareTimeline({
            title: title, // 分享标题
            link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: imgUrl, // 分享图标
            success: function () {
                // 用户点击了分享后执行的回调函数
            }
            });
        }
        if(wx.onMenuShareAppMessage){
            wx.onMenuShareAppMessage({
            title: title, // 分享标题
            desc:  desc, // 分享描述
            link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: imgUrl, // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {
                // 用户点击了分享后执行的回调函数
            }
            });
        }
        if(wx.updateAppMessageShareData){
            wx.updateAppMessageShareData({
            title: title, // 分享标题
            desc:  desc, // 分享描述
            link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: imgUrl, // 分享图标
            success: function () {
                // 设置成功
            }
            });
        }
        if(wx.updateTimelineShareData){
            wx.updateTimelineShareData({
            title: title, // 分享标题
            desc:  desc, // 分享描述
            link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: imgUrl, // 分享图标
            success: function () {
                // 设置成功

            }
            });
        }
    });
}

const share = () =>{
    let path = location.pathname;
    let pathArr = [
        '/sourceShopDetails.html',
        '/activityLine.html',
        '/activityLocal.html',
        '/jjk.html',
        '/awardActivity.html',
        '/cityConcat.html',
        '/cityConcatDetails.html',
    ];
    if(pathArr.includes(path)){
        return;
    }
    let url = location.origin;
    let title = '顺势鸟商城',
    // des = '买A赠B，100元当1000元花（一个自购物+自创业的工具）',
    des = '顺势鸟是一个买一送多，还不多花钱的商城。',
    imgUrl = url+'/static/img/storeLogo.png';
    shareFun(title,des,imgUrl);
}

setTimeout(() => {
    share();
}, 100);
userAddress();
const common = {
    setPxRem,
    getUrlParam,
    toFixed,
    goBack,
    shareFun
}

export default common
