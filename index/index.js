Page({
  data: {
    selectTime: 'agc',
    color: ['rgba(0,0,0,.3)', '#333']
  },
  datechange: function(e) {
    console.log('回调' + e.detail)
    this.setData({
      selectTime: e.detail
    })
  },
  onShow() {
    this.setData({
      selectTime: [2016, 10, 2, 0]
    })
  }
})