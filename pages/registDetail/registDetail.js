// pages/registDetail/registDetail.js
const db=wx.cloud.database()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        room:"",
        sex:"",
        startDate:"",
        endDate:"",
        pic:[],//最多三张
        region:"",
        name:"",
        phone:"",
        id:"",
        deposit:null ,//以后根据数额多少提交直接付款
        water:null,
        elect:null,
        st:""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options.rr)
        this.setData({st:options.type})
        var dt=[]
        db.collection("User").where({room:parseInt(options.rr)}).get().then(res=>{
            console.log(res)
            var dt=res.data[0]
            this.setData({
                room:dt.room,
                sex:dt.sex,
                phone:dt.phone,
                name:dt.name,
                id:dt.id,
                startDate:dt.startDate,
                endDate:dt.endDate,
                deposit:dt.deposit,
                elect:dt.startElect,
                water:dt.startWater,
                region:dt.from.join("-"),
                pic:dt.img
            })
        })
        
    },
    confirmRegist(){
        //必须用云函数
        wx.cloud.callFunction({
            name:"confirmRegist",
            data:{
                room:this.data.room,
                status:"living"
            },
            success:res=>{
                wx.showToast({
                    title: '入住成功',
                    success: function() {
                        setTimeout(function() {
                          //要延时执行的代码
                          wx.navigateBack({
                            delta: 1
                          })
                        }, 1000) //延迟时间
                    }
                  })
            },
            fail:res=>{
                wx.showToast({
                    title: '入住失败',
                  })
            }
        })
        
    }
   
})