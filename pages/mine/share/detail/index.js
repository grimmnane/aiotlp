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

  toDetailPage({detail}){
    let id = detail.id || '';
    wx.navigateTo({url: `/pages/sensorChart/index?id=${id}&from=2`});
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