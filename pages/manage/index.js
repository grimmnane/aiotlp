//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js');
const p = require('../../utils/promission.js')
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';


Page(p.promission({
  data: {
    list:[], // 列表
    isLoaded:false, // 是否已经加载完毕
    isIphoneX:false, // 是不是iphonex
  },
  onLoad: function () {
    //  适配分享按钮在 x 机型上的定位问题
    let model = app.globalData.sysInfo.model;
    if(model.indexOf("iPhone X") != -1 ){
      this.setData({
        isIphoneX: true
      });
    }
  },
  onShow(){
    this.getTabBar().setData({ active: 1})
    this.getList();
  },
  // 获取列表
  getList(){
    Toast.loading({
      duration:0,
      forbidClick: true,
    });
    this.setData({isLoaded:false})
    util.request('/sensor/web-area/areaList',{method:'GET'}).then(res =>{
      let data = this.setList(res.data || []);
      this.setData({list:data});
      Toast.clear();
    }).catch(data =>{
      Toast.clear();
    })
  },

  // 将中文key转化为英文key
  setList(list){
    return list.map(item =>{
      item.areaName = item['区域名称'];
      item.areaTypeId = item['区域类型id']
      item.areaTypeName = item['区域类型名']
      item.areaPurpose = item['用途']
      return item;
    })
  },

  // 新增区域
  append(){
    this.toUpdatePage();
  },  

  // 跳转页面
  toUpdatePage(id,showEditBtn = 1){
    let url = `/pages/updateManage/index?id=${id ? id : ''}&edit=${showEditBtn}`
    wx.navigateTo({url: url})
  },

  // 编辑区域
  edit(opt){
    let id = opt.currentTarget.dataset.id;
    this.toUpdatePage(id);
  },

  // 去详情页面
  toDetailPage(opt){
    let id = opt.currentTarget.dataset.id;
    this.toUpdatePage(id,0);
  },

  // 删除
  remove(opt){
    Dialog.confirm({
      message: '是否确认删除？',
    }).then(() => {
        let id = opt.currentTarget.dataset.id;
        if(!id) return;
        util.request('/sensor/web-area/delWebArea',{method:'POST',data:{id:id}}).then(res =>{
          Toast(res.message || '操作成功');
          this.getList();
        }).catch(data =>{
        })
    })
  }
}))
