import ajax from 'utils/api.js'
import {computed} from 'utils/vue-extend.js'

const computedBehavior = require('miniprogram-computed')

wx.$ajax = ajax
wx.$computed = computed // 页面的computed

wx.$computedBehavior = computedBehavior // 官方版组件的computed

wx.$showLoading = (title, mask = true) => {
  wx.showLoading({
    title: title || '加载中...',
    mask,
  })
}

//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    this.login()

    this.getWxParse()
  },
  login() {
    wx.login({
      success: res => {
        // console.log('app', res)
        const code = res.code

        if (!code) {
          this.login()
          return
        }
        this.globalData.code = code

        // 获取用户信息
        wx.getSetting({
          success: res => {
            if (res.authSetting['scope.userInfo']) {
              // 已授权
              this.getUserInfo(code)
            } else {
              this.getUserInfo(code)
              // 未授权
              
              // wx.authorize({ // 该接口已废弃
              //   scope: 'scope.userInfo',
              //   success: res => {
              //     this.getUserInfo(code)
              //   },
              //   fail: (e) => {
              //     //如果用户点击拒绝授权，则调用wx.openSetting 调起客户端小程序设置界面，返回用户设置的操作结果。在这边做了个封装
              //     // this.openSetting()
              //   }
              // })
            }
          }
        })
      }
    })
  },
  getUserInfo(code) {
    wx.getUserInfo({
      success: res => {
        this.getTokenAndUser(res)
      },
      fail: res => {
        if (this.userInfoFailCallback) {
          this.userInfoFailCallback()
        }
      }
    })
  },
  openSetting() {
    wx.showModal({                                    // modal 提示用户
      title: '提示',
      content: '小程序需要获取用户信息权限，点击确认。前往设置或退出程序？',
      showCancel: false,
      success: res => {
        wx.openSetting({                              // 调起客户端小程序设置界面
          success: (res) => {
            var userInfoFlag = res.authSetting['scope.userInfo'];    //拿到用户操作结果
            if (!userInfoFlag) {                        // 如果用户没有点开同意用户授权 ，则再调用openSetting 弹框提示，总之 同意了 才会关闭modal 进入我们小程序
              this.openSetting();
            } else {
              this.userLogin();                       // 用户成功设置授权后，再调用登录方法 ，给到后台 拿用户信息 等操作
            }
          }
        })
      }
    })
  },

  globalData: {
    userInfo: null,
    user: null,
    token: '',
    code: '',
  },
  getTokenAndUser(detail) {
    console.log('getTokenAndUser')
    const app = getApp()
    app.globalData.userInfo = detail.userInfo

    const { encryptedData, iv } = detail
    wx.$ajax('/api/auth/weixin/mplogin', { code: app.globalData.code, encryptedData, iv }).then(resp => {
      const token = resp && resp.msg
      app.globalData.token = token

      wx.$ajax('/api/platform/user/findUserByToken').then(resp => {
        app.globalData.user = resp

        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        if (app.userInfoReadyCallback) {
          app.userInfoReadyCallback(detail)
        }
      })
    })
  },
  getWxParse() {
    var WxParse = require('/plugins/wxParse/wxParse.js');
    wx.$WxParse = WxParse
  },
  // post
})