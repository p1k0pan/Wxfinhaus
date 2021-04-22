// pages/fix/fix.js
var app=getApp()
var util=require("../../utils/util.js") 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab:0,
    item: ['美国', '中国', '巴西', '日本'],
    index:-1,
    pic:[],//最多三张
    picCount:0,
    card:{},
    desc:"",
    upPic:[],

  },
  bindTextAreaBlur: function(e) {
    this.setData({
      desc:e.detail.value
    }) 
  },  
  bindUpload:function(){
    var that=this
    wx.chooseImage({
      count: 3,
      success(res){
        var tempFilePaths = res.tempFilePaths;
        var imgs = that.data.pic;
        for (var i = 0; i < tempFilePaths.length; i++) {
          if (imgs.length >= 3) {
            that.setData({
              pic: imgs
            });
            return false;
          } else {
            imgs.push(tempFilePaths[i]);
          }
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
  uploadIMG:function () {
    for(var i=0;i<this.data.picCount;i++)
    {
      //setdata 数组动态索引必须这样写
      var str="upPic["+i+"]";
      this.setData({
        [str]:"cloud://apartment-management-3b24d52adb0.6170-apartment-management-3b24d52adb0-1304865057/"+app.globalData.room+"_"+this.data.item[this.data.index]+"_"+i+".jpg"
      })

      wx.cloud.uploadFile({
        cloudPath: app.globalData.room+"_"+this.data.item[this.data.index]+"_"+i+'.jpg',
        filePath: this.data.pic[i], // 文件路径
        success:res=>{
          // app.globalData.fixPic[i]=res.fileID
        }
      })
    }
    // console.log(app.globalData.fixPic)
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
  previewIMG:function(event){
    wx.previewImage({
      current: event.currentTarget.dataset.src, // 当前显示图片的http链接
      urls: this.data.pic // 需要预览的图片http链接列表
    })
  },
  upLoadConfirm:function(){
    wx.showModal({
      title: '提示',
      content: '确定提交？',
      success:res=> {
        if (res.confirm) {
          if(this.data.picCount==0 || this.data.index<0 || this.data.desc=="")
          {
            wx.showToast({
              title: '请提供完整信息',
              icon:"error"
            })
          }
          else{
            wx.showLoading({
              title: '提交中...',
            })
            console.log(util.formatDate(new Date()))
            this.uploadIMG()
            wx.cloud.callFunction({
              name:'uploadFix',
              data:{
                item:this.data.item[this.data.index],
                description:this.data.desc,
                room:app.globalData.room,
                date:util.formatDate(new Date()),
                img:this.data.upPic
              },
              success:res=>{
                //刚提交需要刷新一下历史纪录
                wx.cloud.callFunction({
                  name:"getFixHistory",
                  data:{
                    room:app.globalData.room
                  }
                }).then(res=>{
                  const result=res.result.data
                  this.setData({
                    card:result,
                    index:-1,
                    pic:[],//最多三张
                    picCount:0,
                    card:{},
                    desc:"",
                    upPic:[],
                  })
                })
                wx.showToast({
                  title: '提交成功',
                  icon:"success"
                })
                wx.hideLoading({
                  success: (res) => {},
                })
              }
            })
          }
        } 
        else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  bindPickerChange: function(e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(Object.keys(this.data.karte).length)
    // 获取维修记录
    wx.cloud.callFunction({
      name:"getFixHistory",
      data:{
        room:app.globalData.room
      }
    }).then(res=>{
      const result=res.result.data
      this.setData({
        card:result
      })
    })
    
  },
  // topLoad:function(event){
  //        //   该方法绑定了页面滑动到顶部的事件，然后做上拉刷新
  //   console.log("lower");
  // },
  jumpFixHistory: function(e){
    app.globalData.card=this.data.card
    // console.log("fix",e.currentTarget.dataset.idx)
    wx.navigateTo({
      url: '/pages/fixhistory/fixhistory?idx='+e.currentTarget.dataset.idx,
    })
  }
})