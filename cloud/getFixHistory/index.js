// 云函数入口文件
// var app=getApp()
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    return await cloud.database().collection("Repair").where({room:event.room}).get()
}