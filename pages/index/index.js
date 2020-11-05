//index.js
const app = getApp()
const util = require('../../utils/util.js');
const p = require('../../utils/promission.js')
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

Page(p.promission({
  data: {
    toast:null,
    autoplay:true,
    bannerMode:'scaleToFill',
    bannerList:[{path:'http://5b0988e595225.cdn.sohucs.com/images/20190126/a8fb75821fad40c09a695e2b5a2ad8a9.jpeg'},{path:'https://www.69agri.com/wp-content/uploads/2019/12/cbae94b34913418393d860138c33f73c.jpg'}],
    interval:2000,
    duration:500,
    deviceList:[], 
    areaList:[],
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
    console.log('indexPageLoad')
  },

  onShow() {
    Toast.loading({
      duration:0,
      forbidClick: true
    });
    this.getTabBar().setData({ active: 0})
    this.getDeviceList();
    this.getAreaList();
  },
 
  getDeviceList(){
    util.request('/sensor/web-device/myDeviceList',{method:'GET'}).then(res =>{
      let data = this.setList(res.data || []);
      this.setData({deviceList:data});
      this.setData({isLoaded:true})
      Toast.clear();
    }).catch(()=>{
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

  getAreaList(){
    util.request('/sensor/web-area/areaListInfo',{method:'GET',data:{flag:'1',boundUserId:'',userId:''}}).then(res =>{
      console.log(res.data,444)
      // let data = this.setList(res.data || []);
      // this.setData({deviceList:data});
      // this.setData({isLoaded:true})
      Toast.clear();
    }).catch(()=>{
      // this.setData({isLoaded:true})
      Toast.clear();
    })
  },

  setAreaList(list){
    console.log(list,444)
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
      path: '/page/index/index?id=123'
    }
  },

  toDeviceDetailPage(opt){
    let code = opt.currentTarget.dataset.code;
    console.log(code,44444)
    wx.navigateTo({url: '/pages/index/addDevice/index?code=' + code})
  },

}))