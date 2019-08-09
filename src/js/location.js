import wx from 'weixin-js-sdk';
import dataService from './dataService';
import  wxconfig  from './wxConfig.js'
const x_PI = 3.14159265358979324 * 3000.0 / 180.0;
const gcj02tobd09 = (lng, lat)=>{
    var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
    var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
    var bd_lng = z * Math.cos(theta) + 0.0065;
    var bd_lat = z * Math.sin(theta) + 0.006;
    return [bd_lng, bd_lat]
}
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
const userAddress = ()=>{
    var btn = false;
    let userAddr = sessionStorage.getItem('user-addr') ? JSON.parse(sessionStorage.getItem('user-addr')) : {};
    if(!userAddr.lng && !userAddr.lat){
        wxconfig();
        wx.ready(function(){
            if(!btn){
                btn = true
            }else{
                return;
            }
            wx.getLocation({
                type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                success: (res)=> {
                    var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                    var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                    let lng = gcj02tobd09(longitude,latitude)[0];
                    let lat = gcj02tobd09(longitude,latitude)[1];
                    let address  = {
                        lng,
                        lat
                    }
                    dataService.getUserNowAddr(address).then(resp=>{
                        dataService.handleResponse({
                            data:resp,
                            callback:(data)=>{
                                let obj = Object.assign({},data,address)
                                sessionStorage.setItem('user-addr',JSON.stringify(obj));
                                sessionStorage.setItem('user-location',JSON.stringify(obj));
                                let isFirst = sessionStorage.getItem('localFirst');
                                if(location.href.includes('localService.html') && !isFirst && !obj.city_name.includes('济南')){
                                    location.href = './index.html';
                                }else{
                                    // 微信屏蔽 window.location.reload 方法                                
                                    let href = initUrl(window.location.href,{'t_reload':new Date().getTime()});
                                    window.location.href = href;
                                }
                            }
                        })
                    })
                },
                fail:(err)=>{
                    window.close();
                    console.log('wx getlocation fail')
                    console.log('address error:'+JSON.stringify(err))
                }
            });
        })
    }
}
export default userAddress