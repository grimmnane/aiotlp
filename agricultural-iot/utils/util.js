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
      wx.request({
          url: `${global.host}${url}`,
          method: options.method,
          data: options.method === 'GET' ? options.data : options.data,
          header: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              'token': global.token,
          },
          success(request) {
              if (request.data.success) {
                  resolve(request.data)
              } else {
                  reject(request.data)
              }
          },
          fail(error) {
              reject(error.data)
          }
      })
  })
}

module.exports = {
  formatTime: formatTime,
  validate,
  request
}
