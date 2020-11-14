// pages/login/index.js
const app = getApp();
const global = require('../../../utils/global');
const util = require('../../../utils/util');
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';

Page({
  data: {
    form:{
      phone_number: '', // 手机号
      verificationCode: '' , // 验证码
      checked: true, // 条款 - 复选框
    },
    rules:{ // 验证规则
      phone_number:[
        {required:true,message:'请输入手机号'},
        {pattern:'^1(3|4|5|7|8)[0-9]{9}$',message:'请输入合法的手机号'}
      ],
      verificationCode:[
        {required:true,message:'请输入短信验证码'},
      ],
      checked:[
        {required:true,message:'请勾选同意服务条款'},
      ]
    },
    isSentCode:false, // 是否已经发送验证码
    waitTime:30, // 验证码嘎松等待时间
    timer:null, // 计时器
  },

  onLoad(options) {
    
  },

  // 设置手机号
  changePhone({detail}){
    this.setData({'form.phone_number':detail.value})
  },

  // 设置 验证码
  changeCode({detail}){
    this.setData({'form.verificationCode':detail.value})
  },

  // 勾选服务协议
  onChange: function({detail}){
    this.setData({'form.checked': detail});
  },

  // 显示协议
  showProtocol: function(){
    wx.navigateTo({
      url: '/pages/mine/protocol/index',
    })
  },

  // 登陆
  _login(resolve,reject){
    util.validate(this.data.form,this.data.rules).then(valid =>{
      if(valid){
        this.data.timer ? clearInterval(this.data.timer) : null;
        let tempToken = wx.getStorageSync('tempToken') || app.globalData.tempToken || '';
        let header = {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'token': tempToken
        }
        util.request('/user/web-user/wxappPhoneLogin',{method:'POST',header,data:{code: this.data.form.verificationCode}}).then(res =>{
            if(res.data.webUser){
              app.globalData.token = res.data.token;
              wx.setStorageSync("token",res.data.token)
              app.globalData.userInfo = res.data.webUser;
              resolve()
            }else{
              reject()
            }
        }).catch(data =>{

        })
      }
    }).catch(message =>{
      Toast(message);
    })
  },

  // 登陆
  login(){
    let p = app.promission(this._login);
    p.then(() =>{
      app.globalData.promise =  Promise.resolve();
      wx.switchTab({url: "/pages/index/index"});
    },()=>{
      app.globalData.promise =  Promise.reject();
      wx.switchTab({url: "/pages/index/index"});
    })
  },

  // 发送验证码
  verify(){
    this.setData({isSentCode: !this.data.isSentCode});
    this.timeCutDown();
    let rules = {...this.data.rules};
    delete rules.verificationCode
    delete rules.checked
    util.validate(this.data.form,rules).then(valid =>{
      if(valid){
        let tempToken = wx.getStorageSync('tempToken') || app.globalData.tempToken || '';
        let header = {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'token': tempToken
        }
        util.request('/user/web-user/wxappSendLoginCode',{method:'GET',header,data:{phone: this.data.form.phone_number}}).then(res =>{
          this.setData({ 'form.verificationCode': res.data.code || '123456'});
        })
      }
    }).catch(message =>{
      Toast(message);
    })
  },

  // 倒计时
  timeCutDown(){
    this.data.timer = setInterval(()=>{
      if(this.data.waitTime == 0){
        clearInterval(this.data.timer);
        this.setData({isSentCode:false})
      }
      let value =  this.data.waitTime;
      this.setData({waitTime: value - 1});
    },1000)
  }

})