const REMOTE_ADDRESS = 'http://192.168.0.102:8081'

const CONTENT_TYPE = {
  FORM_DATA: 'multipart/form-data; charset=UTF-8',
  FORM: 'application/x-www-form-urlencoded; charset=UTF-8',
  JSON: 'application/json; charset=UTF-8'
}

function ajax(url, data = {}, contenttype = 'FORM', method = 'POST') {
  const app = getApp()
  
  return new Promise((resolve, reject) => {
    wx.request({
      header: {
        // 'Authorization': accessToken,
        'content-type': CONTENT_TYPE[contenttype],
        'Authorization': app.globalData.token || ''
      },
      data,
      url: REMOTE_ADDRESS + url,
      method,
      success: res => {
        if (res && res.data && res.data.code === 200) {
          resolve(res && res.data && res.data.data || res.data)
        } else {
          wx.showToast({
            title: (res && res.data && res.data.msg) || '失败',
            icon: 'warn',
            duration: 2000
          })
          reject(res && res.data)
        }
      },
      fail: err => {
        wx.showToast({
          title: (err && err.errMsg) || '失败',
          icon: 'warn',
          duration: 2000
        })
        reject(err)
      }
    })
  })
}

export default ajax
// module.exports = {
//   post
// }