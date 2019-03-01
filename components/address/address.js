import WxValidate from "../../utils/extend/WxValidate.js";

// components/address/address.js
Component({
  behaviors: [wx.$computedBehavior],
  options: {
    addGlobalClass: true, // 使组件接受全局样式
  },
  /**
   * 组件的属性列表
   */
  properties: {
    addresss: {
      type: Array,
      value: []
    }
  },

  // observers: {
  //   'currentId': function (currentId) {
  //     console.log('currentId', currentId)
  //     const address = this.data.addresss.find(address => address.id === currentId)
  //     this.setData({
  //       useAddress: address || this.data.addresss.find(address => address.defaultAddress === 1) || {}
  //     })
  //   },
  // },
  created() {
    this.initValidate()

    // wx.$computed(this, {
    //   useAddress() {
    //     const address = this.data.addresss.find(address => address.id === this.data.currentId)
    //     return address || this.data.addresss.find(address => address.defaultAddress === 1) || {}
    //   },
    //   currentAddress() {
    //     return this.data.addresss[this.data.currentIndex] || {}
    //   },
    // })
  },
  computed: {
    user() {
      return getApp().globalData.user || {}
    },
    useAddress() {
      const addresss = this.data.addresss || []
      const address = addresss.find(address => address.id === this.data.currentId)
      return address || addresss.find(address => address.defaultAddress === 1) || {}
    },
    currentAddress() {
      return this.data.addresss[this.data.currentIndex] || {}
    },
  },
  observers: {
    useAddress: function(address) {
      this.triggerEvent('change', address)
    },
  },
  ready() {},
  /**
   * 组件的初始数据
   */
  data: {
    popupShow: false,
    editPopupShow: false,
    isEdit: false,
    currentIndex: -1,
    currentId: '',
    useAddress: {},
    region: [], // picker 值
    customItem: '' // 可为每一列的顶部添加一个自定义的项
  },

  /**
   * 组件的方法列表
   */
  methods: {
    delete() {
      wx.showModal({
        title: '提示',
        content: '确认删除？',
        success:(res) => {
          if (res.confirm) {
            const userId = this.data.user && this.data.user.user && this.data.user.user.id
            console.log('user', this.data.user)
            wx.$ajax('/api/platform/shipping/delete', { id: this.data.currentAddress.id, userId }).then(() => {
              wx.showToast({
                title: '删除成功',
              })
            })
          }
        },
      })
    },
    edit(e) {
      const currentIndex = e.currentTarget.dataset.index
      const currentAddress = this.data.addresss[currentIndex] || {}
      const { provinceName, cityName, districtName } = currentAddress

      this.setData({ isEdit: true, currentIndex, editPopupShow: true, region: [provinceName, cityName, districtName] })
    },
    showAddress() {
      this.setData({ popupShow: true })
    },
    initValidate() {
      const rules = {
        name: {
          required: true,
          minlength: 2
        },
        tel: {
          required: true,
          tel: true
        },
        area: {
          required: true,
        },
        addressDetail: {
          required: true,
        },
        postalCode: {
          required: true,
          rangelength: [6, 6],
        },
      }
      const messages = {
        name: {
          required: '请填写姓名',
          minlength: '请输入正确的名称'
        },
        tel: {
          required: '请填写手机号',
          tel: '请填写正确的手机号'
        },
        area: {
          required: '请选择地区',
        },
        addressDetail: {
          required: '请填写详细地址',
        },
        postalCode: {
          required: '请填写详细地址',
          rangelength: '邮编为5位数字',
        },
      }
      this.WxValidate = new WxValidate(rules, messages)
    },
    formSubmit(e) {
      const params = e.detail.value
      console.log('params', params)


      // 传入表单数据，调用验证方法
      if (!this.WxValidate.checkForm(params)) {
        const error = this.WxValidate.errorList[0]
        wx.showModal({
          content: error.msg,
          showCancel: false,
        })
        return false
      }

      const {
        name: receiverName,
        tel: receiverMobileNo,
        area,
        addressDetail: detailAddress,
        postalCode: receiverZipCode,
        isDefault,
      } = params

      const user = getApp().globalData.user || {}
      const data = {
        userId: user.user && user.user.id,
        receiverName,
        receiverMobileNo,
        provinceName: area[0],
        cityName: area[1],
        districtName: area[2],
        detailAddress,
        receiverZipCode,
        defaultAddress: isDefault ? 1 : 0, // 0 非默认 1 默认
      }
      let api = 'add'
      let text = '新增'
      if (this.data.isEdit) {
        api = 'update'
        text = '修改'
        data.id = this.data.currentAddress.id
      }

      wx.$ajax('/api/platform/shipping/' + api, data).then(resp => {
        console.log('add', resp)
        wx.showToast({
          title: `${text}收货地址成功`,
          icon: 'success',
          duration: 2000,
          mask: true,
          complete: () => {
            this.setData({ editPopupShow: false, currentId: '' })
            this.triggerEvent('submitSuccess')
          },
        })
      })
    },
    formReset() {
      console.log('form发生了reset事件')
    },
    addAddress() {
      this.setData({ editPopupShow: true })
    },
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
    hidePopup(e) {
      const popupName = e.currentTarget.dataset.popupname
      this.setData({ [popupName]: false})
    },
    radioChange(e) {
      const currentId = e.detail.value
      this.setData({ currentId })
    }
  }
})
