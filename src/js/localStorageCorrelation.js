import commons from './common'
// 获取localStorage
const getLocalStorage = (that) => {
  var ssn_shopGroup = JSON.parse(localStorage.getItem('ssn_shopGroup'));
  if(!ssn_shopGroup) {
    ssn_shopGroup = {
      mainShop: {},
      presentList: [],
    }
  }else if(!ssn_shopGroup.mainShop){
    ssn_shopGroup.mainShop = {};
  }else if(!ssn_shopGroup.presentList){
    ssn_shopGroup.presentList = [];
  }
  that.$store.commit("ssn_shopGroup",ssn_shopGroup);
  that.commonData.isMain = JSON.stringify(that.commonData.ssn_shopGroup.mainShop) != "{}"?true:false
}

// 设置localStorage
const setLocalStorage = (that) => {
  console.log(that.commonData.ssn_shopGroup)
  localStorage.setItem("ssn_shopGroup",JSON.stringify(that.commonData.ssn_shopGroup))
}
// 取消赠品选择
const cancelSelect = (that,id) => {
  that.ssn_shopGroup.presentList.forEach(function(item,index){
    if(item.goods_id == id){
      that.ssn_shopGroup.presentList.splice(index,1);
    }
  })
  setLocalStorage(that);
};

// 显示提示框
const openPopUp = (that,popup) => {
  that.commonData.popupType = 1;
  that.commonData.isPopUp = true;
  that.commonData.popupContent = popup.popupContent;
  that.commonData.popupTime = popup.popupTime?popup.popupTime:that.commonData.popupTime
}

const common = {
  getLocalStorage,
  setLocalStorage,
  openPopUp,
  cancelSelect
}

export default common
