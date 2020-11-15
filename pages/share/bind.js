// pages/share/bind.js
const app = getApp()
const p = require('../../utils/promission')
const util = require('../../utils/util.js');
const { default: toast } = require('../../miniprogram_npm/@vant/weapp/toast/toast');
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    shareKey: null, // 分享携带数据
    name:'', // 昵称
    deviceNames:'' , // 传过来的传感器名称
    show: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    Toast.loading({
      duration:0,
      forbidClick: true,
    });
    wx.hideHomeButton();
    app.globalData.promise = app.promission(app.login);
    app.globalData.promise.then(()=>{
      this.setData({show:false})
      Toast.clear();
    }).catch(()=>{
      this.setData({show:true})
      Toast.clear();
    })
    this.data.shareKey = options.shareKey || '';
    wx.setStorageSync('shareKey',this.data.shareKey)
    this.setData({
      name:options.name || '',
      deviceNames: options.deviceNames || ''
    })
  },

  // 绑定
  tologin(){
    util.request('/sensor/web-share/bindShare',{method:'POST',data:{shareKey:this.data.shareKey}}).then(res =>{
      wx.removeStorageSync('shareKey');
      Dialog.alert({
        message: res.message || '绑定成功',
      }).then(() => {
        wx.reLaunch({url:"/pages/mine/share/index?active=2"})
      })
    })
  },

  // popup弹出/隐藏
  showPopup() {
    this.setData({ show: true });
  },

  onClose() {
    this.setData({ show: false });
  },
 
  // 退出
  quit(){
    wx.reLaunch({url: '/pages/login/index' });
  },

  // 跳转绑定页
  tobind(){
    wx.reLaunch({url: '/pages/login/index' });
  }
})