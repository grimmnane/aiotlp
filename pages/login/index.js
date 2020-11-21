// pages/login/warrant/index.js
const app = getApp();
const global = require('../../utils/global');
const util = require('../../utils/util.js');
const p = require('../../utils/promission.js')
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  onLoad: function (options) {
    wx.hideHomeButton();
  },


  // 微信快捷登陆
  getUserInfo(){
    wx.getSetting({
      success (res){
        if (res.authSetting['scope.userInfo']){
          wx.navigateTo({url: "/pages/login/login/index"});
        }
      },
      fail(res){
      }
    })
  },
 
  // 手机登陆
  phoneLogin(){
    wx.navigateTo({
      url: '/pages/login/login/index',
    })
  }
})