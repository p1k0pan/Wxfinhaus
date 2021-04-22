// pages/fixhistory/fixhistory.js
var app=getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        selectItem:"",
        textValue:"",
        pic:[],
        room:"",
        time:"",
        status:""
      },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // console.log(options.idx)
        this.setData({
            //获取上一页面点击了哪一个卡片的索引
            textValue:app.globalData.card[options.idx].description,
            pic:app.globalData.card[options.idx].img,
            selectItem:app.globalData.card[options.idx].item,
            time:app.globalData.card[options.idx].date,
            room:app.globalData.room,
            status:app.globalData.card[options.idx].status,
        })
        console.log(app.globalData.card)
    },
    previewIMG:function(event){
        wx.previewImage({
          current: event.currentTarget.dataset.src, // 当前显示图片的http链接
          urls: this.data.pic // 需要预览的图片http链接列表
        })
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