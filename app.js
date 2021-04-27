// app.js
App({
  onLaunch() {
    wx.cloud.init({
      env: "apartment-management-3b24d52adb0",
      traceUser: true
    });
  },
  getCurrentUserOpenid:function(){
    var that=this;
    return new Promise(function(resolve,reject){
      wx.cloud.callFunction({
        name:'getOpenid'
      }).then(res=>{
        that.globalData.userOpenid=res.result.OPENID
        console.log(1)
        resolve(res)
      })
    })
  },
  globalData:{
    userOpenid:"",
    status:"none",
    room:"",
    card:{},
    name:"",
    startDate:"",
    deposit:"",
    startWater:"",
    startElect:"",
    contracts:[]
  }
})

// getAuthKey: function () {
//   var that = this;
//   return new Promise(function (resolve, reject) {
//       // 调用登录接口
//       wx.login({
//         success: function (res) {
//           if (res.code) {
//             that.globalData.code = res.code;
//             //调用登录接口
//             wx.getUserInfo({
//               withCredentials: true,
//               success: function (res) {
//                 that.globalData.UserRes = res;
//                 that.globalData.userInfo = res.userInfo;
//                 that.func.postReq('/api/v1/image/oauth', {
//                   code: that.globalData.code,
//                   signature: that.globalData.UserRes.signature,
//                   encryptedData: that.globalData.UserRes.encryptedData,
//                   rawData: that.globalData.UserRes.rawData,
//                   iv: that.globalData.UserRes.iv
//                 }, 
//                 function (res) {
//                   wx.setStorage({
//                     key: "auth_key",
//                     data: res.data.auth_key
//                   })
//                   var res = {
//                     status: 200,
//                     data: res.data.auth_key
//                   }
//                   resolve(res);
                  
//                 })
//               }
//             })
//           } else {
//             console.log('获取用户登录态失败！' + res.errMsg);
//             var res = {
//               status: 300,
//               data: '错误'
//             }
//             reject('error');
//           }  
//         }
//       })
//   });

