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
      {"code":"本月数量","water":"","elect":""},
      {"code":"上月数量","water":"","elect":""},
      {"code":"单价","water":"","elect":""},
      {"code":"使用数量","water":"","elect":""},
      {"code":"小计","water":"","elect":""},
      ],
    rent:[{"hause":"","manage":"","totalrent":""}],
    sum:"1223123",
    card:[],
    //用于显示顶上表示
    room:"",
    year:new Date().getFullYear(),
    month:new Date().getMonth()
  },  
  //swiperchange--change color
  /**
   * 生命周期函数--监听页面加载
   */
  getJsonObj(keys,arr) {
    var newArr = arr.filter(function (p) {
        return p.date == keys;
    });
    return newArr;
},
  onLoad: function (options) {
    wx.showLoading({
      title: '数据加载中...',
    })
    console.log(app.globalData.room)
    wx.cloud.callFunction({
      name:'getBill',
      data:{
        room:parseInt(app.globalData.room),
        // date:util.formatYearMonth(new Date())
      }
    }).then(res => {
      console.log(res.result.data[0].water)
      console.log(util.formatYearMonth(new Date()))
      var elect1=res.result.data[0].elect.filter(function(p){
        return p.date==util.formatYearMonth(new Date())
      })[0] //获取这个月的电费
      var water1=res.result.data[0].water.filter(function(p){
        return p.date==util.formatYearMonth(new Date())
      })[0] //获取这个月的水费
      if (res.result.data[0].elect[0]==elect1){ //如果当月就是入住第一个月
        var elect2={'amount':app.globalData.startWater}
        var water2={'amount':app.globalData.startElect}
      }
      else{
        var elect2=res.result.data[0].elect.find((value)=>{
          return value.date==util.formatLastYearMonth(new Date()) 
        }) //获取指上月的电费
        var water2=res.result.data[0].water.find(value=>{
          return value.date==util.formatLastYearMonth(new Date())
        }) //获取指上月的电费
      }
      //#region 获取到的数据传到显示给用户的表格
      console.log(water2)
      if(water1==null){
        wx.showToast({
          title: '尚未有本月账单信息',
          icon:"error",
          success: function() {
              setTimeout(function() {
                wx.navigateBack({})
              }, 1000) //延迟时间
          }
        })
      }
      else{
        var str0="listData[0].water"
        var str1="listData[0].elect"
        var str2="listData[1].water"
        var str3="listData[1].elect"
        var str4="listData[2].water"
        var str5="listData[2].elect"
        var str6="listData[3].water"
        var usedWater=water1.amount-water2.amount
        var usedElect=elect1.amount-elect2.amount
        var str7="listData[3].elect"
        var str8="listData[4].water"
        var str9="listData[4].elect"
        var hause="rent[0].hause"
        var manage="rent[0].manage"
        var totalrent="rent[0].totalrent"
        var hauseValue=res.result.data[0].hause
        var manageValue=res.result.data[0].manage
        var totalrentValue=res.result.data[0].totalrent
        this.setData({
          [str0]:water1.amount,
          [str1]:elect1.amount,
          [str2]:water2.amount,
          [str3]:elect2.amount,
          [str4]:water1.price,
          [str5]:elect1.price,
          [str6]:usedWater,
          [str7]:usedElect,
          [str8]:(usedWater*water1.price).toFixed(1),
          [str9]:(usedElect*elect1.price).toFixed(1),
          [hause]:hauseValue,
          [manage]:manageValue,
          [totalrent]:totalrentValue,
          sum:usedWater*water1.price+usedElect*elect1.price+totalrentValue,
          room:app.globalData.room
        })
      }
      //#endregion

      //#region card数组是负责展示历史账单的动态变化，历史账单动态变化只有日期，本方法是获取电费第一个月的月数，结合本月条数，推算出有多少个月的数据，然后字符串方法把数据转换成想要展现的格式
      var s=res.result.data[0].elect[0].date
      var len=res.result.data[0].elect.length
      var tempMonth=parseInt(s.substring(5,s.length))
      var tempYear=parseInt(s.substring(0,5))
      var io=[]
      for (var i=0;i<len;i++){
        io.push(tempYear.toString()+"-"+this.prefixInteger(tempMonth))
        if(tempMonth==12){
          tempYear++;
          tempMonth=0
        }
        tempMonth++
      }
      this.setData({card:io})
      //#endregion 
      wx.hideLoading()
      
    })
  },
  prefixInteger(num, length=2) { //输出数字如果为单数就前面加0
    return (Array(length).join('0') + num).slice(-length);
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
  jumpBillHistory:function(e){
    wx.navigateTo({
      //将点击哪个卡片的日期传过去
      url: '/pages/billForm/billForm?date='+this.data.card[e.currentTarget.dataset.idx],
    })
  }
})