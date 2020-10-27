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
      code:''
    },
    rules:{
      typeId:[
        {required:true,message:'请选择设备类型'}
      ],
      name:[
        {required:true,message:'请输入设备名称'}
      ],
      code:[
        {required:true,message:'请输入设备编码'}
      ],
    },
    isShowTypePopup:false,
    typeList:[],
    checked:false,
  },
  
  onShow() {
    this.getTypeList();
  },
  
  onLoad: function () {
   
  },
  getTypeList(){
    return util.request('/web-sensor-type/getDataByPageSql',{method:'GET',data:{pageSize:10,pageNum:1}}).then(res =>{
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
    util.validate(valid =>{
      if(valid){
        let params = {
          deviceId: this.data.deviceId
        }
        util.request('/web-device/bindDevice',{method:'POST',data:params}).then(res =>{
          Toast(data.message || '操作成功');
          this.getList();
        }).catch(data =>{
          Toast(data.message || '操作失败')
        })
      }
    }).catch(data =>{

    })
  },

  cancel(){
    Dialog.confirm({
      message: '是否确认解绑？',
    }).then(() => {
        let id = opt.currentTarget.dataset.id;
        if(!id) return;
        util.request('',{method:'GET',data:{id:id}}).then(res =>{
          Toast(data.message || '操作成功');
          this.getList();
        }).catch(data =>{
          Toast(data.message || '操作失败')
        })
    })
  }

})
