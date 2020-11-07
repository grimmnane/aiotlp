// pages/mine/integral/index.js
const app = getApp()
const util = require('../../../utils/util');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,

    allList: null, // 全部 - 列表
    allPage: 1, // 全部 - 当前页
    inList: null, // 收入 - 列表
    inPage: 1, // 收入 - 当前页
    outList: null, // 支出 - 列表
    outPage: 1, // 支出 - 当前页

    nowIntegral: null, // 当前tab分类下的总积分
    nowTab: 1, // 当前tab分类  =>  1：全部、2：收入、3：支出
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getListByCategory(0,this.data.allPage);
    this.getListByCategory(1, this.data.allPage)

    util.request('/integral/web-user-integral/getWebUserIntegral',{method:'GET'}).then(res =>{
      this.setData({nowIntegral: res.data['积分']});
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  // 
  onChange(event) {
    this.setData({
      nowTab: event.detail.index
    });
    console.log('flag = ' + (event.detail.index + 1));
    this.getListByCategory(this.data.nowTab, this.data.allPage);
  },


  // 根据分类,分页获取对应分类下的列表数据
  getListByCategory(type,page){
    let parames = {
      flag: type,
      pageNum: page,
      pageSize: 10
    };
    util.request('/integral/web-user-integral/getIntegralRecord',{method:'GET', data: parames}).then(res =>{
      // console.log(res);
      let data = res.data;

    }).catch(data =>{
      // Toast('')
    })
  },


  // 


})