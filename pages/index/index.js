//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    commoditys: null,
    toView: 'blue',
    scrollTop: 100,
    pageSize: 5,
    pageNum: 1,
    finished: false,
    isLoading: false,
    showAuth: false,
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {

    this.getCommoditys()
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
      app.userInfoFailCallback = () => {
        console.log(9999999999)
        this.setData({ showAuth: true })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onPullDownRefresh() {
    this.pageNum = 1
    this.setData({commoditys: null})
    this.getCommoditys().then(() => { wx.stopPullDownRefresh() })
  },
  onReachBottom() {
    if (this.data.finished) return
    this.setData({isLoading: true})
    this.getCommoditys().then(() => {
      this.setData({isLoading: false})
    })
  },
  toDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.setStorageSync('id', id)
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + id,
    })
  },
  scroll(e) {
    // console.log(e)
  },
  getUserInfo: function(e) {
    app.getTokenAndUser(e.detail)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    this.setData({ showAuth: false })
  },
  getCommoditys() {
    return new Promise(resolve => {
      wx.$ajax('/api/platform/product/productPage', {
          pageSize: this.data.pageSize, pageNum: this.data.pageNum, status: 1
        })
        .then(resp => {
          const _list = resp && resp.list || []
          if (_list.length < this.data.pageSize) this.setData({finished: true})
          const commoditys = [...this.data.commoditys || []]

          _list.forEach((commodity, index) => {
            this.setData({[`commoditys[${commoditys.length + index}]`]: commodity})
          })
          this.setData({pageNum: this.data.pageNum + 1})
          // this.setData({pageNum: this.data.pageNum + 1,commoditys: [...this.data.commoditys || [], ..._list]})
          resolve()
        })
    })
    
  },
  clickMe() {
    this.setData({ motto: 'Hello China' })
  }
})
