// pages/share/bind.js
const app = getApp()
const p = require('../../utils/promission')

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
      // let data = JSON.parse(options.data);
      console.log(options);
      console.log(app.globalData.token);
      this.setData({
        data: 'data'
      });
    },
  
  
    // 绑定
    tologin(){
      console.log(app.globalData.token);
      console.log(this.data.data);
    }
}))