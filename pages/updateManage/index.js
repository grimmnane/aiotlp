//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js');
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

Page({
  data: {
    id:'', // 区域id
    form:{
      name:'', // 名称
      address:'', // 地址
      area:'', // 区域
      typeId:'', // 类型id
      typeName:'', // 类型名称
      plantSpecie:'', // 种植类型
    },
    typeList:[], // 类型列表
    isShowTypePopup:false, // 是否显示类型popup
    rules:{ // 验证规则
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
      showBtn:true , // 是否显示保存按钮 查看的时候没有保存按钮

    }
  },
  onLoad(option) {
    this.data.id = option.id || '';
    this.setData({showBtn:!option.edit || option.edit === '0' ? false : true});
  },
  onShow() {
    this.getTypeList().then(()=>{
      if(this.data.id){
       this.getDetail(this.data.id)
       let message = this.data.showBtn ? '修改' : '查看'
       wx.setNavigationBarTitle({ title: message})
     } 
   })
  },

  // 根据区域id查询详情
  getDetail(id){
    if(!id) return;
    Toast.loading({
      duration:0,
      forbidClick: true,
    });
    util.request('/sensor/web-area/getAreaById',{method:'GET',data:{areaId:id}}).then(res =>{
        let data = res.data || {};
        this.setForm(data);
        Toast.clear();
    }).catch(()=>{
      Toast.clear();
    })
  },

  // 将中文key转化为英文key
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

  // 获取类型列表
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

  // 输入名称
  changeName({detail}){
    this.setData({ 'form.name' : detail });
  },

  // 输入地址
  changeAddress({detail}){
    this.setData({ 'form.address' : detail });
  },

  // 根据经纬度获取当前地址
  getLocation(){
    wx.getLocation({
      success (res) {
        let data = {
          latitude: res.latitude,
          longitude: res.longitude
        }
        util.request('/sensor/web-area/getLoaction',{method:'GET', data: data}).then(res =>{
          let address = res.data || '';
          this.setData({ 'form.address' : address });          
        }).catch(data =>{
          Toast('位置获取失败')
        })
      }
    })
  },

  // 输入区域
  changeArea({detail}){
    this.setData({ 'form.area' : detail });
  },

  // 输入当前种植
  changePlantSpecie({detail}){
    this.setData({ 'form.plantSpecie' : detail });
    console.log(this.data.form.plantSpecie,'1111')
  },

  // 显示类型popup
  showTypePopup(flag = true){
    if(!this.data.showBtn) return;
    this.setData({ isShowTypePopup: flag });
  },

  // 关闭类型popup
  cancelTypePopup(){
    this.showTypePopup(false);
  },

  // 选择类型
  selectedType({detail}){
    this.setData({'form.typeName': detail.value.text});
    this.data.form.typeId = detail.value.id;
    this.showTypePopup(false);
  },

  // 提交
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
          Toast.clear();
          Dialog.alert({
            message:'操作成功',
          }).then(() => {
            wx.navigateBack()
          });
        }).catch(data =>{
          Toast.clear();
        })
      }
    })
    .catch(message =>{
      Toast(message);
    })
  }
})
