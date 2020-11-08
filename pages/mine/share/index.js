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
    shareList: [], // 共享/接收列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let Sdata = {flag: 1}; // 分享用户列表
    // let Adata = {flag: 2}; // 被分享列表
    // util.request('/sensor/web-share/shareUserList',{method:'GET', Sdata}).then(res =>{
    //   // console.log(res);
    //   this.setData({shareList: res});
    // }).catch(data =>{
    //   // Toast('')
    // })
    this.getShareList();
  },


  getShareList(){
    util.request('/sensor/web-share/shareUserList',{method:'GET', data:{flag:this.data.active}}).then(res =>{
      let data = this.setShareList(res.data || []);
      this.setData({acceptList: data});
    }).catch(data =>{
      // Toast('')
    })
  },

  setShareList(list){
    return list.map(item =>{


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

  toDetail(){
    wx.navigateTo({url: '/pages/mine/share/detail/index'})
  }
})