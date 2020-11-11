// pages/mine/share/index.js
const app = getApp();
const util = require('../../../utils/util');
const global = require('../../../utils/global');
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';
import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';

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

  // 生命周期
  onShow: function () {

  },

  // 获取共享/接受列表
  getShareList(){
    util.request('/sensor/web-share/shareUserList',{method:'GET', data:{flag:this.data.active}}).then(res =>{
      let data = this.setShareList(res.data || []);
      this.setData({shareList: data});
    }).catch(data =>{
      // Toast('')
    })
  },

  // 把中文key变成英文
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

  // 解绑分享设备
  unbindDevice(e){
    let bindUserId = e.currentTarget.dataset.binduserid;
    let userId = e.currentTarget.dataset.userid;
    Dialog.confirm({
      message: '是否要解除分享关系？',
    }).then(() => {
      if(!bindUserId || !userId) return;
      util.request('/sensor/web-share/delShareSensor',{method:'GET', data:{boundUserId:bindUserId,shareUserId:userId}}).then(res =>{
        Toast(res.data.message || '操作成功');
        this.getShareList();
      }).catch(data =>{
      })
    })
  },

  
  // 切换接受和共享tab
  onChange({detail}) {
    let name = detail.name;
    this.setData({active: name});
    this.getShareList();
  },

  // 跳转到共享明细页面
  toDetail(e){
    let bindUserId = e.currentTarget.dataset.binduserid || "";
    let shareUserId = e.currentTarget.dataset.userid || ''
    wx.navigateTo({url: `/pages/mine/share/detail/index?bindUserId=${bindUserId}&shareUserId=${shareUserId}&from=2`})
  }
})