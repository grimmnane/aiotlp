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
    isLoaded:false, // 是否已加载完毕
    pagination:{ // 分页参数
      pageSize:20,
      pageNum:1,
      isLastPage:false
    }
  },
 
  onLoad(){
    this.getList();
  },
  onShow() {
    this.getTabBar().setData({ active: 2});
  },

  // 顶部下拉刷新
  onPullDownRefresh(){
    this.setData({list:[]});
    this.data.pagination.pageNum = 1;
    this.data.pagination.isLastPage = false;
    this.getList().then(()  =>{
      wx.stopPullDownRefresh();
    })
  },

  // 上拉加载
  onReachBottom(){
    if(!this.data.pagination.isLastPage){
      this.data.pagination.pageNum++;
      this.getList()
    }
  },

  // 获取列表信息
  getList(){
    Toast.loading({
      duration:0,
      forbidClick: true,
    });
    let params = {
      pageNum: this.data.pagination.pageNum,
      pageSize: this.data.pagination.pageSize,
    }
    this.setData({isLoaded:false})
    return util.request('/message/web-message/getUsrMessage',{method:'GET',data:params}).then(res =>{
      if(!this.data.pagination.isLastPage){
        let data = this.data.list.concat(this.setItem(res.data.rows || []));
        this.setData({list:data});
      }
      this.data.pagination.isLastPage = res.data.current < res.data.pages ? false : true;
      Toast.clear();
    }).catch(() =>{
      Toast.clear();
    })
  },

  // 将中文key转化为英文key
  setItem(list){
    return list.map(item =>{
      item.date = item['时间'];
      item.type = item['消息类型'];
      item.title = item['消息标题'];
      item.id = item['ID'];
      return item;
    })
  },

  // 去详情页面
  toDetailPage(opt) {
    let id = opt.currentTarget.dataset.id || '';
    wx.navigateTo({
      url: '/pages/messageDetail/index?id=' + id
    })
  },
}))
