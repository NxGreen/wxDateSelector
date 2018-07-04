Page({
  data: {
    selectTime: [2016, 10, 2, 0],
    color: ['#eee', '#fff']
  },
  datechange: function(e) {
    console.log('回调' + e.detail)
    this.setData({
      selectTime: e.detail
    })
  }
})