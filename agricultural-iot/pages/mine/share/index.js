// pages/mine/share/index.js
const app = getApp();
const util = require('../../../utils/util');
const global = require('../../../utils/global');
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    shareList: [], // 共享
    acceptList: [], //接收
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let Sdata = {flag: 1}; // 分享用户列表
    let Adata = {flag: 2}; // 被分享列表
    util.request('/sensor/web-share/shareUserList',{method:'GET', Sdata}).then(res =>{
      // console.log(res);
      this.setData({shareList: res});
    }).catch(data =>{
      // Toast('')
    })

    util.request('/sensor/web-share/shareUserList',{method:'GET', Adata}).then(res =>{
      // console.log(res);
      this.setData({acceptList: res});
    }).catch(data =>{
      // Toast('')
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },


  onChange(event) {
    // wx.showToast({
    //   title: `切换到标签 ${event.detail.name}`,
    //   icon: 'none',
    // });
  },

  toDetail(){
    wx.navigateTo({
      url: '/pages/mine/share/detail/index',
    })
  }
})