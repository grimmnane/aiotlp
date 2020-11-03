// pages/login/index.js
const app = getApp();
const global = require('../../../utils/global');
const util = require('../../../utils/util');
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';

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
  // login: function(){
  //   if(!this.data.verificationCode){
  //     Toast('请输入验证码');
  //     return;
  //   }
  //   wx.request({
  //     url: global.host + '/user/wxappPhoneLogin',
  //     data: {
  //       code: this.data.verificationCode,
  //       token: app.globalData.token
  //     },
  //     method: 'GET',
  //     success: function(res){
  //       console.log('----login----');
  //       console.log(res);
        
  //       // 登录成功 => 获取用户信息/跳转个人中心
  //       wx.request({
  //         url: global.host + '/user/web-user/getPersonalInfo',
  //         data: {
  //           token: app.globalData.token
  //         },
  //         method: 'GET',
  //         success: function(res){
  //           app.globalData.userInfo = res.data.data.webUser;
  //           wx.switchTab({
  //             url: '/pages/mine/index',
  //           })
  //         },
  //       })        
  //     },
  //     fail: function() {
  //       // fail
  //     }
  //   })
  // },

  login: function(){
    if(!this.data.verificationCode){
      Toast('请输入验证码');
      return;
    }
    util.request('/user/web-user/wxappPhoneLogin',{method:'POST',data:{code: this.data.verificationCode}}).then(res =>{
      global.token = res.data.token;
      wx.setStorage({
        key: "token",
        data: res.data.token
      })
      app.globalData.userInfo = res.data.webUser;
      wx.switchTab({ url: '/pages/index/index'})
      // this.getUserInfo();
 
    })
  },

  getUserInfo(){
    wx.getUserInfo({
      success: function(res) {
        let userInfo = res.userInfo;
        let data = {
          userName: userInfo.nickName,
          sex: userInfo.gender ,
          provinceId: userInfo.province ,
          cityId: userInfo.city
        }
        // util.request('/user/web-user/updatePersonCenter',{method:'POST', data}).then(res =>{
        //   // Toast('')

        // }).catch(data =>{
        //   // Toast('')
        // })
      }
    })
  },


  // 手机号发送验证码
  verify(){
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