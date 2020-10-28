// pages/sensorChart/index.js
import * as echarts from '../../ec-canvas/echarts';


Page({

  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      onInit: initChart
    }
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


})

function initChart(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);

  var option = {
    color: "#2E8B57", // 线条颜色
    grid: {
      containLabel: true // false用于多个grid对齐，true用于防止标签溢出
    },
    tooltip: {// 鼠标点击出现的文字
      show: true, // 是否显示提示框
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['1时', '2时', '3时', '4时', '5时', '6时', '7时', '8时', '9时', '10时'],
      // show: false
    },
    yAxis: {
      x: 'center',
      type: 'value',
      minInterval: 0,
      interval: 200, //每次增加几个
      // show: false
    },
    series: [{
      name: 'ppm',
      type: 'line',
      smooth: true,
      data: [180, 360, 650, 300, 780, 400, 330, 180, 360, 650]
    }]
  };

  chart.setOption(option);
  return chart;
}