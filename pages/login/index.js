// pages/login/index.js
const app = getApp();
const global = require('../../utils/global');
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';

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
    if(!this.data.verificationCode){
      Toast('请输入验证码');
      return;
    }
    wx.request({
      url: global.host + '/user/wxappPhoneLogin',
      data: {
        code: this.data.verificationCode,
        token: app.globalData.token
      },
      method: 'GET',
      success: function(res){
        console.log('----login----');
        console.log(res);
        
        // 登录成功 => 获取用户信息/跳转个人中心
        wx.request({
          url: global.host + '/user/web-user/getPersonalInfo',
          data: {
            token: app.globalData.token
          },
          method: 'GET',
          success: function(res){
            app.globalData.userInfo = res.data.data.webUser;
            wx.switchTab({
              url: '/pages/mine/index',
            })
          },
        })        
      },
      fail: function() {
        // fail
      }
    })
  },

  // 手机号发送验证码
  verify: function(){
    if(!this.checkPhone(this.data.phone_number)){
      Toast('手机号有误，请检查手机号');
      return;
    }
    wx.request({
      url: global.host + '/user/web-user/wxappSendLoginCode',
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
  },

  // 校验手机号
  checkPhone: function (phone) {
    if (/^1(3|4|5|7|8)\d{9}$/.test(phone)) {
      return true;
    } else {
      return false;
    }
  },



})