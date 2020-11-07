//index.js
const app = getApp()
const util = require('../../utils/util.js');
const p = require('../../utils/promission.js')
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

Page(p.promission({
  data: {
    toast:null,
    autoplay:true,
    bannerMode:'scaleToFill',
    bannerList:[{path:'http://5b0988e595225.cdn.sohucs.com/images/20190126/a8fb75821fad40c09a695e2b5a2ad8a9.jpeg'},{path:'https://www.69agri.com/wp-content/uploads/2019/12/cbae94b34913418393d860138c33f73c.jpg'}],
    interval:2000,
    duration:500,
    deviceLoaded:false, 
    deviceList:[], 
    areaList:[],
    areaLoading:false,
    allSensorCount:0, // 所有区域下的传感器总数
    checkedSensorIds:[], // 选中的传感器id
    sensorIds:[], // 传感器id
    sensorData:{}, // 传感器数据分区域
    deviceHidden:false,
    allChecked:false,
    showShare:false, // 是否要分享
    choseShare: false, // 分享面板
    options: [
      { name: '微信', icon: 'wechat', openType: 'share' },
      { name: '复制链接', icon: 'link' },
      { name: '二维码', icon: 'qrcode' },
    ],
  },

  onLoad() {
    Toast.loading({
      duration:0,
      forbidClick: true
    });
    this.getSensorData = util.throttle(this._getSensorData, 2 * 60 * 1000,true);
    
    this.getTabBar().setData({ active: 0})
    this.getDeviceList();
    this.getAreaList();
  },

  onShow() {
   
  },
 
  onUnload(){
    this.getSensorData.cancel();
  },  

  getDeviceList(){
    util.request('/sensor/web-device/myDeviceList',{method:'GET'}).then(res =>{
      let data = this.setList(res.data || []);
      this.setData({deviceList:data,deviceLoaded:true});
      // Toast.clear();
    }).catch(()=>{
      this.setData({deviceLoaded:true})
      Toast.clear();
    })
  },

  setList(list = []){
    return list.map(item =>{
      item.name = item['设备名称'] || '';
      item.battery = item['电量'] || '';
      item.id = item['主键'] || '';
      item.code = item['设备编号'] || '';
      item.typeName = item['设备类型名'] || '';
      return item;
    })
  },

  toggleDeviceHidden(){
    let result = !this.data.deviceHidden
    this.setData({deviceHidden: result})
  },

  toggleShare(){
    let result = !this.data.showShare;
    this.setData({showShare:result});
  },

  cancelShare(){
    Dialog.confirm({
      message: '是否确认取消分享？',
    }).then(() => {
      this.toggleShare();
      this.toggleAllChecked(false);
    })
  },

  getAreaList(){
    this.setData({areaLoading:true})
    util.request('/sensor/web-area/areaListInfo',{method:'GET',data:{flag:'1',boundUserId:'',userId:''}}).then(res =>{
      let count = 0;
      let data = this.setAreaList(res.data || [],(item)=>{
        count += item.list.length - 0 ;
      });
      this.setData({areaList:data});
      this.setData({allSensorCount:count})
      this.getSensorData();
      this.setData({areaLoading:false})
      Toast.clear();
    }).catch(()=>{
      this.setData({areaLoading:false})
      Toast.clear();
    })
  },

  setSensorCount(){
    
  },

  setAreaList(list,fn){
    return list.map(item =>{
      item.areaId = item['区域Id'];
      item.areaName = item['区域名'];
      item.isShow = true;
      item.isChecked = false;
      item.list = (item['传感器列表'] || []).map(sub =>{
        sub.sensorId = sub['传感器ID'];
        sub.url = sub['传感器类型图标'];
        sub.sensorName = sub['传感器名称'];
        sub.deviceName = sub['设备名称'];
        sub.deviceTypeName = sub['设备类型'];
        sub.isChecked = false;
        return sub;
      })
      fn ? fn(item) : null;
      return item;
    })
  },

  _getSensorData(){
    let idList = [];
    this.data.areaList.forEach(item => {
      idList = idList.concat(item.list.map(s => s.sensorId));
    })
    util.request('/data/web-data/sensorData',{method:'GET',data:{sensorIds:idList.join(',')}}).then(res =>{
      this.concatSensorData(this.setSensorResultData(res.data || []));
    }).catch(()=>{
    })
  },

  setSensorResultData(list){
    return list.map(item =>{
      item.areaId = item['区域Id'] || '0'
      item.sensorId = item['传感器ID'];
      item.status = item['状态'];
      item.date = item['时间'];
      item.deviceData = item['设备数据'];
      item.unitNameCN = item['单位CN'];
      item.unitNameEN = item['单位EN'];
      return item;
    })
  },

  concatSensorData(list){
    for(let i = 0,len = list.length; i<len; i++){
      let sensor  = list[i];
      for(let j = 0,_len = this.data.areaList.length; j<_len ; j++){
        let area = this.data.areaList[j];
        // if(sensor.areaId != area.areaId) continue; // 区域id不准有时差
        let index = area.list.findIndex(a => a.sensorId == sensor.sensorId);
        if(index == -1) continue;
        let tempObj = this.data.areaList[i].list[index];
        console.log(tempObj,'tempObj');
        tempObj.unitNameCN = sensor.unitNameCN;
        tempObj.unitNameEN = sensor.unitNameEN;
        tempObj.deviceData = sensor.deviceData;
        tempObj.date = sensor.date;
        this.setData({[`areaList[${i}].list[${index}]`] : tempObj})
      }
    }
  },

  toggleShowItem(e){
    let index = e.currentTarget.dataset.index;
    let value = this.data.areaList[index].isShow;
    this.setData({[`areaList[${index}].isShow`]: !value});
  },

  onChange({detail,target}){
    let type = target.dataset.type,
        currentIndex = target.dataset.index || 0,
        parentIndex = target.dataset.parentindex || 0;
    if(type == 1){ // 父节点
      this.setData({[`areaList[${currentIndex}].isChecked`] : detail});
      let list = this.data.areaList[currentIndex].list;
      list.forEach((item,index) =>{
        this.setData({[`areaList[${currentIndex}].list[${index}].isChecked`] : detail});
      })
    }else{
      this.setData({[`areaList[${parentIndex}].list[${currentIndex}].isChecked`] : detail});
      let flag = this.data.areaList[parentIndex].list.every(item => item.isChecked);
      this.setData({[`areaList[${parentIndex}].isChecked`] : flag});
    }
    let allCheckFlag = this.isAllChecked(this.data.areaList);
    this.setData({allChecked:allCheckFlag})
    this.setCheckedSensorIds();
  },

  isAllChecked(list = []){
      let flag = list.some(item => !(item.list.length ? item.list.some(c => !c.isChecked) : true))
      return flag;
  },

  changeAllChecked({detail}){
    this.setData({'allChecked': detail});
    this.toggleAllChecked(detail);
    this.setCheckedSensorIds();
  },
  
  toggleAllChecked(flag){
    this.data.areaList.forEach((item,index) =>{
      this.setData({[`areaList[${index}].isChecked`]: flag});
      (item.list || []).forEach((sub,_index) => {
        this.setData({[`areaList[${index}].list[${_index}].isChecked`]: flag});
      })
    })
  },

  setCheckedSensorIds(){
    let result = [];
    this.data.areaList.forEach(item =>{
      result = result.concat((item.list || []).map(c => c.isChecked ? c.sensorId : '').filter(c => c));
    })
    this.setData({checkedSensorIds:result})
  },

  toAddPage(){
    wx.navigateTo({url: '/pages/index/addDevice/index'})
  },

  toDetailPage(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({url: `/pages/sensorChart/index?id=${id}&from=1`});
  },

  openShare(event) {
    this.setData({ choseShare: true });
  },
  closeShare() {
    this.setData({ choseShare: false });
  },
  selectShare(){
    this.closeShare()
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      // console.log(res.target)
    }
    return {
      title: '自定义转发标题',
      path: '/page/index/index?id=123'
    }
  },

  toDeviceDetailPage(opt){
    let code = opt.currentTarget.dataset.code;
    wx.navigateTo({url: '/pages/index/addDevice/index?code=' + code})
  },

}))