//index.js
const app = getApp()
const util = require('../../utils/util.js');
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

Component({
  properties:{
    showCheckbox:{
      type: Boolean,
      value:false,
    },
    from:{
      type:String,
      value: '1' // 1首页  2: 我的共享
    },
    shareUserId:{
      type:String,
      value:''
    },
    bindUserId:{
      type:String,
      value:'',
    }
  },
  options: {
    addGlobalClass: true
  },
  data: {
    areaList:[],
    areaLoading:false,
    allSensorCount:0, // 所有区域下的传感器总数
    sensorIds:[], // 传感器id
    sensorData:{}, // 传感器数据分区域
    allChecked:false,
    bindUserId:'', // 绑定用户id
    shareUserId:'', // 分享用户id
  },
  pageLifetimes: { // 父页面的生命周期
    show() { 
      this.getAreaList();
    },
  },
  lifetimes: {  // 当前组件的生命周期
    attached(){
      // 传感器信息每2分钟请求一次
      this.getSensorData = util.throttle(this._getSensorData.bind(this), 2 * 60 * 1000,true);
    },
    detached(){
      // 移除定时器
      this.getSensorData ? this.getSensorData.cancel() : null;
    }
  },
  observers:{
    'showCheckbox'(val){ // 监听checkbox，为false的时候去除选择
      if(!val){
        this.setData({'allChecked': false,checkedSensorIds:[]});
        this.toggleAllChecked(false);
      }
    }
  },

  methods:{
    // 获取区域列表
    getAreaList(){
      this.setData({areaLoading:true})
      let params = {
        flag: this.properties.from ,
        boundUserId: this.properties.bindUserId,
        userId: this.properties.shareUserId,
      }
      util.request('/sensor/web-area/areaListInfo',{method:'GET',data:params}).then(res =>{
        let count = 0;
        let data = this.setAreaList(res.data || [],(item)=>{
          count += item.list.length - 0 ;
        });
        this.triggerEvent('count', count)
        this.setData({areaList:data});
        this.getSensorData();
        this.setData({areaLoading:false})
        Toast.clear();
      }).catch(()=>{
        this.setData({areaLoading:false})
        Toast.clear();
      })
    },
  
    // 讲中文key转为英文key
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
    
    // 获取传感器的数据
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
    
    // 将中文key转化为英文key
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
  
    // 将传感器数据和区域数据合并
    concatSensorData(list){
      for(let i = 0,len = list.length; i<len; i++){
        let sensor  = list[i];
        for(let j = 0,_len = this.data.areaList.length; j<_len ; j++){
          let area = this.data.areaList[j];
          let index = area.list.findIndex(a => a.sensorId == sensor.sensorId);
          if(index == -1) continue;
          let tempObj = this.data.areaList[i].list[index];
          tempObj.unitNameCN = sensor.unitNameCN;
          tempObj.unitNameEN = sensor.unitNameEN;
          tempObj.deviceData = sensor.deviceData;
          tempObj.date = sensor.date;
          this.setData({[`areaList[${i}].list[${index}]`] : tempObj})
        }
      }
    },
    
    // 隐藏显示区域内容
    toggleShowItem(e){
      let index = e.currentTarget.dataset.index;
      let value = this.data.areaList[index].isShow;
      this.setData({[`areaList[${index}].isShow`]: !value});
    },
    
    // 勾选区域的checkbox
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
    
    // 判断是否全部勾选
    isAllChecked(list = []){
        let flag = list.some(item => !(item.list.length ? item.list.some(c => !c.isChecked) : true))
        return flag;
    },
    
    // 切换全选/非全选
    changeAllChecked({detail}){
      this.setData({'allChecked': detail});
      this.toggleAllChecked(detail);
      this.setCheckedSensorIds();
    },
    
    // 选择/非全选的方法
    toggleAllChecked(flag){
      this.data.areaList.forEach((item,index) =>{
        this.setData({[`areaList[${index}].isChecked`]: flag});
        (item.list || []).forEach((sub,_index) => {
          this.setData({[`areaList[${index}].list[${_index}].isChecked`]: flag});
        })
      })
    },
    
    // 设置已经勾选的传感器id
    setCheckedSensorIds(){
      let result = [];
      this.data.areaList.forEach(item =>{
        result = result.concat((item.list || []).map(c => c.isChecked ? c.sensorId : '').filter(c => c));
      })
      this.setData({checkedSensorIds:result})
    },
    
    
    // 去详情页面
    toDetailPage(e){
      let id = e.currentTarget.dataset.id;
      let unitName = e.currentTarget.dataset.unitname || 'ppm';
      wx.setStorageSync('unitName',unitName);
      this.triggerEvent('detail', {id:id})
    },

    // 去分享
    openShare(){
      this.triggerEvent('share', this.data.checkedSensorIds)
    }
  }
})