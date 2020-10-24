const userInfo = {};

// 接口host
function getHost(){
    return "http://10.10.10.152:1001";
}

// 获取用户信息
function getUserInfo(){
    return userInfo;
}



//
module.exports = {
    getHost: getHost,
    getUserInfo: getUserInfo,
}