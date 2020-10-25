//index.js
const app = getApp()
const global = require('../../utils/global');

Page({
  data: {
    isLogin: false,
    userInfo: null
  },

  onLoad: function () {
    if(global.userInfo){
      this.setData({
        isLogin: true,
        userInfo: global.userInfo
      })
    }
  },

  onShow() {
		this.getTabBar().init();
  },

  // 登录
  login(){
    wx.redirectTo({
      url: '/pages/login/index',
    })
  },

  // 修改资料
  personInfo(){
    wx.redirectTo({
      url: '/pages/mine/personInfo/index',
    })
  }


})
