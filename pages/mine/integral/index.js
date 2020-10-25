// pages/mine/integral/index.js
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

    nowTab: 0, // dangqian 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getListByCategory(0,this.data.allPage);
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
    this.getListByCategory(this.data.nowTab, this.data.allPage);
  },


  // 根据分类,分页获取对应分类下的列表数据
  getListByCategory(category,page){
    // 请求接口
    // ...

    let temp = [
      {time: '2020-01-01', message: '鱼塘1数据上报', integral: '+10'},
      {time: '2020-01-02', message: '鱼塘2数据上报', integral: '+10'},
      {time: '2020-01-03', message: '鱼塘3数据上报', integral: '+10'},
    ];
    this.setData({
      allList: temp
    });
  }


})