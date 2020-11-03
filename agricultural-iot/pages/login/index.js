// pages/login/warrant/index.js
const app = getApp();
const global = require('../../utils/global');
const util = require('../../utils/util.js');
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  onLoad: function (options) {

  },

  getUserInfo(){
    wx.getSetting({
      success (res){
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              // 保存用户信息
              let userInfo = res.userInfo;
              let data = {
                userName: userInfo.nickName,
                sex: userInfo.gender ,
                provinceId: userInfo.province ,
                cityId: userInfo.city
              }
              util.request('/user/web-user/updatePersonCenter',{method:'POST', data}).then(res =>{
                // Toast('')
              }).catch(data =>{
                // Toast('')
              })
            }
          })
        }
      }
    }).catch(data =>{
      Toast(data.message)
    })
  },
 

  login(){
    wx.navigateTo({
      url: '/pages/login/login/index',
    })
  }
})