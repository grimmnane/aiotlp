// pages/sensorChart/index.js
import * as echarts from '../../ec-canvas/echarts';
const app = getApp();
const util = require('../../utils/util');
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';


let chart = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',  // 传感器id
    from:'1', // 1:从首页跳过来的  2:共享页面
    active: 0, // tab active
    ec: {onInit: initChart},
    show: false, // 所属区域弹框
    columns: [], // 所属区域picker
    areaValue: {text: '- 请选择 -', id: null}, // 所属区域
    areaInfo: null, // 区域信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
        id: options.id || '',
        from: options.from || ''
    });

    // 获取传感器 常规 信息
    let data_normal = {sensorId: this.data.id,};
    util.request('/sensor/web-area/areaSensorInfo',{method:'GET',data: data_normal}).then(res =>{
        res.data['电量'] = '电量 ' + res.data['电量'] + '%';
        res.data['区域'] = res.data['区域'] ? res.data['区域'] : '';
        this.setData({areaInfo: res.data})
    }).catch(()=>{
      // err
    })

    // 获取所有区域
    util.request('/sensor/web-area/areaSpinner',{method:'GET'}).then(res =>{
        let data = res.data;
        if(data.length == 0){
            this.data.columns.push("暂无选择区域，请先创建");
        }else{
            let list = data.map(item =>{
                return {
                    text:item['区域名称'],
                    id:item['区域ID']
                }
            })
            this.setData({columns:list})
        }
    }).catch(()=>{
        // err
    })

    // 获取传感器 折线图 数据
    let data_now = {
        sensorId: options.id,
        specificDate: util.formatTime(new Date())
    };
    getInfoByTime(1, data_now);

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },


  // tab切换日期
  onChange(event) {
    let type = null;
    let parame = null;

    if(event.detail.name == 0){// 请求当天数据
        type = 1;
        parame = {
            sensorId: this.data.id,
            specificDate: util.formatTime(new Date())
        };
    }
    if(event.detail.name == 1){// 请求7天数据
        type = 2;
        parame = {
            sensorId: this.data.id,
            day: 7
        };
    }
    if(event.detail.name == 2){// 请求30天数据
        type = 2;
        parame = {
            sensorId: this.data.id,
            day: 30
        };
    }

    getInfoByTime(type, parame);
  },

    // 切换所属区域
    onAreaChange(event) {
        const { picker, value, index } = event.detail;
        this.setData({areaValue: value});
        this.onClose();
    },
  // 所属区域弹窗
  showPopup() {
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  },
  

    // 保存修改
    saveSensor(){
        let data = {
            areaId: this.data.areaValue.id,
            sensorId: this.data.id
        };
        util.request('/sensor/web-area/upAreaSensor',{method:'POST', data: data}).then(res =>{
            Toast(res.message);
            setTimeout(() => {
                wx.navigateBack()
            }, 2500);
        })
        .catch(()=>{
            // err
        })
    },
  // 设置预警值
  toSetWarningPage(){
    let id = this.data.id || '1';
    let name = this.data.areaInfo['传感器名称'] || '';
    wx.navigateTo({url: `/pages/index/setWarning/index?id=${id}&name=${name}`});
  }

})

/**
 * 根据时间段获取对应传感器信息
 * time     1：当天  2：7天/30天
 * parames  请求data
 */
function getInfoByTime(type, parames){
  if(type == 1){ 
    util.request('/data/web-data/sensorHourLineDiagram',{method:'GET',data: parames}).then(res =>{
        let data = res.data;
        let axisX = [];  // x 轴
        let number = []; // 数值
        if(data.length <= 0){
          for(let i = 0 ; i < 24 ; i ++){
            axisX.push(i+"时");
            number.push(0);
          }
        }else{
          for(let i = 0 , len = data.length; i < len ; i++){
            axisX.push(data[i]['日期']);
            number.push(data[i]['数值']);
          }
        }
        setTimeout(()=>{
            updateChart(axisX,number,1);
        },1500)
    }).catch(()=>{

    })
  }else if(type == 2){
    util.request('/data/web-data/sensorDayLineDiagram',{method:'GET',data: parames}).then(res =>{
        let data = res.data;
        let axisX = [];  // x 轴
        let number = []; // 数值
        if(data.length <= 0){
          for(let i = 0 ; i < parames.day ; i ++){
            axisX.push(i+"日");
            number.push(0);
          }
        }else{
          for(let i = 0 , len = data.length; i < len ; i++){
            axisX.push(data[i]['日期']);
            number.push(data[i]['数值']);
          }
        }        
        setTimeout(()=>{
          let xnumber = 0;
          if(parames.day == 30){
            xnumber = 2;
          }
          updateChart(axisX,number,xnumber);
        },1500)
    }).catch(()=>{

    })
  }

}

// 初始化 图表
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
      containLabel: false // false用于多个grid对齐，true用于防止标签溢出
    },
    tooltip: {// 鼠标点击出现的文字
      show: true, // 是否显示提示框
      trigger: 'axis',
      formatter(params){
        return params[0].axisValue +"\n"+params[0].seriesName+": "+params[0].value;
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['1时', '2时', '3时', '4时', '5时', '6时', '7时', '8时', '9时', '10时','11时', '12时', '13时', '14时', '15时', '16时', '17时', '18时', '19时', '20时', '21时', '22时', '23时', '24时'],
      show: true,
      axisLabel:{
        interval:1,
        rotate:40  
      }
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
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }]
  };

  chart.setOption(option);
  return chart;
}

// 更新 图表 信息
function updateChart(xAxis,series,Xnumber){
  var option = {
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xAxis,
      axisLabel:{
        interval: Xnumber,
      }
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