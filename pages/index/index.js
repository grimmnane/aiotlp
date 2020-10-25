//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    autoplay:true,
    bannerMode:'scaleToFill',
    bannerList:[{path:'http://5b0988e595225.cdn.sohucs.com/images/20190126/a8fb75821fad40c09a695e2b5a2ad8a9.jpeg'},{path:'https://www.69agri.com/wp-content/uploads/2019/12/cbae94b34913418393d860138c33f73c.jpg'}],
    interval:2000,
    duration:500,
    deviceList:[
      {
        path:'http://5b0988e595225.cdn.sohucs.com/images/20190126/a8fb75821fad40c09a695e2b5a2ad8a9.jpeg'
      }
    ],
    areaList:[
      {path:'https://www.69agri.com/wp-content/uploads/2019/12/cbae94b34913418393d860138c33f73c.jpg'}
    ],
    deviceHidden:false,
  },
  
  onShow() {
		this.getTabBar().init();
  },
  
  onLoad: function () {
   
  },

  toggleDeviceHidden(){
    let result = !this.data.deviceHidden
    this.setData({deviceHidden: result})
  }

})
