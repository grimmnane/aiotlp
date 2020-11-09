// pages/mine/share/detail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arr: [],
    bindUserId:'',
    shareUserId:'',
    from:'', // 来自于哪个页面 1：首页  2：我的共享
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opt) {
    this.setData({
      'bindUserId':opt.bindUserId || '',
      'shareUserId':opt.shareUserId || '',
      'from':opt.from || '1',
    })
    console.log(this.data.bindUserId,this.data.shareUserId,this.data.from,'id')
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



  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },

  toEcharts(){
    wx.navigateTo({
      url: '/pages/sensorChart/index',
    })
  }
})