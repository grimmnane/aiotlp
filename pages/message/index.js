//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js');
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

Page({
  data: {
    list:[],
    pagination:{
      pageSize:20,
      pageNum:1,
      isLastPage:false
    }
  },
 
  onLoad(){
    
  },
  onShow() {
    this.getTabBar().setData({ active: 2});
    this.getList();
  },

  onPullDownRefresh(){
    
  },

  getList(){
    let params = {
      pageNum: this.data.pagination.pageNum,
      pageSize: this.data.pagination.pageSize,
    }
    util.request('/message/web-message/getUsrMessage',{method:'GET',data:params}).then(res =>{
      if(!this.data.pagination.isLastPage){
        let data = this.data.list.concat(this.setItem(res.data.rows || []));
        this.setData({list:data});
      }
      this.data.pagination.isLastPage = res.data.current < res.data.pages ? false : true;
      
    }).catch(data =>{
      Toast(data.message || '操作失败')
    })
  },

  setItem(list){
    return list.map(item =>{
      item.date = item['时间'];
      item.type = item['消息类型'];
      item.title = item['消息标题'];
      item.id = item['ID'];

    })
  
  },

  toDetailPage(opt) {
    let id = opt.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/messageDetail/index?id=' + id
    })
  },
  

})
