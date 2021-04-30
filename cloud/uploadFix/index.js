// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  return cloud.database().collection("Repair").add({
    data:{
      item:event.item,
      description:event.description,
      room:event.room,
      date:event.date,
      img:event.img,
      status:"待维修"
    }
  })
}