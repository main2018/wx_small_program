let cantClick = false
const notifyUrl = 'http://ysrest.yaleai.com/api/platform/pay/notify'

export function saveorderAndTobuy(commoditys = []) {
  if (!commoditys || !commoditys.length) return

  const orders = commoditys.map(commodity => ({
    creator: commodity.creator || '',
    creatorId: commodity.creatorId || '',
    productId: commodity.productId || commodity.id,
    productName: commodity.name, // 商品名 
    title: commodity.subtitle,
    currentUnitPrice: commodity.price, // 生成订单时的商品单价，单位是元,保留两位小数
    // userId: this.userId,
    quantity: commodity.quantity, // 商品数量
    productImage: commodity.mainImage,
    totalPrice: commodity.quantity * commodity.price, // 商品总价
  }))
  wx.setStorageSync('orders', orders)

  wx.navigateTo({
    url: '/pages/buy/buy'
  })
}

export function pay(amount, orderNo, userId, openid) {
  let json = {
    userId, // 被支持者id
    payPlatform: 2, // 支付方式 2 微信支付
    productOrderNo: orderNo,
  }

  return new Promise((resolve, reject) => {
    global.FUQIANLA.init({
      app_id: 'PU67NtmbXO0tio0N9ungvA',
      order_no: Date.now(),
      amount: String(Math.floor((Number(amount) * 100))),
      channel: 'wx_pay_pub',
      subject: '支付说明', // 支付说明
      notify_url: notifyUrl,
      optional: JSON.stringify(json),
      extra: {
        openid,
        cb: data => {
          cantClick = false
          wx.showToast({
            title: '支付成功',
          })
          resolve(data)
        },
        ecb: data => {
          cantClick = false
          wx.showToast({
            title: '支付失败',
          })
          reject(data)
        }
      }
    })
  })
}