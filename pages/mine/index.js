//index.js
const app = getApp();
const global = require('../../utils/global');
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';

Page({
  data: {
    isLogin: false,
    userInfo: null,
  },

  onLoad: function () {
    let that = this;
    if(app.globalData.userInfo){ // 已有用户信息
      that.setData({
        isLogin: true,
        userInfo: app.globalData.userInfo
      })
    }else{ // 请求用户信息
      wx.request({
        url: global.host + '/user/web-user/getPersonalInfo',
        method: 'GET',
        success: function(res){
          // success
          app.globalData.userInfo = res.data.data.userInfo;
          // that.setData({
          //   isLogin: true,
          //   userInfo: app.globalData.userInfo
          // })
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

  // 退出登录
  loginOut(){
    this.setData({
      isLogin: false,
      userInfo: null
    });
    app.globalData.userInfo = null;
    wx.switchTab({
      url: '/pages/mine/index',
    })
  },


  // 开发中
  develop(){
    Toast('敬请期待');
  },

})
