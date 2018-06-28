Page({
  data: {
    selectTime: '请选择出生时间',
    isUnclear: true
  },
  datechange: function(e) {
    // console.log(e.detail)
    this.setData({
      selectTime: e.detail
    })
  }
})