// pages/regist/regist.js
const db=wx.cloud.database().collection("User")
var app=getApp()
var util=require("../../utils/util.js") 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allRoom:[401,502,405,204],
    sex:["男","女"],
    roomIndex:-1,
    sexIndex:-1,
    date:"",
    pic:[],//最多三张
    upPic:[],
    picCount:0,
    region:"",
    name:"",
    phone:"",
    id:"",
    deposit:null ,//以后根据数额多少提交直接付款
    water:null,
    elect:null
  },
  
  changeName:function(e){
    this.setData({name:e.detail.value})
  },
  changeDeposit:function(e){
    this.setData({deposit:e.detail.value})
  },
  changeWater:function(e){
    this.setData({water:e.detail.value})
  },
  changeElect:function(e){
    this.setData({elect:e.detail.value})
  },
  changeId:function(e){
    this.setData({id:e.detail.value})
  },
  changePhone:function(e){
    this.setData({phone:e.detail.value})
  },
  roomChange: function(e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      roomIndex: e.detail.value
    })
  },
  sexChange: function(e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      sexIndex: e.detail.value
    })
  },
 dateChange: function(e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  regionChange: function(e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  bindUpload:function(){
    var that=this
    wx.chooseImage({
      count: 2,
      success(res){
        var tempFilePaths = res.tempFilePaths;
        var imgs = that.data.pic;
        for (var i = 0; i < tempFilePaths.length; i++) {
            imgs.push(tempFilePaths[i]);
        }
        that.setData({
          pic: imgs,
          picCount:imgs.length
          // pic:that.data.pic.push(res.tempFilePaths),
          // picCount:that.data.picCount+res.tempFilePaths.length
        });
        console.log(that.data.pic)
      }
    })
  },
  previewIMG:function(event){
    wx.previewImage({
      current: event.currentTarget.dataset.src, // 当前显示图片的http链接
      urls: this.data.pic // 需要预览的图片http链接列表
    })
  },
  bindDeleteImg:function(e)
  {
    var imgIndex = e.currentTarget.dataset.index;
    var that = this;
    that.data.pic.map(function(item,index){
      if(imgIndex == index){
        that.data.pic.splice(index,1);
        that.setData({
          pic:that.data.pic,
          picCount:that.data.pic.length
        })
      }
    })
  },
  uploadIMG:function () {
    for(var i=0;i<this.data.picCount;i++)
    {
      //setdata 数组动态索引必须这样写
      var str="upPic["+i+"]";
      this.setData({
        [str]:"cloud://apartment-management-3b24d52adb0.6170-apartment-management-3b24d52adb0-1304865057/"+this.data.allRoom[this.data.roomIndex]+"_身份证_"+i+".jpg"
      })

      wx.cloud.uploadFile({
        cloudPath: this.data.allRoom[this.data.roomIndex]+"_身份证_"+i+".jpg",
        filePath: this.data.pic[i], // 文件路径
        success:res=>{
          // console.log(this.data.uploadPic)
          // app.globalData.fixPic[i]=res.fileID
        }
      })
    }
    // console.log(app.globalData.fixPic)
  },
  submit:function(res){
    var dt=this.data;
    if(dt.roomIndex!=""&&dt.sexIndex!=""&&dt.date!=""&&dt.region!=""&&dt.name!=""&&dt.phone!=""&&dt.id!=""&&dt.upPic!=[])
    // if(dt.pic!=[])
    {
      wx.showLoading({
        title: '提交中...',
      })
      this.uploadIMG()
      console.log(dt.water)
      console.log(dt.elect)
      
      wx.cloud.callFunction({
        name:"uploadID",
        data:{
          name:dt.name,
          phone:dt.phone,
          id:dt.id,
          room:dt.allRoom[dt.roomIndex],
          sex:dt.sex[dt.sexIndex],
          from:dt.region,
          endDate:dt.date,
          img:dt.upPic,
          openid:app.globalData.userOpenid,
          deposit:dt.deposit,
          startWater:dt.water,
          startElect:dt.elect,
          startDate:util.formatDate(new Date())
        }
      }).then(res=>{
        console.log(dt.date)
        console.log(dt.region)
        console.log(dt.upPic)
        app.globalData.status="waiting"
        app.globalData.hasRoom=true
        app.globalData.room=dt.allRoom[dt.roomIndex]
        wx.showToast({
          title: '提交成功',
          success: function() {
              setTimeout(function() {
                //要延时执行的代码
                wx.navigateBack({})
                wx.hideLoading({
                  success: (res) => {},
                })
              }, 1800) //延迟时间
          }
        })
        // this.setData({
        //   roomIndex:-1,
        //   sexIndex:-1,
        //   date:"",
        //   pic:[],//最多三张
        //   upPic:[],
        //   picCount:0,
        //   region:"",
        //   name:"",
        //   phone:"",
        //   id:""
        // })
      })
     
    }
    else{
      wx.showToast({
        title: '请填写完整信息',
        icon:"error"
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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