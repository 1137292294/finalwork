// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command
const dbForum = db.collection('forum')

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  if (event.action == 'getList') { //获取某个分类下的问题
    return await dbForum.where({
        type: event.type
      })
      .orderBy('_createTime', 'desc').get()
  }
}