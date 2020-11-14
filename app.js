//app.js

const global = require('./utils/global');

App({
  onLaunch: function () {
    let p = this.promission(this.login);
    this.globalData.promise = p;
  },
  globalData: {
    userInfo:null,
    token: null,
    openid: null,
    session_key: null,
    promise:null,
    tempToken:'',
  },

  login(resolve,reject){
    let _this = this;
      wx.login({
        success: res => {
          wx.request({
            url: `${global.host}/user/web-user/wxappLogin`,
            method: 'GET',
            data: {code:res.code},
            header: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            },
            success(request) {
              if (request.data.success) {
                let res = request.data;
                _this.globalData.userInfo = res.data.webUser;
                _this.globalData.openid = res.data.openid;
                _this.globalData.session_key = res.data.session_key;
                if(res.data.webUser){
                  _this.globalData.token = res.data.token;
                  wx.setStorageSync('token',res.data.token);
                  resolve();
                }else{
                  _this.globalData.tempToken = res.data.token;
                  wx.setStorageSync('tempToken',res.data.token);
                  reject()
                }
              }
            },
            fail(error){
              wx.showToast({
                title: error.errMsg || '网络错误',
                mask:true,
                icon:'none',
                duration: 2000,
              })
            }
          })
        }
      })
  },

  promission(fn){
    return new Promise((resolve,reject) =>{
      fn(resolve,reject);
    })
  },

  
})