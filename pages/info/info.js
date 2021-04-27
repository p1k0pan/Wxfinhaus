// pages/info/info.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    room:"",
    name:"",
    startDate:"",
    deposit:"",
    startWater:"",
    startElect:"",
    rent:0,
    manage:300,
    contracts:[]
  },
  contact:function(){
    wx.switchTab({
      url: '/pages/contact/contact',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      room:app.globalData.room,
      name:app.globalData.name,
      startDate:app.globalData.startDate,
      startElect:app.globalData.startElect,
      startWater:app.globalData.startWater,
      deposit:app.globalData.deposit,
      contracts:app.globalData.contracts
    })
    this.setData({
      rent:(parseInt(this.data.deposit)-this.data.manage*2)/2
    })
    console.log((parseInt(this.data.deposit)-this.data.manage*2)/2)
    console.log(this.data.rent)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  }
})