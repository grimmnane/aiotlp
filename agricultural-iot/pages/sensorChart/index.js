// pages/sensorChart/index.js
import * as echarts from '../../ec-canvas/echarts';
let chart = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    from:'', // 1:从首页跳过来的
    active: 0, // tab active
    ec: {
      onInit: initChart
    },
    show: false, // 所属区域弹框
    columns: [], // 所属区域picker
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.id = options.id;
    this.setData({from:options.from || ''})
    console.log(this.data.from,4444)
    // 根据参数请求接口
    // wx.request({
    //   url: 'url',
    //   success: ()=>{

    //   },
    // })


    this.setData({
      columns: ['鱼塘', '养殖场']
    });
    let x = ['1时', '2时', '3时', '4时', '5时', '6时', '7时', '8时', '9时', '10时'];
    let data = [123, 789, 159, 753, 654, 240, 954, 180, 264, 650];
    setTimeout(()=>{
      updateChart(x,data);
    },1500)
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

  // tab切换日期
  onChange(event) {
    if(event.detail.name == 0){
      // 请求当天数据

      let x = ['1时', '2时', '3时', '4时', '5时', '6时', '7时', '8时', '9时', '10时'];
      let data = [123, 789, 159, 753, 654, 240, 954, 180, 264, 650];
      updateChart(x, data);
    }
    if(event.detail.name == 1){
      // 请求7天数据

      let x = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
      let data = [159, 123, 248, 368, 754, 456, 369];
      updateChart(x, data);
    }
    if(event.detail.name == 2){
      // 请求30天数据

      let x = ['1号', '3号', '5号', '7号', '9号', '11号', '13号', '15号'];
      let data = [147, 258, 369, 159, 456, 789, 652, 149];
      updateChart(x, data);
    }
  },

  // 切换所属区域
  onAreaChange(event) {
    // const { picker, value, index } = event.detail;
    // Toast(`当前值：${value}, 当前索引：${index}`);
  },
  // 所属区域弹窗
  showPopup() {
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  },
  

  toSetWarningPage(){
    let id = this.data.id || '1';
    let name = 'testtest'
    wx.navigateTo({url: `/pages/index/setWarning/index?id=${id}&name=${name}`});
  }
})

function initChart(canvas, width, height, dpr) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);

  var option = {
    color: "#71BB6E", // 线条颜色
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
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }]
  };

  chart.setOption(option);
  return chart;
}


function updateChart(xAxis,series){
  var option = {
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xAxis,
    },
    series: [{
      name: 'ppm',
      type: 'line',
      smooth: true,
      data: series
    }]
  }
  chart.setOption(option);
}