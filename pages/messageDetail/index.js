//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js');
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

Page({
  data: {
    detail:{}

  },
  onLoad: function () {
    
  },
  onShow() {
    this.setData({detail:{title:'这是一个消息标题',content:'<p>小程序提供了一个简单、高效的应用开发框架和丰富的组件及API，帮助开发者在微信中开发具有原生 APP 体验的服务。</p><p>本章分主题的介绍了小程序的开发语言、框架、能力、调试等内容，帮助开发者快速全面的了解小程序开发的方方面面。</p><p>想要更具体了解关于框架、组件、API的详细内容，请参考对应的参考文档：</p>'}});
    // this.getDetail();
  },
  
  getDetail(){
    util.request('',{method:'GET'}).then(res =>{
      let data = this.setContent(res.data);
      this.setData({detail:data});
    }).catch(data =>{
      Toast(data.message || '操作失败')
    })
  },

  setContent(detail){
    if(!detail || !detail.content) return {};
    detail.content = detail.content.replace(/<img/gi, '<img style="max-width:100%;height:auto;float:left;display:block" ').replace(/<section/g, '<div').replace(/\/section>/g, '\div>');
    return detail;
  },

})
