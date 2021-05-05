// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    try{
        return await cloud.database().collection(event.col).where({
            room:event.room
        }).remove()
    }catch(e){
        console.error(e)
    }

    
}