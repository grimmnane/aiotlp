//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js');
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
Page({
  data: {
    form:{
      name:'',
      address:'',
      area:'',
      type:'',
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
        {required:true,message:'请输入面积'}
      ],
      type:[
        {required:true,message:'请选择类型'}
      ],
      plantSpecie:[
        {required:true,message:'请输入当前种植/养殖'}
      ],

    }
  },
  onLoad(option) {
      console.log(option.query)
      this.init();
  },
  onShow() {
  },
  onChange(){

  },

  init(){
    this.getTypeList();
  },

  getTypeList(){
    util.request('/web-area-type/getWebAreaTypeList',{method:'GET'}).then(res =>{
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

  showTypePopup(flag = true){
    this.setData({ isShowTypePopup: flag });
  },
  cancelTypePopup(){
    this.showTypePopup(false);
  },
  selectedType({detail}){
    this.setData({'form.typeName': detail.value.text});
    this.showTypePopup(false);
  },

  submit(){
    util.validate(this.data.form,this.data.rules).then(valid =>{
      if(valid){
        // 调用接口
      }
    }).catch(message =>{
      Toast(message);
    })
  }
})
