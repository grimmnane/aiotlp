// pages/mine/share/index.js
const app = getApp();
const util = require('../../../utils/util');
const global = require('../../../utils/global');
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: '1',
    tabList:[
      {
        name:'1',
        title:'共享'
      },
      {
        name:'2',
        title:'接受'
      }
    ],
    shareList: [], // 共享/接收列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getShareList();
  },


  getShareList(){
    util.request('/sensor/web-share/shareUserList',{method:'GET', data:{flag:this.data.active}}).then(res =>{
      let data = this.setShareList(res.data || []);
      this.setData({shareList: data});
    }).catch(data =>{
      // Toast('')
    })
  },

  setShareList(list){
    return list.map(item =>{
      item.userName = item['姓名'];
      item.shareDate = item['分享时间'];
      item.userId = item['分享用户ID'];
      item.userPhone = item['手机'];
      item.bindUserId = item['绑定用户ID'];
      return item;
    })
  },

  onShow: function () {

  },


  onChange({detail}) {
    let name = detail.name;
    this.setData({active: name});
    this.getShareList();
  },

  toDetail(e){
    let bindUserId = e.currentTarget.dataset.binduserid || "";
    wx.navigateTo({url: `/pages/mine/share/detail/index?bindUserId=${bindUserId}`})
  }
})