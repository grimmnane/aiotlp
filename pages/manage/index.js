//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
 
  onLoad: function () {
    
  },

  toUpdatePage(){
    wx.navigateTo({
      url: '/pages/updateManage/index?id=1',
    })
  }
 
})
