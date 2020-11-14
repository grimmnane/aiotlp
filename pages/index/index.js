//index.js
const app = getApp()
const util = require('../../utils/util.js');
const p = require('../../utils/promission.js')
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

Page(p.promission({
  data: {
    isIphoneX: false, // 是否是iphone x等系列机型
    autoplay:true, // 是否自动播放
    bannerMode:'scaleToFill', // 图片填充格式
    bannerList:[{path:'http://5b0988e595225.cdn.sohucs.com/images/20190126/a8fb75821fad40c09a695e2b5a2ad8a9.jpeg'},{path:'https://www.69agri.com/wp-content/uploads/2019/12/cbae94b34913418393d860138c33f73c.jpg'}],
    interval:2000, // 轮播时间
    duration:500, // 滑动动画时长
    deviceLoaded:false,  // 是否加载完
    deviceList:[],  // 设备列表哦
    allSensorCount:0, // 所有区域下的传感器总数
    checkedSensorIds:[], // 选中的传感器id
    deviceHidden:false, // 隐藏设备信息
    showShare:false, // 是否要分享
    choseShare: false, // 分享面板
    options: [ // 面板
      { name: '微信', icon: 'wechat', openType: 'share' },
      // { name: '复制链接', icon: 'link' },
      // { name: '二维码', icon: 'qrcode' },
    ],
    latestMessage:'' , // 最新的一条消息
  },

  onLoad() {
    //  适配分享按钮在 x 机型上的定位问题
    let model = app.globalData.sysInfo.model;
    if(model == 'iPhone X' || model == 'iPhone XR' || model == 'iPhone XS Max'){
      this.setData({
        isIphoneX: true
      });
    }
  },

  onShow() {
    this.getTabBar().setData({ active: 0})
    this.getDeviceList();
    this.getLatestMessage();
  },

  // 获取我的设备列表
  getDeviceList(){
    Toast.loading({
      duration:0,
      forbidClick: true
    });
    util.request('/sensor/web-device/myDeviceList',{method:'GET'}).then(res =>{
      let data = this.setList(res.data || []);
      this.setData({deviceList:data,deviceLoaded:true});
    }).catch(()=>{
      this.setData({deviceLoaded:true})
    })
  },

  // 将中文key转化为英文key
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
  
  // 切换设备展开收起
  toggleDeviceHidden(){
    let result = !this.data.deviceHidden
    this.setData({deviceHidden: result})
  },

  // 切换分享/取消分享
  toggleShare(){
    let result = !this.data.showShare;
    this.setData({showShare:result});
  },

  // 取消分享
  // cancelShare(){
  //   Dialog.confirm({
  //     message: '是否确认取消分享？',
  //   }).then(() => {
  //     this.toggleShare();
  //   })
  // },

  // 获取已选择的传感器id
  getShareSensorIds({detail}){
    this.data.checkedSensorIds = detail || [];
    this.openShare();
  },

  // 获取所有传感器的数量
  getSensorCount({detail}){
    this.setData({allSensorCount:detail})
  },

  // 去设备详情页
  toDeviceDetailPage(opt){
    let code = opt.currentTarget.dataset.code;
    wx.navigateTo({url: '/pages/index/addDevice/index?code=' + code})
  },
  
  // 去新增设备页面
  toAddPage(){
    wx.navigateTo({url: '/pages/index/addDevice/index'})
  },

  // 去传感器详情页面
  toDetailPage({detail}){
    let id = detail.id;
    wx.navigateTo({url: `/pages/sensorChart/index?id=${id}&from=1`});
  },

  // 调其分享面板
  openShare(event) {
    this.setData({ choseShare: true });
  },

  // 取消分享
  closeShare() {
    this.setData({ choseShare: false });
  },

  // 去分享 
  selectShare(){
    this.closeShare()
  },
  
  // 分享
  onShareAppMessage: function (res) {
    let ids = this.data.checkedSensorIds;
    let data = {sensorIds: ids};
    let share_key = null; // 分享key，用于分享绑定
    util.request('/sensor/web-share/shareSensor',{method:'POST',data:data}).then(res =>{
      share_key = res.data;
    }).catch(()=>{
    })
    return { // shareSensor_1322785094765699072_1326538821298499584
      title: '分享设备',
      path: '/pages/share/secret?name=aaa&shareKey=' + share_key
    }
  },

  // 获取最新一条消息
  getLatestMessage(){
    util.request('/message/web-message/getUsrMessage',{method:'GET',data:{pageNum:1,pageSize:1}}).then(res =>{
      let list = this.setItem(res.data.rows || []);
      this.setData({latestMessage:(list[0] ? list[0].title : '') ||  '暂无消息'})
    }).catch(() =>{
    })
  },

  // 将中文key转为英文key
  setItem(list){
    return list.map(item =>{
      item.date = item['时间'];
      item.type = item['消息类型'];
      item.title = item['消息标题'];
      item.id = item['ID'];
      return item;
    })
  },
  
}))