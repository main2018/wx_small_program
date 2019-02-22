// components/sku/sku.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    value: {
      type: Number,
      value: 1
    },
    max: {
      type: Number,
      value: 10
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    close() {
      this.triggerEvent('close')
    },
    onChange(e) {
      this.triggerEvent('change', e.detail)
    },
    confirm() {
      this.triggerEvent('confirm')
    },
  }
})
