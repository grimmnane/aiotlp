// pages/share/secret.js
const app = getApp();
const global = require('../../utils/global');
const p = require('../../utils/promission.js')
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
const util = require('../../utils/util.js');


Page({
  /**
   * 页面的初始数据
   */
  data: {
    show: true,
    key: null, // 分享key
    isIphoneX:false, // 是不是iphonex
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //  适配分享按钮在 x 机型上的定位问题
    let model = app.globalData.sysInfo.model;
    if(model.indexOf("iPhone X") != -1 ){
      this.setData({
        isIphoneX: true
      });
    }
    
    wx.hideHomeButton();
    this.setData({
      key: options.shareKey || ''
    });
    let p = app.promission(app.login);
    app.globalData.promise = p;
  },

  // popup弹出/隐藏
  showPopup() {
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  },

  // 跳转绑定页
  tobind(){
    wx.setStorageSync('shareKey',this.data.key)
    wx.navigateTo({
      url: '/pages/share/bind',
    })
  }
})