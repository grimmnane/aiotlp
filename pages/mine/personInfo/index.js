// pages/mine/personInfo/index.js
const app = getApp()
const global = require('../../../utils/global');
const area = require('../../../utils/area');
const util = require('../../../utils/util');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    userAvatarPopup: false,
    columns: ['男', '女'],
    userGenderPopup: false,
    areaList: null, // 地址list
    userAreAPopup: false,
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // util.request('/user/web-user/getPersonalInfo',{method:'GET'}).then(res =>{
    //   let data = res.data;
    //   console.log(data);
    //   console.log(app.globalData.userInfo);
    //   if(data.sex == 1){
    //     data.sex = '男';
    //   }else{
    //     data.sex = '女';
    //   }
    //   this.setData({
    //     userInfo:res.data,
    //     areaList: area
    //   });
    // }).catch(data =>{
    //   // Toast('')
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     areaList: area
    //   })
    // })


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

    if(app.globalData.userInfo.address){
      if( typeof(app.globalData.userInfo.address) == 'string'){
        this.setData({
          'userInfo.address': app.globalData.userInfo.address
        });
      }else if( typeof(app.globalData.userInfo.address) == 'object' ){
        this.setData({
          'userInfo.address': app.globalData.userInfo.address[0].name +' '+ app.globalData.userInfo.address[1].name +' '+ app.globalData.userInfo.address[2].name
        });
      }      
    }else{
      let provName = app.globalData.userInfo.province ? area.province_list[app.globalData.userInfo.province] : '';
      let cityName = app.globalData.userInfo.city ? area.city_list[app.globalData.userInfo.city] : '';
      let areaName = app.globalData.userInfo.area ? area.county_list[app.globalData.userInfo.area] : '';
      this.setData({
        'userInfo.address': provName + ' ' + cityName + ' ' + areaName ,
      });
    }
    
    if(this.data.userInfo.sex == 1){
      this.setData({'userInfo.sex': '男'})
    }else if(this.data.userInfo.sex == 2){
      this.setData({'userInfo.sex': '女'})
    }
    // this.setData({
    //   'userInfo.sex': app.globalData.userInfo ? app.globalData.userInfo.sex ? app.globalData.userInfo.sex == 1 ? '男' : '女'  : '' : ''
    // })
    
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

  cancelSex(){
    this.onGenderClose();
  },

  confirmSex({detail}){
    this.setData({
      'userInfo.sex': detail.value,
      userGenderPopup: false
    })
    app.globalData.userInfo.sex = detail.value;
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
    // console.log( e.detail.values,999)
    let address = address_arr[0].name + address_arr[1].name + address_arr[2].name;
    this.setData({
      'userInfo.address': address,
      userAreAPopup: false
    })
    app.globalData.userInfo.province = address_arr[0].code;
    app.globalData.userInfo.city = address_arr[1].code;
    app.globalData.userInfo.area = address_arr[2].code;
    app.globalData.userInfo.address = e.detail.values;
  },

  /**
   * 保存 修改
   */
  save() {
    if(app.globalData.userInfo.sex == '男'){
      app.globalData.userInfo.sex = 1;
    }else{
      app.globalData.userInfo.sex = 2;
    }
    let data = {
        userName: app.globalData.userInfo.name || app.globalData.userInfo.nickName,
        sex: app.globalData.userInfo.sex,
        provinceId: app.globalData.userInfo.province,
        cityId: app.globalData.userInfo.city,
        areaId: app.globalData.userInfo.area,
    };
    util.request('/user/web-user/updatePersonCenter',{method:'POST', data}).then(res =>{
      let data = res.data || [];
      this.setData({userInfo:data.webUser});
      app.globalData.userInfo = data.webUser;
      wx.switchTab({
        url: '/pages/mine/index'
      })
    }).catch(data =>{
      // Toast('')
    })

  }
})