// pages/billAdmin/billAdmin.js
const db=wx.cloud.database()
Page({

    data: {
     currentTab:0,
     selectShow: false,//控制下拉列表的显示隐藏，false隐藏、true显示
     selectShow2: false,//控制日期下拉列表的显示隐藏，false隐藏、true显示
     selectRoom: ['204','304','401','405','306'],//下拉列表的数据
     index: -1,//选择的下拉列表下标,
     selectDate:[],
     index2:-1, //控制日期下拉
     listData:[
        {"code":"当月数量","water":"","elect":""},
        {"code":"上月数量","water":"","elect":""},
        {"code":"单价","water":"","elect":""},
        {"code":"使用数量","water":"","elect":""},
        {"code":"小计","water":"","elect":""},
        ],
      rent:[{"hause":"","manage":"","totalrent":""}],
      sum:"1223123",
      billRes:"",
      elect2:{},
      water2:{} //把上月水电放这里是由于放到局部变量一直获取了数据赋不了值，放在这里用函数赋值，用promise回调成功后再进行填表，从数据库获取数据后异步进行填表，所以一直表的数据一直为空
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


    onLoad: function (options) {

    },

})