// pages/mine/share/detail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeNames: ['1'],
    arr: [
      {"cate": "鱼塘", list:[
        {img: 'https://img.yzcdn.cn/vant/cat.jpeg',name: '设备名称', number: 'ABC123', power: '454 ppm', time: '2020-01-01 01:01'},
        {img: 'https://img.yzcdn.cn/vant/cat.jpeg',name: '设备名称', number: 'ABC123', power: '454 ppm', time: '2020-01-01 01:01'}
      ]}
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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