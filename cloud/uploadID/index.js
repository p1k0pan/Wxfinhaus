// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    return cloud.database().collection("User").add({
        data:{
            name:event.name,
            phone:event.phone,
            id:event.id,
            room:event.room,
            sex:event.sex,
            from:event.from,
            endDate:event.endDate,
            img:event.img,
            status:"waiting",
            openid:event.openid
        }
      })
}