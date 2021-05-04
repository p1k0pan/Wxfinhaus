const db=wx.cloud.database()
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
    adminId:"onoVC5TtTkoyruqo-2CAloNAq0t4",
    isAdmin:false,
    text:[], //消息内容
    n:[false,false,false,false,false], //点击文本框再显示前面序号
    emp:[true,true,true,true] // 第一条不写下面的框用不了
  },
  jumpFix:function(){
    if(this.data.hasRoom){
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
  jumpAdminBill(){
    wx.navigateTo({
      url: '/pages/billAdmin/billAdmin',
    })
  },
  jumpAdminRegist(){
    wx.navigateTo({
      url: '/pages/registAdmin/registAdmin',
    })
  },
  jumpAdminFix(){
    wx.navigateTo({
      url: '/pages/fixAdmin/fixAdmin',
    })
  },
  jumpAdminLeave(){
    wx.navigateTo({
      url: '/pages/leaveAdmin/leaveAdmin',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var that=this
    
    db.collection("Message").get().then(res=>{
      var text=[]
      var n=this.data.n
      var emp=this.data.emp
      for (var i=0;i<5;i++)
      {
        text[i]=res.data[0].msg[i]
        if(res.data[0].msg[i]!=null){
          n[i]=true
          if(i<4){
            emp[i]=false
          }
        }
      }
      this.setData({text:text,n:n,emp:emp})
    })
  },
  onReady:function(){
    wx.showLoading({
      title: '数据加载中...',
    })
    app.getCurrentUserOpenid().then(()=>{
      db.collection("User").where({openid:app.globalData.userOpenid}).get().then(res=>{
        console.log(app.globalData.userOpenid)
        console.log(res.data.length>0)
        if(app.globalData.userOpenid!=this.data.adminId && res.data.length>0){
          // 如果不是管理员并且查询到数据 赋值并限制再次注册
          app.globalData.status=res.data[0].status
          app.globalData.room=res.data[0].room
          this.setData({
            hasRoom:true,
            userOpenid:app.globalData.userOpenid
          })
          app.globalData.name=res.data[0].name
          app.globalData.startDate=res.data[0].startDate
          app.globalData.deposit=res.data[0].deposit
          app.globalData.startWater=res.data[0].startWater
          app.globalData.startElect=res.data[0].startElect
          app.globalData.contracts=res.data[0].contracts
        }
        else if(app.globalData.userOpenid==this.data.adminId ){
          this.setData({isAdmin:true})
          app.globalData.isAdmin=true
        }
        wx.hideLoading()
      })
    })
  },
  areaInput(e){
    var str="emp["+e.target.dataset.num+"]";
    this.setData({
      [str]:false
    })
  },
  areaBlur(e){
    if (e.detail.value == ""){
      var str1="n["+e.target.dataset.num+"]";
      var str2="emp["+e.target.dataset.num+"]";
      this.setData({[str1]:false})
      this.setData({[str2]:true})
    }
    else{
      var str3="text["+e.target.dataset.num+"]";
      this.setData({[str3]:e.detail.value})
    }
  },
  areaFocus(e){
    var str1="n["+e.target.dataset.num+"]";
    this.setData({[str1]:true})
  },
  
  // 云函数位置不够 只能用普通函数添加，update的时候注意权限，到时修改需要去云数据库里修改_openid
  releaseMsg(){
    db.collection("Message").doc('28ee4e3e608c0de413f2d49a4216b27a').update({
      data: {
        msg: this.data.text
      },
      success:res=>{
        console.log("1")
      },
      fail:res=>{
        console.log(res)
      }
    })
  },
  clearMsg(){
    this.setData({
      text:[], //消息内容
      n:[false,false,false,false,false], //点击文本框再显示前面序号
      emp:[true,true,true,true] // 第一条不写下面的框用不了
    })
  }
})
