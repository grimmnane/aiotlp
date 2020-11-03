//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js');
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

Page({
  data: {
    id:'',
    form:{
      name:'',
      address:'',
      area:'',
      typeId:'',
      typeName:'',
      plantSpecie:'',
    },
    typeList:[],
    isShowTypePopup:false,
    rules:{
      name:[
        {required:true,message:'请输入名称'}
      ],
      address:[
        {required:true,message:'请输入地址'}
      ],
      area:[
        {required:true,message:'请输入面积'},
        {pattern:'^[0-9]+$',attr:'g',message:'请输入合法的面积'},
      ],
      typeId:[
        {required:true,message:'请选择类型'}
      ],
      plantSpecie:[
        {required:true,message:'请输入当前种植/养殖'}
      ],

    }
  },
  onLoad(option) {
    this.getTypeList().then(()=>{
      this.data.id = option.id;
       if(this.data.id){
        this.getDetail(option.id)
        wx.setNavigationBarTitle({
          title: '修改'
        })
      } 
         
    })
  },
  onShow() {

  },
  getDetail(id){
    if(!id) return;
    Toast.loading({
      duration:0,
      forbidClick: true,
    });
    util.request('/sensor/web-area/getAreaById',{method:'GET',data:{areaId:id}}).then(res =>{
        let data = res.data || {};
        this.setForm(data);
    }).finally(()=>{
      Toast.clear();
    })
  },

  setForm(data){
    this.setData({
      'form.name':data.areaName || '',
      'form.address': data.areaAddress || '',
      'form.area': data.areaMianji || '',
      'form.typeId': data.areaTypeId || '',
      'form.typeName': data.areaTypeName || '',
      'form.plantSpecie': data.areaPurpose || '',
    })
    if(!this.data.form.typeName){
      let obj = this.data.typeList.find(item => item.id == this.data.form.typeId);
      if(obj){
        this.setData({'form.typeName': obj.text});
      }
    }
  },

  getTypeList(){
    return util.request('/sensor/web-area-type/getWebAreaTypeList',{method:'GET'}).then(res =>{
      let data = res.data || [];
      let list = data.map(item =>{
        return {
          text:item['区域类型'],
          id:item.id
        }
      })
      this.setData({typeList:list})
    })
  },

  changeName({detail}){
    this.setData({ 'form.name' : detail });
  },

  changeAddress({detail}){
    this.setData({ 'form.address' : detail });
  },

  changeArea({detail}){
    this.setData({ 'form.area' : detail });
  },

  changePlantSpecie({detail}){
    this.setData({ 'form.plantSpecie' : detail });
    console.log(this.data.form.plantSpecie,'1111')
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

  submit(){
    util.validate(this.data.form,this.data.rules).then(valid =>{
      if(valid){
        Toast.loading({
          duration:0,
          forbidClick: true,
        });
        // 调用接口
        let params = {
          id: this.data.id  || undefined,
          areaName: this.data.form.name,
          areaAddress: this.data.form.address,
          areaMianji : this.data.form.area,
          areaTypeId: this.data.form.typeId,
          areaPurpose: this.data.form.plantSpecie
        }
        console.log(params,'params')
        let url = this.data.id ? '/sensor/web-area/wxUpArea' : '/sensor/web-area/addWebArea'

        util.request(url,{method:'POST',data:params}).then(res =>{
          Dialog.alert({
            message:'操作成功',
          }).then(() => {
            wx.navigateBack()
          });
        }).catch(data =>{
          Toast(data.message || '操作失败')
        }).finally(()=>{
          Toast.clear();
        })
      }
    })
    .catch(message =>{
      Toast(message);
    })
  }
})
