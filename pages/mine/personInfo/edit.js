// pages/mine/personInfo/edit.js
const app = getApp();
const global = require('../../../utils/global');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '', // 修改类型
    value: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    options.val = options.val == 'null' ? '' : options.val
    this.setData({
      type: options.type,
      value: options.val
    })
  },

  // 保存
  save: function(){
    let self = this;
    if(self.data.type == 'name'){
      app.globalData.userInfo.name = self.data.value || '';
      wx.navigateTo({
        url: '/pages/mine/personInfo/index',
      })
    }else if(self.data.type == 'phone'){
      app.globalData.userInfo.phone = self.data.value;
      wx.navigateTo({
        url: '/pages/mine/personInfo/index',
      })
    }
  },
  // 取消
  cancel: function(){
    wx.navigateBack({
      delta: 1,
    })
  }

})