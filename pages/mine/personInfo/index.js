// pages/mine/personInfo/index.js
const app = getApp()
const global = require('../../../utils/global');
const area = require('../../../utils/area');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    userAvatarPopup: false,
    columns: ['男', '女'],
    userGenderPopup: false,
    areaList: null,
    userAreAPopup: false,
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(app.globalData.userInfo){
      this.setData({
        userInfo: app.globalData.userInfo,
        areaList: area
      })
    }
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
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },

  /**
   *  修改头像弹窗 
   */
  showPopup() {
    this.setData({ userAvatarPopup: true });
  },
  onClose() {
    this.setData({ userAvatarPopup: false });
  },
  /**
   * 选择图片
   */
  clooseImg(){
    let self = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      success: function(res){
        // self.setData({choseImg: res.tempFilePaths});
        self.setData({
          'userInfo.photo': res.tempFilePaths
        });
        app.globalData.userInfo.photo = res.tempFilePaths
        self.onClose();
      },
      fail: function() {
        console.log('personInfo clooseImg function fail');
      }
    })
  },
  /**
   * 拍摄图片
   */
  openCamera(){
    let self = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['camera'],
      success: function(res){
        self.setData({
          'userInfo.photo': res.tempFilePaths
        });
        app.globalData.userInfo.photo = res.tempFilePaths
        self.onClose();
      },
      fail: function() {
        // fail
        console.log('personInfo openCamera function fail');
      }
    })
  },

  /**
   * 修改性别弹窗
   */
  showGenderPopup() {
    this.setData({ userGenderPopup: true });
  },
  onGenderClose() {
    this.setData({ userGenderPopup: false });
  },
  chooseGender(event){
    // 当前值 ${value}   索引值 ${index}
    const { picker, value, index } = event.detail;
    this.setData({
      'userInfo.sex': value,
      userGenderPopup: false
    })
    app.globalData.userInfo.sex = value;
  },

  /**
   * 修改地区弹窗
   */
  showAreaPopup() {
    this.setData({ userAreAPopup: true });
  },
  onAreaClose() {
    this.setData({ userAreAPopup: false });
  },
  chooseArea(e){
    let address_arr = e.detail.values;
    let address = address_arr[0].name + address_arr[1].name + address_arr[2].name;
    this.setData({
      'userInfo.address': address,
      userAreAPopup: false
    })
    app.globalData.userInfo.address = e.detail.values;
  },

  /**
   * 保存 修改
   */
  save() {
    // console.log( app.globalData.userInfo.address[0].code );
    wx.request({
      url: global.host + '/user/web-user/updatePersonCenter',
      data: {
        token: app.globalData.token,
        userName: app.globalData.userInfo.name,
        sex: app.globalData.userInfo.sex,
        provinceId: app.globalData.userInfo.address[0].code,
        cityId: app.globalData.userInfo.address[1].code,
        areaId: app.globalData.userInfo.address[2].code,
      },
      method: 'POST',
      success: function(res){
        // success
      },
      fail: function() {
        // fail
      },
    })
  }
})