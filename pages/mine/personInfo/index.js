// pages/mine/personInfo/index.js
const global = require('../../../utils/global');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    userAvatarPopup: false,
    columns: ['男', '女'],
    userGenderPopup: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(global.userInfo){
      this.setData({
        userInfo: global.userInfo
      })
    }
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
    this.setData({
      userInfo: global.userInfo
    })
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

  /**
   *  修改头像弹窗 
   */
  showPopup() {
    this.setData({ userAvatarPopup: true });
  },
  onClose() {
    this.setData({ userAvatarPopup: false });
  },
  /**
   * 选择图片
   */
  clooseImg(){
    let self = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      success: function(res){
        self.setData({choseImg: res.tempFilePaths});
        self.setData({
          'userInfo.userAvatarUrl': res.tempFilePaths,
          'global.userInfo.userAvatarUrl': res.tempFilePaths
        });
        self.onClose();
      },
      fail: function() {
        console.log('personInfo clooseImg function fail');
      },
      complete: function() {
        // complete
      }
    })
  },
  /**
   * 拍摄图片
   */
  openCamera(){
    let self = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['camera'],
      success: function(res){
        self.setData({
          'userInfo.userAvatarUrl': res.tempFilePaths,
          'global.userInfo.userAvatarUrl': res.tempFilePaths
        });
        self.onClose();
      },
      fail: function() {
        // fail
        console.log('personInfo openCamera function fail');
      },
      complete: function() {
        // complete
      }
    })
  },

  /**
   * 修改性别tanc
   */
  showGenderPopup() {
    this.setData({ userGenderPopup: true });
  },
  onGenderClose() {
    this.setData({ userGenderPopup: false });
  },
})