// pages/share/bind.js
const app = getApp()
const p = require('../../utils/promission')
const util = require('../../utils/util.js');
const { default: toast } = require('../../miniprogram_npm/@vant/weapp/toast/toast');
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

Page(p.promission({
    /**
     * 页面的初始数据
     */
    data: {
      data: null, // 分享携带数据
    },
  
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      this.data.data = wx.getStorageSync('shareKey') || '';
    },
  
  
    // 绑定
    tologin(){
      util.request('/sensor/web-share/bindShare',{method:'POST',data:{shareKey:this.data.data}}).then(res =>{
        Toast(res.message || '绑定成功');
        wx.removeStorageSync('shareKey')
        wx.navigateTo({url:"/pages/mine/share/index"})
      }).catch(message =>{

      })
    }
}))