// pages/buy/buy.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  getAddress() {
    const user = getApp().globalData.user || {}
    wx.$ajax('/api/platform/shipping/shippingPage', { userId: user.user && user.user.id }).then(resp => {
      console.log('resp', resp)
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.$computed(this, {
      user() {
        return getApp().globalData.user || {}
      },
    })
    this.getAddress()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if (getApp().globalData.user) {
      this.getAddress()
    } else {
      getApp().getUserCB = this.getAddress
    }
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
  onShareAppMessage: function () {

  }
})