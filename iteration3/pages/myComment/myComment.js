const app = getApp()
let DB = wx.cloud.database()
Page({
  data: {
    list: []
  },
  //去商品详情页
  goDetail(e) {
    wx.navigateTo({
      url: '/pages/detail/detail?goodid=' + e.currentTarget.dataset.goodid
    })
  },
  onLoad() {
    this.getMyCommentList();
  },
  //获取我的所有评论列表
  getMyCommentList() {
    wx.cloud.callFunction({
      name: 'getPinglun',
      data: {
        action: 'user'
      }
    }).then(res => {
      this.setData({
        list: res.result.data
      })
    })
  },
})