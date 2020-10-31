//index.js
const app = getApp()
const global = require('../../utils/global');
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';

Page({
  data: {
    isLogin: false,
    userInfo: null
  },

  onLoad: function () {
    if(app.globalData.userInfo){
      this.setData({
        isLogin: true,
        userInfo: app.globalData.userInfo
      })
    }else{
      wx.request({
        url: global.host + 'user/web-user/getPersonalInfo',
        data: {
          token: app.globalData.token
        },
        method: 'GET',
        success: function(res){
          // success
          console.log(res);
        },
        fail: function() {
          // fail
        }
      })
    }
  },

  onShow() {
    this.getTabBar().setData({ active: 3})
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
  },



  // 开发中
  develop(){
    Toast('敬请期待');
  },
})
