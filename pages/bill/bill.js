// pages/bill/bill.js
var app= getApp()
var util=require("../../utils/util.js") 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab:0,
    listData:[
      {"code":"本月数量","water":"water1","elect":"elect1"},
      {"code":"上月数量","water":"water2","elect":"elect2"},
      {"code":"使用数量","water":"water3","elect":"elect3"},
      {"code":"单价","water":"water4","elect":"elect4"},
      {"code":"小计","water":"water5","elect":"elect5"},
      ],
    rent:[{"hause":"hauseGeld","manage":"manageGeld","totalrent":"totalGeld"}],
    summary:"1223123",
    karte:[{"num":"403","name":"张三","date":"2020-1"},
      {"num":"503","name":"李四","date":"2020-6"}
      ]
  },  
  //swiperchange--change color
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    wx.cloud.callFunction({
      name:'getBill',
      data:{
        room:parseInt(app.globalData.room),
        date:util.formatYearMonth(new Date())
      }
    }).then(res => {
      // const rd=res.result.data[0]
      // console.log(this.data.listData[0]['water'])
      // console.log(rd)
      // var rentHause="rent[0].hause"
      // var rentManage="rent[0].manage"
      // var rentTotal="rent[0].totalrent"
      // this.setData({
      //   [rentHause]:rd.hause,
      //   [rentManage]:rd.manage,
      //   [rentTotal]:rd.totalrent
      // })
      // var water="i.water"
      // var water2="i.water2"
      // var water4="i.water4"
      // var elect1="i.elect1"
      // var elect2="i.elect2"
      // var elect4="i.elect4"
    }).catch(err => {
      console.log(err)
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
  } 
})