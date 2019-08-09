/**
 * 自定义回退事件
 */
const history =  {
    max:3,// 最大存储数量
    session_name:JSON.parse(sessionStorage.getItem('historyGroup')) || [],
    pathname:'',
    //数据存储区
    data:{
        scrollY:0,  //离开时的高度
        maxScroll:0,
        items:{},//存放的数据
        screen:{}  // 筛选条件的存储
    },
    reloadFn:null,
    //hashcode 编码
    hashCode(str){
      let hash = 0,char = '';
      if (str.length == 0) return hash;
      for (let i = 0; i < str.length; i++) {
        char = str.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash;
      }
      return hash;
    },
    //保存服务器请求,data是服务器返回的数据
    setItem(key,data){
      sessionStorage.setItem( key , JSON.stringify(data));
    },
    saveData(module,scrollY,maxScroll){ // module  vue实例
        let needDel = [];
        this.data.scrollY = scrollY;
        this.data.maxScroll = maxScroll;
        this.data.items = module.$data;
        this.data.screen = module.$refs.screenNew ? module.$refs.screenNew.$data : {}
        if(this.session_name.includes(this.pathname)){
            this.session_name.splice(this.session_name.indexOf(this.pathname), 1);
        }
        this.session_name.push(this.pathname);
        if(this.session_name.length>this.max){
            needDel = this.session_name.slice(0,this.session_name.length - this.max)
            this.session_name = this.session_name.slice(this.session_name.length - this.max)
        }
        for(let i=0;i<needDel.length;i++){
            sessionStorage.removeItem(needDel[i]);
        }
        this.setItem('historyGroup',this.session_name);
        this.setItem(this.pathname,this.data);
    },
    getData(){
        if(this.session_name.includes(this.pathname)){
            let data = JSON.parse(sessionStorage.getItem(this.pathname))
            return data;
        }else{
            return null;
        }
    },
    clearData(){
        if(this.session_name.includes(this.pathname)){
            this.session_name.splice(this.session_name.indexOf(this.pathname), 1);
            this.setItem('historyGroup',this.session_name);
        }
        sessionStorage.removeItem(this.pathname)
    },
    init(module){
        this.pathname = this.hashCode(window.location.href);
        module.$eventBus.$on('goDetails',()=>{
            this.pathname = this.hashCode(window.location.href);
            let scrollY = 0,maxScroll = 0;
            try {
                scrollY = module.$refs.scroll.scroll.y;
                maxScroll = module.$refs.scroll.scroll.maxScrollY
            } catch (error) {
                scrollY = 0;
                maxScroll = 0;
            }
            this.saveData(module,scrollY,maxScroll);
        })
    }
}
export default history
