// pages/login/index.js
const app = getApp();
const global = require('../../utils/global');
const util = require('../../utils/util.js');
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
    util.request('/user/web-user/wxappPhoneLogin',{method:'POST',data:{code: this.data.verificationCode}}).then(res =>{
      global.token = res.data.token;
      app.globalData.userInfo = res.data.webUser;
      if(res.data.webUser && JSON.stringify(res.data.webUser) != '{}'){
        wx.switchTab({ url: '/pages/mine/index'})
      }
    }).catch(data =>{
      Toast(data.message)
    })
  },

  // 手机号发送验证码
  verify: function(){
    if(!this.checkPhone(this.data.phone_number)){
      Toast('手机号有误，请检查手机号');
      return;
    }
    util.request('/user/web-user/wxappSendLoginCode',{method:'GET',data:{phone: this.data.phone_number}}).then(res =>{
      this.setData({ verificationCode: res.data.code || '123456'});
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