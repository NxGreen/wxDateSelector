Page({
  data: {
    selectTime: '请选择出生日期'
  },
  datechange: function(e) {
    // console.log(e.detail)
    this.setData({
      selectTime: e.detail
    })
  }
})