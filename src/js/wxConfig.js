import dataService from './dataService';
import wx from 'weixin-js-sdk';
async function wxconfig(){
    let targetUrl = location.href;
    let config = await dataService.get_wxconfig({url: targetUrl});
    let { data } = config;
    if(data.code == 1000){
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: data.data.appId, // 必填，公众号的唯一标识
            timestamp: data.data.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.data.nonceStr, // 必填，生成签名的随机串
            signature: data.data.signature,// 必填，签名
            jsApiList: ['scanQRCode','getLocation','updateTimelineShareData','updateAppMessageShareData','onMenuShareTimeline','onMenuShareAppMessage'] // 必填，需要使用的JS接口列表
        });
        return;
    }else{
        return false;
    }
}
export default wxconfig   

