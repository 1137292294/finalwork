const app = getApp()
const db = wx.cloud.database()
let id = ''
Page({
    onLoad(opt) {
        console.log('opt', opt)
        id = opt.id
        this.getOrder()
    },
    getOrder() {
        db.collection('order').doc(id).get()
            .then(res => {
                console.log('订单详情', res)
                this.setData({
                    order: res.data
                })
            })
    },
    /* 点击评分星 */
    pingfen(e) {
        this.setData({
            starNum: e.currentTarget.dataset.index + 1
        })
    },
    // 获取输入内容
    getContent(e) {
        this.setData({
            content: e.detail.value
        })
    },
    //提交评论
    submitComment() {
        let order = this.data.order;
        let content = this.data.content;
        let starNum = this.data.starNum;
        if (!starNum || starNum < 1) {
            wx.showToast({
                icon: 'error',
                title: '请评分',
            })
            return;
        }
        if (!content) {
            wx.showToast({
                icon: 'error',
                title: '评论内容为空',
            })
            return;
        }

        db.collection("order").where({
                _id: order._id
            })
            .update({
                data: {
                    status: 2
                },
            }).then(res => {
                console.log("修改状态成功", res)
                db.collection("pinglun")
                    .add({
                        data: {
                            orderId: order._id, //订单号
                            goodId: order.good._id, //评价的商品id
                            goodName: order.good.name, //评价的商品name
                            goodImg: order.good.img,
                            name: app.globalData.userInfo.nickName,
                            avatarUrl: app.globalData.userInfo.avatarUrl,
                            content: content,
                            starNum: starNum, //评分
                            _createTime: new Date().getTime() //创建的时间
                        }
                    }).then(res => {
                        console.log("评论成功", res)
                        wx.showToast({
                            title: '评论成功',
                        })
                        wx.navigateBack({
                            delta: 0,
                        })
                    }).catch(res => {
                        console.log("评论失败", res)
                        wx.showToast({
                            icon: "none",
                            title: '评论失败',
                        })
                    })
            }).catch(res => {
                console.log("修改状态失败", res)
            })


    },
})