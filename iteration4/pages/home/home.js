const app = getApp()
let searchKey = '' //搜索词设置
Page({
  data: {
    banner: [{
        picUrl: '/image/lunpic1.png'
      },
      {
        picUrl: '/image/lunpic2.png'
      },
      {
        picUrl: '/image/lunpic3.png'
      }
    ],
  },
  //展示可见内容
  onShow() {
    this.showBanner(); //播放顶部三图轮播
    this.showHot()   //获取热销食品
  },

  //二手商城页跳转
  goSeMall() {
    wx.switchTab({
      url: '/pages/mall/mall'
    })
  },
  //热销产品页跳转
  goNewGo() {
    wx.navigateTo({
      url: '/pages/newGood/newGood'
    })
  },
  //个人信息页跳转
  goInfo() {
    wx.navigateTo({
        url: '/pages/address/address'
      })
  },
  //回收商列表跳转
  goRe() {
    wx.navigateTo({
      url: '/pages/huishou/huishou',
    })
  },
  //定位用户搜索的关键词
  getSerWord(e) {
    searchKey = e.detail.value
  },
  //搜索关键词
  goSearch() {
    wx.navigateTo({
      url: '/pages/newGood/newGood?searchKey=' + searchKey,
    })
  },
  //展示轮播图
  showBanner() {
    wx.cloud.database().collection("lunbotu")
      .get()
      .then(res => {
        console.log("首页banner成功", res.data)
        if (res.data && res.data.length > 0) {
          this.setData({
            banner: res.data
          })
        }
      }).catch(res => {
        console.log("首页banner失败", res)
      })
  },
  //获取推荐商品
  showHot() {
    wx.cloud.callFunction({
      name: "getGoodList",
      data: {
        action: 'getHot'
      }
    }).then(res => {
      console.log("首页推荐商品数据", res.result)
      this.setData({
        goodList: res.result.data,
      })
    }).catch(res => {
      console.log("菜品数据请求失败", res)
    })
  },
  //点击可进入商品详情页
  goGoods(e) {
    wx.navigateTo({
      url: '/pages/detail/detail?goodid=' + e.currentTarget.dataset.id
    })
  },
})