const db = wx.cloud.database()
Page({
    onLoad(opt) {
        db.collection('goods')
            .where({
                _openid: opt.openid
            }).get()
            .then(res => {
                this.setData({
                    sellerList: res.data
                })
            })
    },
      //去商品详情页
  goDetail(e) {
    wx.redirectTo({
      url: '/pages/detail/detail?goodid=' + e.currentTarget.dataset.id
    })
  },
})