//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js');
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

Page({
  data: {
    autoplay:true,
    bannerMode:'scaleToFill',
    bannerList:[{path:'http://5b0988e595225.cdn.sohucs.com/images/20190126/a8fb75821fad40c09a695e2b5a2ad8a9.jpeg'},{path:'https://www.69agri.com/wp-content/uploads/2019/12/cbae94b34913418393d860138c33f73c.jpg'}],
    interval:2000,
    duration:500,
    deviceList:[
      {
        path:'http://5b0988e595225.cdn.sohucs.com/images/20190126/a8fb75821fad40c09a695e2b5a2ad8a9.jpeg'
      }
    ],
    areaList:[
      {path:'https://www.69agri.com/wp-content/uploads/2019/12/cbae94b34913418393d860138c33f73c.jpg'}
    ],
    deviceHidden:false,
    checked:true,
    showShare:false, // 是否要分享
    choseShare: false, // 分享面板
    options: [
      { name: '微信', icon: 'wechat', openType: 'share' },
      { name: '复制链接', icon: 'link' },
      { name: '二维码', icon: 'qrcode' },
    ],
  },

  onLoad() {
    
  },
  
  onShow() {
    this.getTabBar().setData({ active: 0})
    Toast.loading({
      duration:0,
      forbidClick: true,
    });
    this.getList();
  },
 
  getList(){
    util.request('/sensor/web-device/myDeviceList',{method:'GET'}).then(res =>{
      let data = this.setList(res.data || []);
      console.log(data,4444)
      this.setData({deviceList:data});
    }).catch(data =>{
      Toast(data.message || '操作失败')
    }).finally(()=>{
      this.setData({isLoaded:true})
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

  onChange(){

  },

  toAddPage(){
    wx.navigateTo({url: '/pages/index/addDevice/index'})
  },

  toDetailPage(e){
    let id = e.currentTarget.dataset.id || '1';
    wx.navigateTo({url: `/pages/sensorChart/index?id=${id}&from=1`});
  },


  openShare(event) {
    this.setData({ choseShare: true });
  },
  closeShare() {
    this.setData({ choseShare: false });
  },
  selectShare(){
    // console.log(this.data.showShare);
    this.closeShare()
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      // console.log(res.target)
    }
    return {
      title: '自定义转发标题',
      path: '/page/user?id=123'
    }
  }


})