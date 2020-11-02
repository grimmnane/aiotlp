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
  onLoad: function (opt) {
    let id = opt.id || "";
    this.getDetail(id);
  },
  onShow() {
  },
  getDetail(id){
    if(!id) return;
    util.request('/message/web-message/getMessageInfo',{method:'GET',data:{id:id}}).then(res =>{
      let data = this.setContent(res.data);
      this.setData({detail:data});
    }).catch(data =>{
      Toast(data.message || '操作失败')
    })
  },

  setContent(detail){
    if(!detail || !detail.message) return {};
    detail.message = detail.message.replace(/<img/gi, '<img style="max-width:100%;height:auto;float:left;display:block" ').replace(/<section/g, '<div').replace(/\/section>/g, '\div>');
    return detail;
  },

})
