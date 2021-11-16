// pages/billAdmin/billAdmin.js
var util=require("../../utils/util.js") 
const db=wx.cloud.database()
Page({

    data: {
     currentTab:0,
     date:"",
     selectShow: false,//控制下拉列表的显示隐藏，false隐藏、true显示
     selectShow2: false,//控制日期下拉列表的显示隐藏，false隐藏、true显示
     selectShow3: false,//控制添加账单下拉列表的显示隐藏，false隐藏、true显示
     selectRoom: ['204','304','401','405','504'],//下拉列表的数据
     livingRoom:[],
     index: -1,//选择的下拉列表下标,
     selectDate:[],
     index2:-1, //控制日期下拉
     index3:-1, //控制添加账单下拉
     listData:[
        {"code":"当月数量","water":"","elect":""},
        {"code":"上月数量","water":"","elect":""},
        {"code":"单价","water":"","elect":""},
        {"code":"使用数量","water":"","elect":""},
        {"code":"小计","water":"","elect":""},
        ],
    addList:[
        {"code":"当月数量","water":"","elect":""},
        {"code":"上月数量","water":"","elect":""},
        {"code":"单价","water":"","elect":""},
        {"code":"使用数量","water":"","elect":""},
        {"code":"小计","water":"","elect":""},
        ],
      rent:[{"hause":"","manage":"","totalrent":""}],
      addRent:[{"hause":"","manage":"","totalrent":""}],
      sum:"",
      addSum:"",
      billRes:"",
      elect2:0,
      water2:0 ,
      water1:null,
      elect1:null,
      priceWater:0,
      priceElect:0,
      usedWater:0,
      usedElect:0,
      totalrent:0,
      dd:""
    },
    selectTap() {
        this.setData({
            selectShow: !this.data.selectShow
        });
    },
    selectTap2() {
        this.setData({
            selectShow2: !this.data.selectShow2
        });
    },
    selectTap3() {
        this.setData({
            selectShow3: !this.data.selectShow3
        });
    },
      // 点击下拉列表
    optionTap(e) {
        let Index = e.currentTarget.dataset.index;//获取点击的下拉列表的下标
        this.setData({
            index: Index,
            selectShow: !this.data.selectShow,
            selectDate:[]
        });

        // 点击房间号获取该房间号的日期账单
        wx.cloud.callFunction({
            name:'getBill',
            data:{
                room:parseInt(this.data.selectRoom[this.data.index]),
            }
        }).then(res=>{
            this.setData({billRes:res})
            var date=this.data.billRes.result.data[0].elect[0].date
            console.log(this.data.billRes)
            var tempDate=[]
            // 将改房间的第一个月的年月获取，然后通过查询条数一个一个添加到数组里
            tempDate.push(date)
            var tempMonth=parseInt(date.substring(5,date.length))
            var tempYear=parseInt(date.substring(0,5))
            var len=res.result.data[0].elect.length-1
            for (var i=0;i< len;i++){
                if(tempMonth+1>12){
                    tempMonth=1
                    tempYear++;
                  }
                  else{
                    tempMonth++;
                  }
                  tempDate.push(tempYear.toString()+"-"+this.prefixInteger(tempMonth))
            }
            this.setData({selectDate:tempDate})
        })
        
    },

    optionTap2(e) {
        let Index2 = e.currentTarget.dataset.index;//获取点击的下拉列表的下标
        this.setData({
            index2: Index2,
            selectShow2: !this.data.selectShow2
        });
        // 有了日期应该填充数据到表里
        wx.showLoading({title: '数据加载...',})
        var yn= this.data.selectDate[this.data.index2]
        var elect1=this.data.billRes.result.data[0].elect.find((value)=>{
            return value.date==yn
        }) //获取指定月的电费
        var water1=this.data.billRes.result.data[0].water.find(value=>{
            return value.date==yn
        }) //获取指定月的水费
        this.getLastMonthWaterandElect(elect1).then(res=>{
            //回调将数据传给data之后再操作
            console.log(this.data.water2)
            var water2=this.data.water2
            var elect2=this.data.elect2
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
            var hauseValue=this.data.billRes.result.data[0].hause
            var manageValue=this.data.billRes.result.data[0].manage
            var totalrentValue=this.data.billRes.result.data[0].totalrent
            // console.log(water2,elect2)
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
            })
            //#endregion
        })
        wx.hideLoading()
    },
    optionTap3(e) {
        let Index = e.currentTarget.dataset.index;//获取点击的下拉列表的下标
        this.setData({
            index3: Index,
            selectShow3: !this.data.selectShow3,
        });
        db.collection("Bill").where({room:parseInt(this.data.livingRoom[this.data.index3])}).get().then(res=>{
            console.log(res)
            var water2=0
            var elect2=0
            if (res.data[0].elect.length==0){ //如果当月就是入住第一个月
                db.collection("User").where({room:parseInt(this.data.livingRoom[this.data.index3])}).get().then(rr=>{
                    water2=rr.data[0].startWater
                    elect2=rr.data[0].startElect
                    console.log(rr)
                    //#region 先显示上月数量和房屋租金，因为没有输入当月数量，所以先不显示其他的
                    var str2="addList[1].water"
                    var str3="addList[1].elect"
                    var hause="addRent[0].hause"
                    var manage="addRent[0].manage"
                    var totalrent="addRent[0].totalrent"
                    var hauseValue=parseInt(rr.data[0].deposit)-300 //用户表里的押金（deposit）就是房租
                    var manageValue=300 //管理费默认就是300
                    var totalrentValue=parseInt(rr.data[0].deposit)  //总租就是deposit
                    this.setData({
                        [str3]:parseFloat(elect2),
                        [str2]:parseFloat(water2),
                        water2:parseFloat(water2),
                        elect2:parseFloat(elect2),
                        [hause]:hauseValue,
                        [manage]:manageValue,
                        [totalrent]:totalrentValue,
                        totalrent:totalrentValue
                    })
                    //#endregion
                })
            }
            else{
                water2=res.data[0].water.filter(function(p){
                    return p.date==util.formatLastYearMonth(new Date())
                  })[0] //获取上个月的水费
                elect2=res.data[0].elect.filter(function(p){
                    return p.date==util.formatLastYearMonth(new Date())
                  })[0] //获取上个月的电费
                //#region 先显示上月数量和房屋租金，因为没有输入当月数量，所以先不显示其他的
                var str2="addList[1].water"
                var str3="addList[1].elect"
                var hause="addRent[0].hause"
                var manage="addRent[0].manage"
                var totalrent="addRent[0].totalrent"
                var hauseValue=res.data[0].hause
                var manageValue=res.data[0].manage
                var totalrentValue=res.data[0].totalrent
                this.setData({
                    [str3]:elect2.amount,
                    [str2]:water2.amount,
                    water2:water2.amount,
                    elect2:elect2.amount,
                    [hause]:hauseValue,
                    [manage]:manageValue,
                    [totalrent]:totalrentValue,
                    totalrent:totalrentValue
                })
                //#endregion

            }
             console.log(this.data.addList)
        })
        
    },
    getLastMonthWaterandElect(elect1){
        var that=this
        let promise = new Promise(function (resolve, reject) {
            // console.log(that.data)
            if (that.data.billRes.result.data[0].elect[0]==elect1){ //如果当月就是入住第一个月,上月的就是初始数据
                db.collection("User").where({room:parseInt(that.data.selectRoom[that.data.index])}).get().then(res=>{
                    var elect2={'amount':res.data[0].startElect}
                    var water2={'amount':res.data[0].startWater}
                    console.log(water2)
                    that.setData({
                        water2:water2,
                        elect2:elect2
                    })
                    resolve(res)
                })
            }
            else{
                var lastyn=that.data.selectDate[that.data.index2-1]
                var elect2=that.data.billRes.result.data[0].elect.find((value)=>{
                  return value.date== lastyn
                }) //获取指上月的电费
                var water2=that.data.billRes.result.data[0].water.find(value=>{
                  return value.date== lastyn
                }) //获取指上月的电费
                that.setData({
                    water2:water2,
                    elect2:elect2
                })
                console.log(that.data.water2)
                resolve()
            }
        });
        return promise
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
   
    prefixInteger(num, length=2) { //输出数字如果为单数就前面加0
        return (Array(length).join('0') + num).slice(-length);
    },

    dateChange: function(e) {
        // console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
          date: e.detail.value
        })
      },

    onLoad: function (options) {
        db.collection("Bill").where({}).get().then(res=>{
            console.log(res)
            var dt=res.data
            var l=[]
            var addList=[
                {"code":"当月数量","water":"","elect":""},
                {"code":"上月数量","water":"","elect":""},
                {"code":"单价","water":"","elect":""},
                {"code":"使用数量","water":"","elect":""},
                {"code":"小计","water":"","elect":""},
            ]
            var addRent=[{"hause":"","manage":"","totalrent":""}]
      
            for (var i=0;i<dt.length;i++)
            {
                var wl=dt[i].water.length
                console.log(wl)
                if(wl==0){
                    l.push(dt[i].room)
                }
                else{
                    if(dt[i].water[wl-1].date!=util.formatYearMonth(new Date()) || wl==0){
                        l.push(dt[i].room)
                    }
                }
            }
            this.setData({
                livingRoom:l,dd:util.formatYearMonth(new Date()),
                addList:addList,
                addRent:addRent,
                addSum:0,
                water1:null,
                elect1:null,
                index3:-1
            })
            console.log(this.data.livingRoom)
        })
    },
    changeWater(e){
        console.log(e)
        if (e.currentTarget.dataset.current == 0){ //修改的是当月数量
            this.setData({water1:parseFloat(e.detail.value)})
            var str6="addList[3].water"
            var str0="addList[0].water"
            var usedWater=this.data.water1-this.data.water2
            this.setData({
                [str6]:usedWater,
                usedWater:usedWater,
                [str0]:parseFloat(e.detail.value)
            })
        }
        else if (e.currentTarget.dataset.current == 2){
            var str8="addList[4].water"
            var str7="addList[2].water"
            this.setData({
                [str8]:parseFloat((this.data.usedWater*e.detail.value).toFixed(1)),
                [str7]:parseFloat(e.detail.value),
                priceWater:parseFloat(e.detail.value)
            })
            if(this.data.priceElect!=0 ){
                this.setData({
                    addSum:this.data.usedWater*this.data.priceWater+this.data.usedElect*this.data.priceElect+this.data.totalrent})
            }
        }
    },
    changeElect(e){
        console.log(e.currentTarget.dataset.current)
        if (e.currentTarget.dataset.current == 0){
            this.setData({elect1:parseFloat(e.detail.value)})
            var usedElect=this.data.elect1-this.data.elect2
            var str7="addList[3].elect"
            var str1="addList[0].elect"
            this.setData({
                [str7]:usedElect,
                usedElect:usedElect,
                [str1]:parseFloat(e.detail.value)
            })
            
        }
        else if (e.currentTarget.dataset.current == 2){
            this.setData({})
            var str9="addList[4].elect"
            var str7="addList[2].elect"
            this.setData({
                [str9]:parseFloat((this.data.usedElect*e.detail.value).toFixed(1)),
                [str7]:parseFloat(e.detail.value),
                priceElect:parseFloat(e.detail.value),
            })
            if(this.data.priceWater!=0 ){
                this.setData({
                    addSum:this.data.usedWater*this.data.priceWater+this.data.usedElect*this.data.priceElect+this.data.totalrent})
            }
            console.log(this.data)
        }
        
    },
    addBill(){
        var that=this
        console.log(this.data.addList)
        if(this.data.addSum==0){
            wx.showToast({
              title: '请输入所有数据',
              icon:"error"
            })
        }
        else{
            wx.cloud.callFunction({
            name:"addBill",
            data:{
                room:parseInt(that.data.livingRoom[this.data.index3]),
                amount1:that.data.addList[0].water,
                date1:that.data.dd,
                price1:that.data.addList[2].water,
                total1:that.data.addList[4].water,
                amount2:that.data.addList[0].elect,
                date2:that.data.dd,
                price2:that.data.addList[2].elect,
                total2:that.data.addList[4].elect
            },
            success:res=>{
                wx.showToast({
                    title: '添加成功',
                    success: function() {
                        setTimeout(function() {
                          //要延时执行的代码
                            that.onLoad()
                        }, 1000) //延迟时间
                    }
                  })
            },
            fail:res=>{
                wx.showToast({
                    title: '添加失败',
                  })
            }
        })
        }
    }
})