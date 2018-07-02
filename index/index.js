Page({
  data: {
    selectTime: '请选择出生时间'
  },
  datechange: function(e) {
    console.log('回调' + e.detail)
    this.setData({
      selectTime: e.detail
    })
  }
})