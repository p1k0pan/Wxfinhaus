// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
    return await cloud.database().collection("Bill").where({
        room:event.room 
        // date:event.date
    }).update({
        data: {
          water:_.push({
              amount:event.amount1,
              price:event.price1,
              date:event.date1,
              total:event.total1
            }),
          elect:_.push({
              amount:event.amount2,
              price:event.price2,
              date:event.date2,
              total:event.total2
            }),
        }
      })
}