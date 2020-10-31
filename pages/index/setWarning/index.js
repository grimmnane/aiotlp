//index.js
//获取应用实例
const app = getApp()
const util = require('../../../utils/util.js');
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';
import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';

Page({
  data: {
    form:{
      low:'',
      high:'',
      startDate:'',
      endDate:'',
    },
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
    // this.getTypeList();

  },
  
  onLoad(option) {
    let id = option.id,
      name = option.name || '默认传感器名称';
    wx.setNavigationBarTitle({
      title: `${name}`
    })
   
  },
  // getTypeList(){
  //   return util.request('/sensor/web-sensor-type/getDataByPageSql',{method:'GET',data:{pageSize:10,pageNum:1}}).then(res =>{
  //     let data = res.data.rows || [];
  //     let list = data.map(item =>{
  //       return {
  //         text:item['类型名称'],
  //         id:item['主键']
  //       }
  //     })
  //     this.setData({typeList:list})
  //   })
  // },

  showDatePopup(e){
    let typeName =  e.currentTarget.dataset.type;
    this.setData({type:typeName})
    this.setData({ isShowDate: true });
  },

  cancelDate(){
    this.setData({ isShowDate: false });
  },

  selectedDate({detail}){
    let date = new Date(detail);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let result = `${year}-${month >= 10 ? month : '0' + month}-${day >= 10 ? day : '0' + day}`;
    this.setData({[`form.${this.data.type}`]: result});
    this.cancelDate();
  },

  changeLow({detail}){
    this.setData({ 'form.low' : detail });
  },
  changeHigh({detail}){
    this.setData({ 'form.high' : detail });
  },

  submit(){
    util.validate(this.data.form,this.data.rules).then(valid =>{
      if(valid){
        let params = {
          deviceId: this.data.code
        }
        if(!params.deviceId) return;
        util.request('/sensor/web-device/bindDevice',{method:'POST',data:params}).then(res =>{
          Toast(data.message || '操作成功');
        }).catch(data =>{
          Toast(data.message || '操作失败')
        })
      }
    }).catch(message =>{
      Toast(message);
    })
  },
  

})
