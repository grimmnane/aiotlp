//index.js
const app = getApp()
const util = require('../../utils/util.js');
const p = require('../../utils/promission.js')
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

Page(p.promission({
  data: {
    autoplay:true, // 是否自动播放
    bannerMode:'scaleToFill', // 图片填充格式
    bannerList:[{path:'http://5b0988e595225.cdn.sohucs.com/images/20190126/a8fb75821fad40c09a695e2b5a2ad8a9.jpeg'},{path:'https://www.69agri.com/wp-content/uploads/2019/12/cbae94b34913418393d860138c33f73c.jpg'}],
    interval:2000, // 轮播时间
    duration:500,
    deviceLoaded:false, 
    deviceList:[], 
    areaList:[],
    areaLoading:false,
    allSensorCount:0, // 所有区域下的传感器总数
    checkedSensorIds:[], // 选中的传感器id
    deviceHidden:false,
    showShare:false, // 是否要分享
    choseShare: false, // 分享面板
    options: [
      { name: '微信', icon: 'wechat', openType: 'share' },
      { name: '复制链接', icon: 'link' },
      { name: '二维码', icon: 'qrcode' },
    ],
  },

  onLoad() {
    Toast.loading({
      duration:0,
      forbidClick: true
    });
  },

  onShow() {
    this.getTabBar().setData({ active: 0})
    this.getDeviceList();
  },
  // onUnload(){
  //   this.getSensorData ? this.getSensorData.cancel() : null;
  // },  

  getDeviceList(){
    util.request('/sensor/web-device/myDeviceList',{method:'GET'}).then(res =>{
      let data = this.setList(res.data || []);
      this.setData({deviceList:data,deviceLoaded:true});
      Toast.clear();
    }).catch(()=>{
      this.setData({deviceLoaded:true})
      Toast.clear();
    })
  },

  setList(list = []){
    return list.map(item =>{
      item.name = item['设备名称'] || '';
      item.battery = item['电量'] || '';
      item.id = item['主键'] || '';
      item.code = item['设备编号'] || '';
      item.typeName = item['设备类型名'] || '';
      return item;
    })
  },

  toggleDeviceHidden(){
    let result = !this.data.deviceHidden
    this.setData({deviceHidden: result})
  },

  toggleShare(){
    let result = !this.data.showShare;
    this.setData({showShare:result});
  },

  cancelShare(){
    Dialog.confirm({
      message: '是否确认取消分享？',
    }).then(() => {
      this.toggleShare();
    })
  },

  getShareSensorIds({detail}){
    this.data.checkedSensorIds = detail || [];
  },

  getSensorCount({detail}){
    this.setData({allSensorCount:detail})
  },

  toAddPage(){
    wx.navigateTo({url: '/pages/index/addDevice/index'})
  },

  toDetailPage({detail}){
    let id = detail.id;
    wx.navigateTo({url: `/pages/sensorChart/index?id=${id}&from=1`});
  },

  openShare(event) {
    this.setData({ choseShare: true });
  },
  closeShare() {
    this.setData({ choseShare: false });
  },
  selectShare(){
    this.closeShare()
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      // console.log(res.target)
    }
    return {
      title: '自定义转发标题',
      path: '/page/index/index?id=123'
    }
  },

  toDeviceDetailPage(opt){
    let code = opt.currentTarget.dataset.code;
    wx.navigateTo({url: '/pages/index/addDevice/index?code=' + code})
  },
}))