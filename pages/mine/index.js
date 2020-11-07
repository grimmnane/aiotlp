//index.js
const app = getApp();
const global = require('../../utils/global');
const p = require('../../utils/promission.js')
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
const util = require('../../utils/util.js');

Page(p.promission({
  data: {
    isLogin: false,
    userInfo: null,
  },

  onLoad: function () {
    let that = this;

    if(app.globalData.userInfo){ // 已有用户信息
      that.setData({
        isLogin: true,
        userInfo: app.globalData.userInfo
      })
    }else{ // 请求用户信息
      util.request('/user/web-user/getPersonalInfo',{method:'GET'}).then(res =>{
        let data = res.data || [];
        this.setData({userInfo:data.webUser});
      }).catch(data =>{
        // Toast('')
      })
    }

  },

  onShow() {
    this.getTabBar().setData({ active: 3})
  },

  // 登录
  login(){
    wx.redirectTo({
      url: '/pages/login/index',
    })
  },

  // 修改资料
  personInfo(){
    wx.navigateTo({
      url: '/pages/mine/personInfo/index',
    })
  },

  // 退出登录
  loginOut(){
    Dialog.confirm({
      message: '确定退出登录？',
    }).then(() => {
      util.request('/user/web-user/wxappPhoneLogout',{method:'POST'}).then(data =>{
        // wx.removeStorage({key:'token'});
        app.globalData.userInfo = null;
        app.globalData.token = null;
        wx.reLaunch({url: "/pages/login/index"});
      }).catch(data =>{

      })
    })
  },


  // 开发中
  develop(){
    Toast('敬请期待');
  },

}))
