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
    this.getTypeList();
    if(this.data.code) this.getDetailByCode(this.data.code);

  },
  
  onLoad: function (opt) {
      this.data.code = opt.code || '';
      console.log(this.data.code,44444)
  },
  getTypeList(){
    return util.request('/sensor/web-device-type/getDeviceTypeList',{method:'GET'}).then(res =>{
      let data = res.data || [];
      let list = data.map(item =>{
        return {
          text:item['设备类型名'],
        }
      })
      console.log(list,'list')
      this.setData({typeList:list})
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
        Toast('扫码失败，请重新扫描');
        this.setData({isDisabled:false})
      }
    })
  },

  getDetailByCode(code){
    if(!code) return;
    util.request('/sensor/web-device/myDeviceInfo',{method:'GET',data:{deviceCode:code}}).then(res =>{
      let detail = res.data || {};
      this.setForm(detail)
    }).catch(data =>{
      Toast(data.message || '操作失败')
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
    this.setData({ 'form.code' : detail });
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
        util.request('/sensor/web-device/bindDevice',{method:'POST',data:params}).then(res =>{
          Toast(res.message || '操作成功');
          this.getList();
        }).catch(data =>{
          Toast(data.message || '操作失败')
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
        util.request('/sensor/web-device/unBindDevice',{method:'POST',data:{deviceId:id}}).then(res =>{
          Toast(data.message || '操作成功');
          this.getList();
        }).catch(data =>{
          Toast(data.message || '操作失败')
        })
    })
  },

  

})
