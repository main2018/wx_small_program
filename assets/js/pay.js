export function saveorderAndTobuy(commodity) {
  if (!commodity) return

  const order = {
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
  }
  wx.setStorageSync('order', order)

  wx.navigateTo({
    url: '/pages/buy/buy'
  })
}