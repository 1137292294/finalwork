
const app = getApp();
Page({
  // 页面初始化
  data: {
    userInfo: null,
  },
  //初始化用户信息
  getUserInfo() {
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log("获取用户信息成功", res)
        let user = res.userInfo
        this.setData({
          userInfo: user,
        })
        user.openid = app.globalData.openid;
        app._saveUserInfo(user);
      },
      fail: res => {
        console.log("获取用户信息失败", res)
      }
    })
  },
  //退出登录
  cancelUserInfo() {
    this.setData({
      userInfo: null,
    })
    app._saveUserInfo(null);
  },
  // 去我的订单页
  goMyOrder: function () {
    wx.navigateTo({
      url: '/pages/myOrder/myOrder',
    })
  },
  // 去我的评论页
  goMyComment: function () {
    wx.navigateTo({
      url: '/pages/myComment/myComment',
    })
  },
  //去我的发布页
  goSeller() {
    wx.navigateTo({
      url: '/pages/seller/seller',
    })
  },
  onShow() {
    var user = app.globalData.userInfo;
    if (user && user.nickName) {
      this.setData({
        userInfo: user,
      })
    }
  },
})