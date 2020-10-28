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
  },
  
  onShow() {
    this.getTabBar().setData({ active: 0})
  },
  
  onLoad: function () {
   
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
    console.log(111111111);
    wx.navigateTo({url: '/pages/index/addDevice/index'})
  }
})
