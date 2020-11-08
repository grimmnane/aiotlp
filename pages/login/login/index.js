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
    rules:{
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
    waitTime:30,
    timer:null,
  },

  onLoad(options) {
    
  },

  changePhone({detail}){
    this.setData({'form.phone_number':detail.value})
  },

  changeCode({detail}){
    his.setData({'form.verificationCode':detail.value})
  },

  onChange: function({detail}){
    this.setData({'form.checked': detail});
  },

  showProtocol: function(){
    wx.navigateTo({
      url: '/pages/mine/protocol/index',
    })
  },

  _login(resolve,reject){
    util.validate(this.data.form,this.data.rules).then(valid =>{
      if(valid){
        this.data.timer ? clearInterval(this.data.timer) : null;
        util.request('/user/web-user/wxappPhoneLogin',{method:'POST',data:{code: this.data.form.verificationCode}}).then(res =>{
          app.globalData.token = res.data.token
          wx.setStorage({key: "token", data: res.data.token})
          app.globalData.userInfo = res.data.webUser;
            if(res.data.webUser){
              resolve()
            }else{
              reject();
            }
        }).catch(data =>{

        })
      }
    }).catch(message =>{
      Toast(message);
    })
  },

  login(){
    let p = app.promission(this._login)
    app.globalData.promise = p;
    wx.switchTab({url: "/pages/index/index"});
  },

  verify(){
    this.setData({isSentCode: !this.data.isSentCode});
    this.timeCutDown();
    let rules = {...this.data.rules};
    delete rules.verificationCode
    delete rules.checked
    util.validate(this.data.form,rules).then(valid =>{
      if(valid){
        util.request('/user/web-user/wxappSendLoginCode',{method:'GET',data:{phone: this.data.form.phone_number}}).then(res =>{
          this.setData({ 'form.verificationCode': res.data.code || '123456'});
        })
      }
    }).catch(message =>{
      Toast(message);
    })
  },

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