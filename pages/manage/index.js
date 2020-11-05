//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js');
const p = require('../../utils/promission.js')
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';


Page(p.promission({
  data: {
    list:[],
    isLoaded:false,
  },
  onLoad: function () {
  },
  onShow(){
    this.getTabBar().setData({ active: 1})
    this.getList();
  },
  getList(){
    Toast.loading({
      duration:0,
      forbidClick: true,
    });
    this.setData({isLoaded:false})
    util.request('/sensor/web-area/areaList',{method:'GET'}).then(res =>{
      let data = this.setList(res.data || []);
      this.setData({list:data});
    }).catch(data =>{
      Toast(data.message || '操作失败')
    }).finally(()=>{
      this.setData({isLoaded:true})
      Toast.clear();
    })
  },

  setList(list){
    return list.map(item =>{
      item.areaName = item['区域名称'];
      item.areaTypeId = item['区域类型id']
      item.areaTypeName = item['区域类型名']
      item.areaPurpose = item['用途']
      return item;
    })
  },

  append(){
    this.toUpdatePage();
  },  

  toUpdatePage(id){
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
        let id = opt.currentTarget.dataset.id;
        if(!id) return;
        util.request('/sensor/web-area/delWebArea',{method:'POST',data:{id:id}}).then(res =>{
          Toast(res.message || '操作成功');
          this.getList();
        }).catch(data =>{
          Toast(data.message || '操作失败')
        })
    })
  }
}))
