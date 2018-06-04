Page({
  data: {
    beginTime: [2000, 1, 1, 0, 0, 0],
    recentTime: [2016, 10,10, 10, 10,10],
    endTime: [2019, 2, 2, 2, 2, 2]
  },
  datechange: function (e) {
    // console.log(e.detail)
    this.setData({
      recentTime: e.detail
    })
  }
})
