const app = getApp()

Page({
  data: {
    // param:[0, 1, 1, 1, 1,1],
    beginTime: [2000, 3, 2, 3, 4, 34],
    endTime:[2018, 1, 1, 1, 1, 43],
    recentTime: [2003, 5, 3, 14, 20, 59] 
  },
  onLoad: function () {
    console.log('https://mp.weixin.qq.com/debug/wxadoc/dev/devtools/devtools.html')
  },

  datechange:function(e){
    console.log(e.detail)

    this.setData({
      recentTime: e.detail
    })
  }
})
