
const appData = getApp().globalData;
function identityFilter(pageObj) {
    if (pageObj.onLoad) {
        let _onLoad = pageObj.onLoad;
        pageObj.onLoad = function () {
            appData.promise.then(() => {
                let pages = getCurrentPages();
                // console.log(pages,'pages')
                 //获取页面实例，防止this劫持
                 let currentInstance = getPageInstance();
                 _onLoad.call(currentInstance);
                 const whiteRoute = ['pages/index/index','pages/main/index'];
                 const specialRoute = ['pages/share/bind',]
                 if(whiteRoute.includes(currentInstance.route)){
                     wx.switchTab({url: "/pages/index/index"});
                 }
                //  else if(pages.includes(specialRoute)){
                    //  wx.navigateBack()
                    // wx.navigateTo({url: '/pages/share/bind?data=' + (currentInstance.options.data || '')})
                //  }
            },() => {
                //跳转到登录页
                wx.reLaunch({url: "/pages/login/index"});
            });
        }
    }
    return pageObj;
}



function getPageInstance() {
    var pages = getCurrentPages();
    return pages[pages.length - 1];

}
exports.promission = identityFilter;