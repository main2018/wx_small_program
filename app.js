import ajax from 'utils/api.js'
import {computed} from 'utils/vue-extend.js'

wx.$ajax = ajax
wx.$computed = computed

//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        console.log('app', res)
        const code = res.code
        if (!code) return

        wx.getUserInfo({
          success: res => {
            const { encryptedData, iv} = res
            ajax('/api/auth/weixin/mplogin', {code, encryptedData, iv}).then(resp => {
              const token = resp && resp.msg
              this.globalData.token = token

              ajax('/api/platform/user/findUserByToken').then(resp => {
                this.globalData.user = resp

                console.log('user', this.globalData.user)
                if (this.getUserCB) {
                  this.getUserCB(resp)
                }
              })
            })
          }
        })
        // ajax('/api/auth/weixin/mplogin', {code, encryptedData, iv}).then(resp => {
        //   console.log('code', resp)
        // })
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      },
      fail: err => {}
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

    this.getWxParse()
  },
  globalData: {
    userInfo: null,
    user: null,
    token: '',
  },
  getWxParse() {
    var WxParse = require('/plugins/wxParse/wxParse.js');
    wx.$WxParse = WxParse
  },
  // post
})