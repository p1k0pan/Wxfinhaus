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
        st:"",
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
        wx.showLoading({
          title: '数据传送中...',
        })
        wx.cloud.callFunction({
            name:"confirmRegist",
            data:{
                room:this.data.room,
                status:"living"
            },
            success:res=>{
                db.collection("Bill").add({
                    data:{
                        room:parseInt(this.data.room),
                        hause:parseInt(this.data.deposit)-300,
                        manage:300,
                        totalrent:parseInt(this.data.deposit),
                        elect:[],
                        water:[]
                    }
                }).then(res=>{wx.showToast({
                    title: '入住成功',
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
                })
            },
            fail:res=>{
                wx.showToast({
                    title: '入住失败',
                  })
            }
        })
        
    },
    previewIMG:function(event){
        wx.previewImage({
          current: event.currentTarget.dataset.src, // 当前显示图片的http链接
          urls: this.data.pic // 需要预览的图片http链接列表
        })
    },
   
})