// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    return cloud.database().collection("Bill").where({
        room:event.room 
        // date:event.date
    }).get()
}
