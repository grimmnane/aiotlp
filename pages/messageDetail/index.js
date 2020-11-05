//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js');
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

Page({
  data: {
    id:'',
    detail:{}

  },
  onLoad: function (opt) {
    this.data.id = opt.id || "";
    this.getDetail(this.data.id);
  },
  onShow() {
  },
  getDetail(id){
    if(!id) return;
    Toast.loading({
      duration:0,
      forbidClick: true,
    });
    util.request('/message/web-message/getMessageInfo',{method:'GET',data:{id:id}}).then(res =>{
      let data = this.setContent(res.data);
      this.setData({detail:data});
      Toast.clear();
    }).catch(data =>{
      Toast.clear();
    })
  },

  setContent(detail){
    if(!detail || !detail.message) return {};
    detail.message = detail.message.replace(/<img/gi, '<img style="max-width:100%;height:auto;float:left;display:block" ').replace(/<section/g, '<div').replace(/\/section>/g, '\div>');
    return detail;
  },

})
