// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  if (event.action == 'user') { //某个用户的评论
    return await cloud.database().collection('pinglun')
      .where({
        _openid: wxContext.OPENID
      }).get()
  } else {
    return await cloud.database().collection('pinglun')
      .where({
        goodId: event.goodId
      }).get()
  }

}