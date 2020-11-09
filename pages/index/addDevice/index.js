//index.js
//获取应用实例
const app = getApp()
const util = require('../../../utils/util.js');
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';
import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';

Page({
  data: {
    code:'', // 页面传来的code
    isShow:false, // 是否显示解绑按钮
    isDisabled:false, // 扫码之后不能修改
    inputDisabled:true, // 输入之后类型和名称不能改
    deviceId:'',
    form:{
      typeName:'',
      typeId:'',
      name:'',
      code:'',
      checked:false,
    },
    rules:{
      code:[
        {required:true,message:'请输入设备编码'}
      ],
      name:[
        {required:true,message:'请输入设备名称'}
      ],
      typeName:[
        {required:true,message:'请选择设备类型'}
      ],
      checked:[
        {required:true,message:'请同意服务条款'}
      ],
      
    },
    isShowTypePopup:false,
    typeList:[],
  },
  
  onShow() {
    Toast.loading({
      duration:0,
      forbidClick: true,
      context:this
    });
    if(this.data.code){
      wx.setNavigationBarTitle({title: '解绑设备'})
      this.getDetailByCode(this.data.code);
      this.setData({isDisabled:true,isShow:true,'form.checked':true})
    }else{
      this.getTypeList()
    }
  },
  
  onLoad: function (opt) {
      this.data.code = opt.code || '';
  },
  getTypeList(){
    return util.request('/sensor/web-device-type/getDeviceTypeList',{method:'GET'}).then(res =>{
      let data = res.data || [];
      let list = data.map(item => item.text = item['设备类型名'])
      Toast.clear();
      this.setData({typeList:list})
    }).catch(()=>{
      Toast.clear();
    })
  },

  scanQR(){
    wx.scanCode({
      success:(res)=>{
        this.setData({isDisabled:true})
        let data = res.result || ''; // 返回的是code
        this.getDetailByCode(data);
      },
      fail:()=>{
        // Toast('扫码失败，请重新扫描');
        this.setData({isDisabled:false})
      }
    })
  },

  getDetailByCode(code){
    if(!code) return;
    return util.request('/sensor/web-device/myDeviceInfo',{method:'GET',data:{deviceCode:code}}).then(res =>{
      let detail = res.data || {};
      this.setForm(detail)
      Toast.clear();
    }).catch(data =>{
      this.setData({
        'form.name': '',
        'form.typeName': ''
      })
      Toast.clear();
    })
  },

  setForm(detail){
    this.data.deviceId = detail['主键'] || '';
    detail.name = detail['设备名称'] || '';
    detail.code = detail['设备编号'] || '';
    detail.typeName = detail['设备类型名'] || '';
    this.setData({
      'form.code': detail.code || '',
      'form.name': detail.name || '',
      'form.typeName': detail.typeName || ''
    })
  },

  showTypePopup(flag = true){
    if(this.data.isDisabled || this.data.inputDisabled) return ;
    this.setData({ isShowTypePopup: flag });
  },
  cancelTypePopup(){
    this.showTypePopup(false);
  },
  selectedType({detail}){
    this.setData({'form.typeName': detail.value.text});
    this.data.form.typeId = detail.value.id;
    this.showTypePopup(false);
  },
  changeName({detail}){
    this.setData({ 'form.name' : detail });
  },
  changeCode({detail}){
    console.log(detail,4444)
    let value = detail.value || '';
    this.setData({ 'form.code' : detail.value });
    if(value){
      this.getDetailByCode(value).then(()=>{
        this.setData({inputDisabled: true})
      })
    }
    
  },
  changeCheckbox({detail}){
    this.setData({'form.checked':detail})
  },
  submit(){
    util.validate(this.data.form,this.data.rules).then(valid =>{
      if(valid){
        let params = {
          deviceId: this.data.deviceId
        }
        if(!params.deviceId) return;
        Toast.loading({
          duration:0,
          forbidClick: true,
          context:this
        });
        util.request('/sensor/web-device/bindDevice',{method:'POST',data:params}).then(res =>{
          Toast.clear();
          Dialog.alert({
            message: res.message || '操作成功',
          }).then(() => {
            wx.navigateBack()
          });
        }).catch(() =>{
          Toast.clear();
        })
      }
    }).catch(message =>{
      Toast(message);
    })
  },

  cancel(){
    Dialog.confirm({
      message: '是否确认解绑？',
    }).then(() => {
        let id = this.data.deviceId;
        if(!id) return;
        Toast.loading({
          duration:0,
          forbidClick: true,
          context:this
        });
        util.request('/sensor/web-device/unBindDevice',{method:'POST',data:{deviceId:id}}).then(res =>{
          Toast.clear();
          Dialog.alert({
            message: res.message || '操作成功',
          }).then(() => {
            wx.navigateBack()
          });
        }).catch(()=>{
          Toast.clear();
        })
    })
  },

  

})
