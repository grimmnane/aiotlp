const global = require("./global")
const app = getApp()

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function validate(form,rules){
  let currentRules,item,flag = true;// 是否是必填项
  return new Promise((resolve,reject) =>{
    if(!form || !rules) reject('配置有误，请输入表单或者验证规则！');
    for(let [key,value] of Object.entries(form)){
      currentRules = rules[key];
      if(!currentRules) continue;
      for(let i = 0 ,len = currentRules.length; i<len ; i++){
        item = currentRules[i];
        if(item.required){
          if(!value){
            flag = false;
          } 
        }
        if(item.pattern){
          if(value){
            let reg = new RegExp(item.pattern,item.attr)
            if(!reg.test(value)){
              flag = false;
            } 
          }
        }
        if(!flag){
          reject(item.message);
        }
      }
    }
    flag ? resolve(true) : null;
  })
}

const request = (url, options) => {
  return new Promise((resolve, reject) => {
    let token  = app.globalData.token || wx.getStorageSync('token');
      wx.request({
          url: `${global.host}${url}`,
          method: options.method,
          data: options.method === 'GET' ? options.data : options.data,
          header: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              'token': token
          },
          success(request) {
              if (request.data.success) {
                resolve(request.data)
              }else {
                if(request.data.code == '10001' || request.data.code == '10002'){
                  wx.showToast({
                    title: '登陆过期，请重新登陆！',
                    mask:true,
                    icon:'none',
                    duration: 2000,
                    complete:()=>{
                      setTimeout(() => {
                        wx.reLaunch({url:'/pages/login/index'});
                      }, 2000);
                    }
                  })
                }else{
                  wx.showToast({
                    title: request.data.message || '操作失败',
                    mask:true,
                    icon:'none',
                    duration: 2000,
                    complete:()=>{
                      reject(request.data)
                    }
                  })
                }
              }
          },
          fail(error){
            wx.showToast({
              title: error.errMsg || '网络错误',
              mask:true,
              icon:'none',
              duration: 2000,
            })
          }
      })
  })
}

module.exports = {
  formatTime: formatTime,
  validate,
  request
}
