// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    return await cloud.database().collection("User").where({room:event.room}).update({
        data: {
            status: event.status
            // 只有none,living,waiting
          }
    })
}