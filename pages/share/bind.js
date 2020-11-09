// pages/share/bind.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },


  // 绑定
  tologin(){
    wx.navigateTo({
      url: '/pages/login/login/index',
    })
  }
})