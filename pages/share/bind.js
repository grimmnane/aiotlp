// pages/share/bind.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: null, // 分享携带数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data = JSON.parse(options.data);
    // console.log(data);
    this.setData({
      data: data
    });
  },


  // 绑定
  tologin(){
    wx.navigateTo({
      url: '/pages/login/login/index',
    })
  }
})