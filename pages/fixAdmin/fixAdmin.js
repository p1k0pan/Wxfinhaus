// pages/fixAdmin/fixAdmin.js
const db=wx.cloud.database()
var app=getApp()
Page({
    swiperTab:function( e ){
        var that=this;
        that.setData({
        currentTab:e.detail.current
        });
       
      },
      clickTab: function( e ) {  
        var that = this; 
        if( this.data.currentTab === e.target.dataset.current ) { 
          return false; 
        } else { 
          that.setData( { 
          currentTab: e.target.dataset.current 
          }) 
        } 
      } ,
    data: {
        currentTab:0,
        card1:[], //待维修
        card2:[] //已维修
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        
    },
    getFixStatus(){
        var that=this
        return new Promise(function (resolve, reject) {
            wx.cloud.callFunction({
                name:'getFixStatus'
            }).then(res=>{
                var f1=res.result.data.filter((value)=>{
                  return value.status=="待维修"
                }) //获取待维修的数据
                var f2=res.result.data.filter((value)=>{
                  return value.status=="已维修"
                }) //获取待维修的数据
                that.setData({card1:f1,card2:f2})
                resolve(res)
            })
        })
    },
    changeStatus(e){
        app.globalData.card=this.data.card1
        wx.navigateTo({
          url: '/pages/fixhistory/fixhistory?idx='+e.currentTarget.dataset.idx,})
    },
    checkFixed(e){
      app.globalData.card=this.data.card2
      wx.navigateTo({
        url: '/pages/fixhistory/fixhistory?&idx='+e.currentTarget.dataset.idx,})
  },
   
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
      // 页面返回的时候调用onshow刷新
      this.getFixStatus().then(res=>{
        console.log(this.data.card)
    })
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