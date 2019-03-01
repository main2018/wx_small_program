import { saveorderAndTobuy } from '../../assets/js/pay'

// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    popupShow: false,
    commodity: null,
    quantity: 1
  },
  close() {
    this.setData({popupShow: false})
  },
  skuChange(e) {
    this.setData({ quantity: e.detail })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.$computed(this, {
      images() {
        if (!this.data.commodity || !this.data.commodity.subImages) {
          return []
        } else if (this.data.commodity.subImages !== '[object Object]') {
          const _list = JSON.parse(this.data.commodity.subImages).list || []
          return _list.length ? _list : [this.data.commodity.mainImage]
        } else {
          return [this.data.commodity.mainImage]
        }
      },
      keys() {
        if (!this.data.commodity || !this.data.commodity.detailField1) {
          return {}
        } else if (this.data.commodity.detailField1 !== '[object Object]') {
          return JSON.parse(this.data.commodity.detailField1)
        } else {
          return {}
        }
        // return JSON.parse(this.commodity.detailField1 || '{}')
      },
    })

    // const id = wx.getStorageSync('id')
    const id = options.id
    wx.$ajax('/api/platform/product/findProduct', {id}).then(resp => {
      this.setData({commodity: resp})
      wx.setNavigationBarTitle({
        title: resp && resp.name
      })

      this.vHtml(resp && resp.detail)
    }).catch(err => { console.log('err', err) })
  },
  toBuy() {
    this.setData({popupShow: true})
  },
  skuConfirm() {
    this.setData({ popupShow: false })
    saveorderAndTobuy([Object.assign({ quantity: this.data.quantity }, this.data.commodity || {})])
  },
  hidePopup() {
    this.setData({popupShow: false})
  },

  vHtml(article) {
    wx.$WxParse.wxParse('article', 'html', article, this, 0);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    const { name: title, mainImage: imageUrl } = this.data.commodity || {}
    return {
      title,
      imageUrl
    }
  }
})