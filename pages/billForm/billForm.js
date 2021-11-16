// pages/bill/billForm.wxml.js
var app=getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData:[
      {"code":"当月数量","water":"","elect":""},
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
    yearNMonth:"", //用于显示顶上日期，通过了格式化 -年-月
    yn:"", //用于下面逻辑判断 -
    lastyn:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  prefixInteger(num, length=2) { //输出数字如果为单数就前面加0
    return (Array(length).join('0') + num).slice(-length);
   },
  onLoad: function (options) {
    //获得了传过来的日期信息
    var tempMonth=parseInt(options.date.substring(5,options.date.length))
    var tempYear=parseInt(options.date.substring(0,5))
    if(tempMonth-1==0){
      tempMonth=12
    }
    else{
      tempMonth--;
    }
    this.setData({
      yearNMonth:options.date.replace('-','年'),
      room:app.globalData.room,
      yn:options.date,
      lastyn:tempYear.toString()+"-"+this.prefixInteger(tempMonth)
    })
    console.log(this.data.lastyn)
    wx.cloud.callFunction({
      name:'getBill',
      data:{
        room:parseInt(app.globalData.room),
        // date:util.formatYearMonth(new Date())
      }
    }).then(res => {
      var yn=this.data.yearNMonth
      var elect1=res.result.data[0].elect.find((value)=>{
        return value.date==this.data.yn 
      }) //获取指定月的电费
      var water1=res.result.data[0].water.find(value=>{
        return value.date==this.data.yn
      }) //获取指定月的水费
      if (res.result.data[0].elect[0]==elect1){ //如果当月就是入住第一个月
        var elect2={'amount':app.globalData.startWater}
        var water2={'amount':app.globalData.startElect}
      }
      else{
        var elect2=res.result.data[0].elect.find((value)=>{
          return value.date==this.data.lastyn 
        }) //获取指上月的电费
        var water2=res.result.data[0].water.find(value=>{
          return value.date==this.data.lastyn
        }) //获取指上月的电费
      }
      

      //#region 获取到的数据传到显示给用户的表格
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
        [str8]:(usedWater*water1.price).toFixed(1),// 解决乘法后出现奇怪的小数
        [str9]:(usedElect*elect1.price).toFixed(1),
        [hause]:hauseValue,
        [manage]:manageValue,
        [totalrent]:totalrentValue,
        sum:usedWater*water1.price+usedElect*elect1.price+totalrentValue,
      })
      //#endregion
    })
  },



})