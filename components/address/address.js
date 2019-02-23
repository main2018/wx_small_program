// components/address/address.js
Component({
  options: {
    addGlobalClass: true, // 使组件接受全局样式
  },
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
    region: ['', '', ''], // picker 值
    customItem: '' // 可为每一列的顶部添加一个自定义的项
  },

  /**
   * 组件的方法列表
   */
  methods: {
    switchChange(e) {
      const res = e.detail.value
      console.log('switch', res)
    },
    bindRegionChange(e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        region: e.detail.value
      })
    },
    hidePopup() {
      this.setData({popupShow: false})
    },
    radioChange(e) {
      console.log('radio发生change事件，携带value值为：', e.detail.value)
    }
  }
})
