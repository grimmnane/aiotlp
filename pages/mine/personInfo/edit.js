// pages/mine/personInfo/edit.js
const app = getApp();
const global = require('../../../utils/global');
const util = require('../../../utils/util');


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
      let data = {
        userName: self.data.value,
      };
      util.request('/user/web-user/updatePersonCenter',{method:'POST', data}).then(res =>{
        let data = res.data;
        app.globalData.userInfo = data.webUser;
        wx.navigateBack({
          delta: 1,
        })
      }).catch(data =>{})

      // app.globalData.userInfo.nickName = self.data.value;
      // wx.navigateTo({
      //   url: '/pages/mine/personInfo/index',
      // })
    }
    // else if(self.data.type == 'phone'){
    //   app.globalData.userInfo.phone = self.data.value;
    //   wx.navigateTo({
    //     url: '/pages/mine/personInfo/index',
    //   })
    // }
  },
  // 取消
  cancel: function(){
    wx.navigateBack({
      delta: 1,
    })
  }

})