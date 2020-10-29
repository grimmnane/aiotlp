//index.js
//获取应用实例
const app = getApp()
const util = require('../../../utils/util.js');
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';
import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';

Page({
  data: {
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
      typeId:[
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

  },
  
  onLoad: function () {
   
  },
  getTypeList(){
    return util.request('/sensor/web-sensor-type/getDataByPageSql',{method:'GET',data:{pageSize:10,pageNum:1}}).then(res =>{
      let data = res.data.rows || [];
      let list = data.map(item =>{
        return {
          text:item['类型名称'],
          id:item['主键']
        }
      })
      this.setData({typeList:list})
    })
    
  },

  scanQR(){
    wx.scanCode({
      success:(res)=>{
        let dataTemp = res.result || null;
        let data = {};
        try {
          if(dataTemp) data = JSON.parse(dataTemp);
        } catch (error) {
          let str = dataTemp.replace(/({|})/g,'').replace(/\n/gi,'').replace(/("|')/gi,'')
          let list = str.split(',');
          list.forEach(item =>{
            let [key,value] = item.split(':');
            data[key] = value;
          })
        }
        this.setForm(data);
      },
      fail:()=>{
        Toast('扫码失败，请重新扫描');
      }
    })
  },

  setForm(data = {}){
    this.setData({
      'form.typeId':data.typeId || '',
      'form.code': data.code || '',
      'form.name': data.name || '',
      'form.typeName': data.typeName || ''
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

  submit(){
    util.validate(this.data.form,this.data.rules).then(valid =>{
      if(valid){
        let params = {
          deviceId: this.data.code
        }
        if(!params.deviceId) return;
        util.request('/sensor/web-device/bindDevice',{method:'POST',data:params}).then(res =>{
          Toast(data.message || '操作成功');
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
        let id = this.data.code;
        if(!id) return;
        util.request('/sensor/web-device/unBindDevice',{method:'GET',data:{deviceId:id}}).then(res =>{
          Toast(data.message || '操作成功');
          this.getList();
        }).catch(data =>{
          Toast(data.message || '操作失败')
        })
    })
  },

  

})
