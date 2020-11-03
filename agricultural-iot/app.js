//app.js
const global = require('./utils/global');

App({
  onLaunch: function () {
    let that = this;
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: global.host + '/user/web-user/wxappLogin',
          data: {code:res.code},
          method: 'GET',
          success: function(res){
            global.token =  res.data.data.token;
            that.globalData.userInfo = res.data.data.webUser;
            that.globalData.openid = res.data.data.openid;
            that.globalData.session_key = res.data.data.session_key;
          },
        })
      }
    })
  },
  globalData: {
    // userInfo: {
    //   name: 'test',
    //   phone: '123456789',
    //   photo: 'https://img.yzcdn.cn/vant/cat.jpeg',
    //   sex: '1',
    // },
    userInfo:null,
    token: null,
    openid: null,
    session_key: null
  }
})