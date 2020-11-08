// pages/mine/integral/index.js
const app = getApp()
const util = require('../../../utils/util');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,

    nowIntegral: null, // 当前tab分类下的总积分
    nowTab: 1, // 当前tab分类  =>  1：全部、2：收入、3：支出
    list: null, // 积分列表
    page: 1, // 当前页码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getListByCategory(0,this.data.allPage);
    this.getListByCategory(1, this.data.page)

    // 获取用户当前积分
    util.request('/integral/web-user-integral/getWebUserIntegral',{method:'GET'}).then(res =>{
      this.setData({nowIntegral: res.data['积分'] || ''});
    }).catch(data =>{
      // Toast('')
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      page: 1
    });
    this.getListByCategory(this.data.nowTab, this.data.page);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      page: this.data.page + 1
    });
    this.getListByCategory(this.data.nowTab, this.data.page);
  },

  // 
  onChange(event) {
    this.setData({
      nowTab: event.detail.index + 1,
      page: 1
    });
    this.getListByCategory(this.data.nowTab, this.data.page);
  },


  // 根据分类,分页获取对应分类下的列表数据
  getListByCategory(type,page){
    let parames = {
      flag: type,
      pageNum: page,
      pageSize: 10
    };
    util.request('/integral/web-user-integral/getIntegralRecord',{method:'GET', data: parames}).then(res =>{
      let data = res.data;
      this.setData({
        list: data.rows
      });
    }).catch(data =>{
      // Toast('')
    })
  },


  // 


})