let app = getApp();
Page({
  data: {
    schools: ['南开大学', '天津大学', '天津理工','中国民航','天津师范' ],
    school: '请选择您所属的学校',
    types: ["图书", '学习用品', '电子产品', '日用品', '衣服', '运动产品', '化妆品', '其他'],
    type: '请选择您要发布的商品类型',
    imgList: [],
    fileIDs: [],
  },
  //选择学校
  pickSchool(e) {
    this.setData({
      school: this.data.schools[e.detail.value]
    })
  },
  //选择商品类型
  pickType(e) {
    this.setData({
      type: this.data.types[e.detail.value]
    })
  },

  //选择图片
  chooseImage() {
    wx.chooseImage({
      count: 6 - this.data.imgList.length, //默认9,我们这里最多选择6张
      sizeType: ['compressed'], //可以指定是原图还是压缩图，这里用压缩
      sourceType: ['album', 'camera'], //从相册选择
      success: (res) => {
        console.log("选择图片成功", res)
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
        console.log("路径", this.data.imgList)
      }
    });
  },
  //删除图片
  deleteImage(e) {
    wx.showModal({
      title: '要删除这张照片吗？',
      content: '',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })


  },

  //上传数据
  submitData(e) {
    let user = app.globalData.userInfo
    if (!user || !user.nickName) {
      wx.showToast({
        icon: 'error',
        title: '请先登陆',
      })
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/me/me',
        })
      }, 1000);
      return
    }

    let good = e.detail.value

    if (good.school == '请选择所属学校') {
      wx.showToast({
        icon: "error",
        title: '请选择所属学校'
      })
      return
    }
    if (good.type == '请选择商品类型') {
      wx.showToast({
        icon: "error",
        title: '请选择商品类型'
      })
      return
    }

    if (!good.name) {
      wx.showToast({
        icon: "error",
        title: '请填写商品名'
      })
      return
    }
    if (!good.phone) {
      wx.showToast({
        icon: "error",
        title: '请填写电话'
      })
      return
    }
    if (!good.price || good.price <= 0) {
      wx.showToast({
        icon: "error",
        title: '请填写价格'
      })
      return
    }
    if (!good.num || good.num <= 0) {
      wx.showToast({
        icon: "error",
        title: '请填写数量'
      })
      return
    }
    if (!good.content || good.content.length < 6) {
      wx.showToast({
        icon: "error",
        title: '描述必须大于6个字'
      })
      return
    }
    //图片相关
    let imgList = this.data.imgList
    if (!imgList || imgList.length < 1) {
      wx.showToast({
        icon: "error",
        title: '请选择图片'
      })
      return
    }
    wx.showLoading({
      title: '发布中...',
    })

    const promiseArr = []
    //只能一张张上传 遍历临时的图片数组
    for (let i = 0; i < this.data.imgList.length; i++) {
      let filePath = this.data.imgList[i]
      let suffix = /\.[^\.]+$/.exec(filePath)[0]; // 正则表达式，获取文件扩展名
      //在每次上传的时候，就往promiseArr里存一个promise，只有当所有的都返回结果时，才可以继续往下执行
      promiseArr.push(new Promise((reslove, reject) => {
        wx.cloud.uploadFile({
          cloudPath: new Date().getTime() + suffix,
          filePath: filePath, // 文件路径
        }).then(res => {
          // get resource ID
          console.log("上传结果", res.fileID)
          this.setData({
            fileIDs: this.data.fileIDs.concat(res.fileID)
          })
          reslove()
        }).catch(error => {
          console.log("上传失败", error)
        })
      }))
    }
    //保证所有图片都上传成功
    let db = wx.cloud.database()
    Promise.all(promiseArr).then(res => {
      db.collection('goods').add({
        data: {
          nickName: user.nickName,
          avatarUrl: user.avatarUrl,
          content: good.content,
          num: parseInt(good.num),
          price: parseInt(good.price),
          name: good.name,
          school: good.school,
          type: good.type, //类型
          phone: good.phone, //电话
          img: this.data.fileIDs,
          status: '上架',
          tuijian: false, //是否上推荐位
          _createTime: new Date().getTime() //创建的时间
        },
        success: res => {
          wx.hideLoading()
          wx.showToast({
            title: '发布成功',
          })
          //清空数据
          this.setData({
            imgList: [],
            fileIDs: [],
          })
          console.log('发布成功', res)
          wx.navigateTo({
            url: '/pages/seller/seller',
          })
        },
        fail: err => {
          wx.hideLoading()
          wx.showToast({
            icon: 'error',
            title: '网络不给力....'
          })
          console.error('发布失败', err)
        }
      })
    })
  },
  // 重置
  reset() {
    console.log('点击了重置')
    this.setData({
      imgList: [],
      fileIDs: [],
    })
  }
})