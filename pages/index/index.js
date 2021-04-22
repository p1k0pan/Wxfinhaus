const db=wx.cloud.database().collection("User")
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
    userOpenid:"",
    hasRoom:false,
    status:"none"
  },
  jumpFix:function(){
    if(app.globalData.hasRoom){
      wx.navigateTo({
        url: '/pages/fix/fix',
      })
    }
    else{
      wx.showToast({
        title: '您还没有入住',
        icon: 'error',
        mask: false,
        success: (res) => {},
        fail: (res) => {},
        complete: (res) => {},
      })
    }
  },
  jumpRegist:function(){
    if(app.globalData.status=="none"){
      wx.navigateTo({
        url: '/pages/regist/regist',
      })
    }
    else if(app.globalData.status=="living"){
      wx.showToast({
        title: '您已入住',
        icon: 'error',
        mask: false,
        success: (res) => {},
        fail: (res) => {},
        complete: (res) => {},
      })
    }
    else if(app.globalData.status=="waiting"){
      wx.showToast({
        title: '您已申请入住',
        icon: 'error',
        mask: false,
        success: (res) => {},
        fail: (res) => {},
        complete: (res) => {},
      })
    }
  },
  jumpBill:function(){
    if(app.globalData.status!="none"){
      wx.navigateTo({
        url: '/pages/bill/bill',
      })
    }
    else {
      wx.showToast({
        title: '您未申请入住',
        icon: 'error',
        mask: false,
        success: (res) => {},
        fail: (res) => {},
        complete: (res) => {},
      })
    }
  },
  jumpInfo:function(){
    if(app.globalData.status!="none"){
      wx.navigateTo({
        url: '/pages/info/info',
      })
    }
    else {
      wx.showToast({
        title: '您未申请入住',
        icon: 'error',
        mask: false,
        success: (res) => {},
        fail: (res) => {},
        complete: (res) => {},
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var that=this
    wx.showLoading({
      title: '数据加载中...',
    })
    app.getCurrentUserOpenid().then(()=>{
      db.where({openid:app.globalData.userOpenid}).get().then(res=>{
        console.log(2)
          if(res.data.length>0){
            // console.log(res.data)
            app.globalData.hasRoom=true
            app.globalData.status=res.data[0].status
            app.globalData.room=res.data[0].room
          }
          wx.hideLoading()
      })
    })
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
    // var that=this
    // if(!this.data.hasUserInfo)
    // {
    //   wx.showModal({
    //     title: '申请获取以下权限',
    //     content: '获得你的公开信息(昵称,头像,手机等)',
    //     showCancel: true,//是否显示取消按钮
    //     success: function (res) {
    //         if (res.cancel) {
    //           //点击取消,默认隐藏弹框
    //         } else {
    //           //点击确定
            
    //           wx.getUserProfile({
    //             desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
    //             success: (res) => {
    //               that.setData({
    //                 userInfo: res.userInfo,
    //                 hasUserInfo: true
    //               }),
    //               console.log(res)
    //             }
    //           })
    //         }
    //     },
    //   })
    // }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
  getOpenid(){
    wx.cloud.callFunction({
      name:'getOpenid',
      data:{
        a: 12,
        b: 19,
      }
    }).then(console.log)
  }
})
