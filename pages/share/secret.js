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
    data: null, // 分享携带参数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
    this.setData({
      data: options
    });
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
    wx.navigateTo({
      url: '/pages/share/bind?data='+ JSON.stringify(this.data.data),
    })
  }
})