//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js');
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

Page({
  data: {
    list:[
      {
        id:1,
        name:'',
      },
      {
        id:2,
        name:'',
      },
      {
        id:3,
        name:'',
      }
    ],
  },
 
  onLoad(){
    
  },
  onShow() {
    this.getTabBar().setData({ active: 2})
  },
  //事件处理函数
  toDetailPage(opt) {
    let id = opt.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/messageDetail/index?id=' + id
    })
  },

  getList(){
    util.request('',{method:'GET'}).then(res =>{
      let data = res.data || [];
      this.setData({list:data});
    }).catch(data =>{
      Toast(data.message || '操作失败')
    })
  },

})
