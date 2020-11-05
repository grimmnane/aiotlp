//app.js

const global = require('./utils/global');

App({
  onLaunch: function () {
    let p = new Promise((resolve,reject) =>{
      this.login(resolve,reject);
    })
    this.globalData.promise = p;
  },
  globalData: {
    userInfo:null,
    token: null,
    openid: null,
    session_key: null,
    promise:null
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
              _this.globalData.token = res.data.token;
              wx.setStorage({key:"token",data:res.data.token,success(){
                if(!res.data.webUser){
                  reject();
                }else{
                  resolve();
                }
              }})
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
  }
  
})