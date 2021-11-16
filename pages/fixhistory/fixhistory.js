// pages/fixhistory/fixhistory.js
var app=getApp()
const db=wx.cloud.database()
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
        status:"", //判断状态的文字
        isAdmin:"",
        picstatus:false, //判断显示哪个图标
        selectIdx:""
      },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        
        this.setData({
            //获取上一页面点击了哪一个卡片的索引
            textValue:app.globalData.card[options.idx].description,
            pic:app.globalData.card[options.idx].img,
            selectItem:app.globalData.card[options.idx].item,
            time:app.globalData.card[options.idx].date,
            room:app.globalData.card[options.idx].room,
            status:app.globalData.card[options.idx].status,
            isAdmin:app.globalData.isAdmin,
            selectIdx:options.idx
        })
        if("待维修"==this.data.status){this.setData({picstatus:true})}
        console.log(app.globalData.card)
        console.log(options.idx)
        console.log("待维修"==this.data.status)
    },
    previewIMG:function(event){
        wx.previewImage({
          current: event.currentTarget.dataset.src, // 当前显示图片的http链接
          urls: this.data.pic // 需要预览的图片http链接列表
        })
    },
    tapFinished(){
        wx.showModal({
            title: '提示',
            content: '确定提交？',
            success:res=>{
                if(res.confirm){
                    wx.showLoading({
                      title: '数据提交中...',
                    })
                    wx.cloud.callFunction({
                        name:"finishFix",
                        data:{
                            _id:app.globalData.card[this.data.selectIdx]._id
                        },
                        success:res=>{
                            wx.showToast({
                              title: '修改成功',
                              icon: "success",
                              success: function() {
                                    setTimeout(function() {
                                    //要延时执行的代码
                                    wx.hideLoading({})
                                    wx.navigateBack({
                                        delta: 1
                                    })
                                    }, 1000) //延迟时间
                                }
                            })

                        },
                        fail:res=>{
                            wx.showToast({
                                title: '出错',
                                icon: "error",
                                success:function() {
                                    setTimeout(function() {
                                    //要延时执行的代码
                                    wx.hideLoading({})
                                   
                                    }, 1000) //延迟时间
                                }
                            })
                        }                    
                    })
    
                }
            }
        })
    },
    tapDelete(){
        wx.showModal({
            title: '提示',
            content: '确定删除？',
            success:res=>{
                if(res.confirm){
                    wx.cloud.callFunction({
                        name:"deleteFix",
                        data:{
                            _id:app.globalData.card[0]._id
                        },
                        success:res=>{
                            wx.showToast({
                              title: '删除成功',
                              icon: "success",
                            })
                            wx.navigateBack({
                              delta: 0,
                            })
                        },
                        fail:res=>{
                            wx.showToast({
                                title: '出错',
                                icon: "error",
                              })
                        }                    
                    })
    
                }
            }
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