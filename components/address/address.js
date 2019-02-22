// components/address/address.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    popupShow: true,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    hidePopup() {
      this.setData({popupShow: false})
    },
    radioChange(e) {
      console.log('radio发生change事件，携带value值为：', e.detail.value)
    }
  }
})
