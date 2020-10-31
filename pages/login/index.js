// pages/login/index.js
const app = getApp();
const global = require('../../utils/global');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone_number: '', // 手机号
    checked: true, // 条款 - 复选框
    verificationCode: '' // 验证码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },


  // 勾选同意条款复选框
  onChange: function(event){
    this.setData({
      checked: event.detail,
    });
  },

  // 跳转条款页
  showProtocol: function(){
    wx.navigateTo({
      url: '/pages/mine/protocol/index',
    })
  },

  // 登录
  login: function(){
    wx.request({
      url: global.host + 'user/wxappPhoneLogin',
      data: {
        code: this.data.verificationCode,
        token: app.globalData.token
      },
      method: 'GET',
      success: function(res){
        console.log('----login----');
        console.log(res);
      },
      fail: function() {
        // fail
      }
    })
  },

  // 手机号发送验证码
  verify: function(){
    wx.request({
      url: global.host + 'user/web-user/wxappSendLoginCode',
      data: {
        phone: this.data.phone_number,
        token: app.globalData.token
      },
      method: 'GET',
      success: function(res){
        console.log('----verify----');
        console.log(res);
        this.setData({
          verificationCode: res.data.data
        });
      },
      fail: function() {
        // fail
      }
    })
  }
})