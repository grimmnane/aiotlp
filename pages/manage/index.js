//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js');
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';


Page({
  data: {
    list:[
      {
        id:1,
        name:'222',
      }
    ]
  },
  onLoad: function () {
      this.getList();
  },

  getList(){
    util.request('/web-area/areaList',{method:'GET'}).then(res =>{
      let data = res.data || [];
      this.setData({list:data});
      this.getList();
    }).catch(data =>{
      Toast(data.message || '操作失败')
    })
  },

  append(){
    this.toUpdatePage();
  },  

  toUpdatePage(id = '111'){
    let url = `/pages/updateManage/index${id ? '?id=' + id : ''}`
    wx.navigateTo({
      url: url,
    })
  },
  edit(opt){
    let id = opt.currentTarget.dataset.id;
    this.toUpdatePage(id);
  },

  remove(opt){
    Dialog.confirm({
      message: '是否确认删除？',
    }).then(() => {
        // 调用删除接口
        let id = opt.currentTarget.dataset.id;
        if(!id) return;
        util.request('',{method:'GET',data:{id:id}}).then(res =>{
          Toast(data.message || '操作成功');
          this.getList();
        }).catch(data =>{
          Toast(data.message || '操作失败')
        })
    })
  }
 
})
