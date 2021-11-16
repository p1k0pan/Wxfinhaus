// pages/registAdmin/registAdmin.js
const db=wx.cloud.database()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentTab:0,
        card1:[], 
        allRoom:[304,401,405,204,504], 
        livingIs:[],
        waitingIs:[],
        diff:[]
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
          that.setData({ 
          currentTab: e.target.dataset.current 
          }) 
        } 
      } ,
    
    onShow: function (options) {
        db.collection("User").where({status:"waiting"}).get().then(res=>{
            this.setData({card1:res.data})
        })
        db.collection("User").where({}).get().then(res=>{
          //找出租了房的房号，把租出去的房放在数组前面显示
          console.log(res)
          var waitingRoom=[] //存放注册了还没确认的房号
          var livingRoom=[]  //存放在住住户的房号
          var waiting=res.data.filter((value)=>{
            return value.status== "waiting"
          }) 
          for (var i=0;i<waiting.length;i++){
            waitingRoom.push(waiting[i].room)
          }
          var living=res.data.filter((value)=>{
            return value.status== "living"
          }) 
          for (var i=0;i<living.length;i++){
            livingRoom.push(living[i].room)
          }

          var diff=this.substraction(livingRoom.concat(waitingRoom),this.data.allRoom) //两个数组的差集
          var waitingIs=this.intersection(waitingRoom,this.data.allRoom) //两个数组的交集
          var livingIs=this.intersection(livingRoom,this.data.allRoom) //两个数组的交集
          console.log(diff,waitingIs,livingIs)
          this.setData({
            livingIs:livingIs, // 先显示租了房的，租了房的图标是绿色的且可以点击查看详情
            diff:diff, //未租房，图标是灰色且不能点击
            waitingIs:waitingIs
          })
        
      })
      
    },
    substraction(hasroom,allroom){ 
      let a = new Set(allroom);
      let b = new Set(hasroom);
      let difference = new Set([...a].filter(x => !b.has(x)));
      return Array.from(difference)
    },
    intersection(hasroom,allroom){ 
      let a = new Set(allroom);
      let b = new Set(hasroom);
      let intersec = new Set([...a].filter(x => b.has(x)));
      return Array.from(intersec)
    },
    
    confirmRegist(e){
        wx.navigateTo({
            url: '/pages/registDetail/registDetail?type=waiting&rr='+e.currentTarget.dataset.rr,
        })
    },
    checkRegist(e){
      wx.navigateTo({
          url: '/pages/registDetail/registDetail?type=living&rr='+e.currentTarget.dataset.rr,
      })
  }
})