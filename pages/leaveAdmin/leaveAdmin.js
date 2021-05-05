// pages/leaveAdmin/leaveAdmin.js
const db=wx.cloud.database()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        living:[],
        checked:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        db.collection("User").where({status:"living"}).get().then(res=>{
            console.log(res)
            var len=res.data.length
            var living=[]
            for (var i=0;i<len;i++){
                living.push(res.data[i].room)
            }
            console.log(living)
            this.setData({living:living})

        })
    },
    checkboxChange: function(e) {
        console.log('checkbox发生change事件，携带value值为：', e.detail.value)
        this.setData({checked:e.detail.value})
    },
    checkOut(){
        wx.showModal({
            title: '提示',
            content: '确定退房？',
            success: res=>{
                if (res.confirm) { //用户点击确定退房
                    var len=this.data.checked.length
                    var item=this.data.checked
                    for (var i=0;i<len;i++){ //删除用户表记录
                        wx.cloud.callFunction({
                            name:"checkOut",
                            data:{
                                col:"User",
                                room:parseInt(item[i])
                            }
                        })
                        wx.cloud.callFunction({ //删除账单表记录
                            name:"checkOut",
                            data:{
                                col:"Bill",
                                room:parseInt(item[i])
                            }
                        })
                    }
                    wx.showToast({
                        title: '退房成功',
                        success: function() {
                            setTimeout(function() {
                              //要延时执行的代码
                              wx.navigateBack({
                                delta: 1
                              })
                            }, 1000) //延迟时间
                        }
                      })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
          })
        
        
    }
})