// 使用 Component 构造器构造页面, 方便实用组件的computed
// const watchBehavior = require("../../utils/extend/miniprogram-watch.js");
import { pay } from '../../assets/js/pay.js'

Component({
  behaviors: [wx.$computedBehavior],
  properties: {
    paramA: Number,
    paramB: String,
  },
  data: {
    addresss: null,
    isLoading: false,
    orders: null,
    order: {
      userId: '',
      receiverName: '',
      receiverPhone: null,
      receiverAddress: '',
      payment: 0, // 实际付款金额 元,保留两位小数
      points: null, // 实际付款积分
      postage: 0, // 配送费
      remark: '', // 留言
      orderDetails: [
        {
          productId: '', // 商品id
          productName: '', // 商品名 
          currentUnitPrice: '', // 生成订单时的商品单价，单位是元,保留两位小数
          userId: '',
          quantity: 0, // 商品数量
          totalPrice: 0, // 商品总价
        }
      ]
    },
  },
  computed: {
    user() {
      return getApp().globalData.user || {}
    },
    userId() {
      return this.data.user.user && this.data.user.user.id
    },
    openId() {
      return this.data.user.userWx && this.data.user.userWx.openid
    },
    payNum() {
      if (!this.data.orders || !this.data.orders.length) return 0
      return this.data.orders.reduce((total, currentItem) => total + currentItem.currentUnitPrice * currentItem.quantity, 0) || 0
    },
    canSubmit() {
      const { receiverName, receiverPhone, receiverAddress } = this.data.order
      return !!receiverName && !!receiverPhone && !!receiverAddress
    },
  },
 
  methods: {
    buy() {
      this.setData({ isLoading: true })
      wx.$showLoading()
      const order = this.normalizeOrder()
      this.addOrder(order)
    },
    normalizeOrder() {
      const order = {...this.data.order}
      order.userId = this.data.userId
      order.payment = this.data.payNum

      const orderDetails = this.data.orders.map(order => (Object.assign({totalPrice: order.currentUnitPrice * order.quantity}, order)))
      order.orderDetails = orderDetails
      return order
    },
    addOrder(order) {
      wx.$ajax(`/api/platform/order/add`, order, 'JSON')
        .then(resp => {
          const order = resp.data
          const { payment, orderNo } = order || {}
          // if (!payment) {
          //   this.$location().push('/order')
          //   return
          // }
          const { userId, openId} = this.data
          pay(payment, orderNo, userId, openId)
            .finally(() => {
              console.log('buy finished')
              this.setData({ isLoading: false })
              wx.showModal({
                title: '温馨提示',
                content: '购买成功，请在公众号查看您的订单 😉',
                showCancel: false,
              })
              // this.$location().push('/order')
            })
        })
    },
    remarkChange(e) {
      this.setData({ ['order.remark']: e.detail})
    },
    addressChange(e) {
      const address = e.detail
      if (!address || !address.receiverName) return

      const { 
        receiverName, 
        receiverMobileNo: receiverPhone, 
        provinceName, 
        cityName, 
        districtName, 
        detailAddress,  
      } = address || {}

      const receiverAddress = provinceName + cityName + districtName + detailAddress

      this.setData({
        ['order.receiverName']: receiverName,
        ['order.receiverPhone']: receiverPhone,
        ['order.receiverAddress']: receiverAddress,
      })
    },
    stepperChange(e) {
      const index = e.currentTarget.dataset.index, quantity = e.detail
      this.setData({ [`orders[${index}].quantity`]: quantity })
    },
    getAddress() {
      const user = getApp().globalData.user || {}
      wx.$ajax('/api/platform/shipping/shippingPage', { userId: user.user && user.user.id }).then(resp => {
        this.setData({ addresss: resp })
        // console.log('addresss', this.data.addresss)
      })
    },
    submitSuccess() {
      this.getAddress()
    },

    // 页面的生命周期方法（即 on 开头的方法），应写在 methods 定义段中。
    onLoad() {
      this.data.paramA // 页面参数 paramA 的值
      this.data.paramB // 页面参数 paramB 的值

      const orders = wx.getStorageSync('orders')
      this.setData({ orders })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
      if (getApp().globalData.user) {
        this.getAddress()
      } else {
        getApp().userInfoReadyCallback = this.getAddress.bind(this)
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
  },
  

})

// Page({
//   data: {
//     addresss: null,
//   },
//   getAddress() {
//     const user = getApp().globalData.user || {}
//     wx.$ajax('/api/platform/shipping/shippingPage', { userId: user.user && user.user.id }).then(resp => {
//       this.setData({ addresss: resp })
//       console.log('addresss', this.data.addresss)
//     })
//   },
//   submitSuccess() {
//     this.getAddress()
//   },

//   /**
//    * 生命周期函数--监听页面加载
//    */
//   onLoad: function (options) {
//     wx.$computed(this, {
//       user() {
//         return getApp().globalData.user || {}
//       },
//     })
//     // this.getAddress()
//   },

//   /**
//    * 生命周期函数--监听页面初次渲染完成
//    */
//   onReady: function () {
//     if (getApp().globalData.user) {
//       this.getAddress()
//     } else {
//       getApp().userInfoReadyCallback = this.getAddress
//     }
//   },

//   /**
//    * 生命周期函数--监听页面显示
//    */
//   onShow: function () {

//   },

//   /**
//    * 生命周期函数--监听页面隐藏
//    */
//   onHide: function () {

//   },

//   /**
//    * 生命周期函数--监听页面卸载
//    */
//   onUnload: function () {

//   },

//   /**
//    * 页面相关事件处理函数--监听用户下拉动作
//    */
//   onPullDownRefresh: function () {

//   },

//   /**
//    * 页面上拉触底事件的处理函数
//    */
//   onReachBottom: function () {

//   },

//   /**
//    * 用户点击右上角分享
//    */
//   onShareAppMessage: function () {

//   }
// })