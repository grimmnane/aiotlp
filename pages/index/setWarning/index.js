//index.js
//获取应用实例
const app = getApp()
const util = require('../../../utils/util.js');
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';
import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';

Page({
  data: {
    form:{
      id:'',
      low:'',
      high:'',
      startDate:'',
      endDate:'',
    },
    currentDate:'',
    rules:{
      low:[
        {required:true,message:'请输入最低值'},
        {pattern:'^[0-9]+$',attr:'g',message:'请输入合法的数字'}
      ],
      high:[
        {required:true,message:'请输入最高值'},
        {pattern:'^[0-9]+$',attr:'g',message:'请输入合法的数字'}
      ],
      startDate:[
        {required:true,message:'请选择开始时间'}
      ],
      endDate:[
        {required:true,message:'请选择结束时间'}
      ],
    },
    typeList:[],
    isShowDate:false,
    type:'',
  },
  
  onShow() {

  },
  
  onLoad(option) {
    Toast.loading({
      duration:0,
      forbidClick: true,
      context:this
    });
    let id = option.id || '1310851269253914625',
      name = option.name || '默认传感器名称';
    wx.setNavigationBarTitle({
      title: `${name}`
    })
    this.setData({'form.id': id});
    this.getDetail(id);
   
  },

  // 查询详情
  getDetail(id){
    if(!id) return;
    util.request('/sensor/web-sensor/sensorWarnInfo',{method:'GET',data:{sensorId:id}}).then(res =>{
      this.setWarningData(res.data || {});
      Toast.clear();
    }).catch(()=>{
      Toast.clear();
    })
  },

  // 将中文key转为key
  setWarningData(detail){
    this.setData({
      'form.low': detail['最低值'],
      'form.high': detail['最高值'],
      'form.startDate': detail['开始时间'],
      'form.endDate': detail['结束时间'],
    })
  },

  // 显示时间面板
  showDatePopup(e){
    let typeName =  e.currentTarget.dataset.type;
    this.setData({type:typeName})
    this.setData({ isShowDate: true });
  },

  // 关闭时间面板
  cancelDate(){
    this.setData({ isShowDate: false });
  },

  // 选择时间
  selectedDate({detail}){
    this.setData({[`form.${this.data.type}`]: detail});
    this.cancelDate();
  },

  // 输入最低值
  changeLow({detail}){
    this.setData({ 'form.low' : detail });
  },

  // 输入最高值
  changeHigh({detail}){
    this.setData({ 'form.high' : detail });
  },

  // 提交数据
  submit(){
    util.validate(this.data.form,this.data.rules).then(valid =>{
      if(valid){
        let params = {
          id: this.data.form.id,
          warnMax: this.data.form.high,
          warnMin: this.data.form.low,
          warnStartTime: this.data.form.startDate,
          warnEndTime: this.data.form.endDate
        }
        if(!params.id) return;
        Toast.loading({
          duration:0,
          forbidClick: true,
          context:this
        });
        util.request('/sensor/web-sensor/upSensorWarn',{method:'POST',data:params}).then(res =>{
          Toast.clear();
          Dialog.alert({
            message: res.message || '操作成功',
          }).then(() => {
            wx.navigateBack()
          });
        }).catch(data =>{
          Toast.clear();
        })
      }
    }).catch(message =>{
      Toast(message);
    })
  },
  

})
