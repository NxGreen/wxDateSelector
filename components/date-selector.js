Component({
  properties: {
    //eg:[0, 1, 1, 1, 1] 设置单位，元素分别对应设置['year', 'month', 'day', 'hour', 'minute'], 1为需要，0为不需要, 需要为连续的1
    param: {
      type: Array,
      value: [1, 1, 1, 1, 1, 1]
    },
    //eg:[3,27,12,12] 3月27日12点12分 设置开始时间点,空数组默认设置成1900年1月1日0时0分开始，数组的值对应param参数的对应值。
    beginTime: {
      type: Array,
      value: [1900, 1, 1, 0, 0, 0]
    },
    //设置结束时间点, 空数组默认设置成次年12月31日23时59分结束，数组的值对应param参数的对应值
    endTime: {
      type: Array,
      value: [1, 1, 1, 1, 1, 1]
    },
    //设置当前时间点,空数组默认设置为系统当前时间，数组的值对应param参数的对应值。
    recentTime: {
      type: Array,
      value: [0, 0, 0, 0, 0, 0]
    }
  },
  data: {
    // 这里是一些组件内部数据  通过 recentTime 和 beginTime 换算出 dateIndex
    dateIndex: [0, 0, 0, 0, 0, 0]
  },
  methods: {
    /**
    * 出生日期  change 事件（点击确定后）
    */
    bindDateChange: function (e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        dateIndex: e.detail.value
      })
      var _beginTime = this.data.beginTime,
        _dateIndex = this.data.dateIndex;
      var _arr = [
        _beginTime[0] + _dateIndex[0],
        _dateIndex[1] + 1,
        _dateIndex[2] + 1,
        _dateIndex[3],
        _dateIndex[4]
      ];
      console.log(_arr)
      this.setData({
        recentTime: _arr
      })
      //传递给组件外使用
      this.triggerEvent('datechange', _arr)
    },

    /**
       * 出生日期 年月日 三级联动 
       */
    bindDateColumnChange: function (e) {
      console.log('修改的列为', e.detail.column, '，值的下标为', e.detail.value);
      var _column = e.detail.column,
        _value = e.detail.value,
        _year = '',_beginTime=this.data.beginTime,_endTime=this.data.endTime,
        that = this;
      var data = {
        date: this.data.date,
        dateIndex: this.data.dateIndex
      };
      data.dateIndex[_column] = _value;

      if (_column == 0) {  // 年份的变化 
        _year = data.date[0][_value].slice(0, -1);
        data = that.yearSetDate(data, _year);
        // if(_year==_beginTime[0]){
          
        // }else if(_year==_endTime[0]){
        //   _endTime[1]
        // }
        data.dateIndex[1] = 0;
        data.dateIndex[2] = 0;
      } else if (_column == 1) {  //月份的变化 
        _year = data.dateIndex[0] + parseInt(data.date[0][0].slice(0, -1));
        data = that.yearSetDate(data, _year);
        data.dateIndex[2] = 0;
      }
      this.setData(data);


    },

    /**
     * eg:this.buildArr(1990,2018,"年")
     */
    buildArr: function (_star, _end, company) {
      var arr = [];
      var end = Math.max(_star, _end),
        star = Math.min(_star, _end);
      for (var i = star; i <= end; i++) {
        arr.push(i + company)
      }
      return arr;
    },
    /**
     * 初始化 date 日期时间二维数组
     */
    makeDate: function () {
      var arr = [], _date = new Date(),
        param = this.data.parm,
        beginTime = this.data.beginTime,
        recentTime = this.data.recentTime,
        endTime = this.data.endTime;
      
      arr.push(
        this.buildArr(beginTime[0], endTime[0], "年"),
        this.buildArr(1, 12, "月"),
        this.buildArr(1, 31, "日"),
        this.buildArr(0, 23, "时"),
        this.buildArr(0, 59, "分"),
        this.buildArr(0, 59, "秒")
      )
      // console.log(arr)
      return arr;
    },
    /**
       * 判断指定年份是否为闰年
       */
    isleap: function (_year) {
      var isleap = _year % 4 == 0 && _year % 100 != 0 || _year % 400 == 0;
      return isleap;
    },
    /**
     * 根据年月份 设置 天数日期。
     */
    yearSetDate: function (data, _year) {
      var that = this;
      var nowDate = new Date(),
        now_year = nowDate.getFullYear(),
        now_month = nowDate.getMonth() + 1,
        now_Date = nowDate.getDate(),
        now_hours = nowDate.getHours();
      //根据年份、月份 处理 天数变化
      // console.log("年份" + _year +  "处理日期" + data.dateIndex[1])
      switch (data.dateIndex[1]) {
        case 0: case 2: case 4: case 6: case 7: case 9: case 11: //1,3,5,7,8,10,12月份 31天
          data.date[2] = that.buildArr(1, 31, "日");
          break;
        case 3: case 5: case 8: case 10: //4,6,9,11 月份 30天
          data.date[2] = that.buildArr(1, 30, "日");
          break;
        case 1: //2月份 闰年29天  平年28天 区分
          // console.log("是否是闰年：" + that.isleap(_year))
          if (that.isleap(_year)) {
            data.date[2] = that.buildArr(1, 29, "日");
          } else {
            data.date[2] = that.buildArr(1, 28, "日");
          }
        default:
      }
      //当前年份时 -月份数，日期不得超过当前时间
      if (_year == now_year) {
        data.date[1] = that.buildArr(1, now_month, "月");
        data.date[2] = that.buildArr(1, now_Date, "日");
      } else {
        data.date[1] = that.buildArr(1, 12, "月");
      }
      return data;
    }
  },


  /**
   * 生命周期函数--在组件实例进入页面节点树时执行，注意此时不能调用 setData
   */
  created: function () {
    // console.log(this.data.param)

  },

  /**
   * 生命周期函数--在组件实例进入页面节点树时执行
   */
  attached: function () {
    var that = this, _beginTime, _recentTime;
    //dateIndex 需做处理 微信value 每一项的值表示选择了 range 对应项中的第几个（下标从 0 开始）
    _beginTime = this.data.beginTime, //[1991,3,2,3,4]    1991年3月2日 3时4分
      _recentTime = this.data.recentTime;// [1992,5,3,14,20]  1992年5月3日 14时20分 需要转换成 [1, 4, 2, 14, 20]
    var arr = [
      _recentTime[0] - _beginTime[0],
      _recentTime[1] - 1,
      _recentTime[2] - 1,
      _recentTime[3],
      _recentTime[4]
    ]

    this.setData({
      date: that.makeDate(),
      dateIndex: arr
    })
    console.log(this.data.dateIndex)
  },

  /**
   * 生命周期函数--在组件布局完成后执行，此时可以获取节点信息（使用 SelectorQuery ）
   */
  ready: function () {

  },

  /**
   * 生命周期函数--在组件实例被移动到节点树另一个位置时执行
   */
  moved: function () {

  },

  /**
   * 生命周期函数--在组件实例被从页面节点树移除时执行
   */
  detached: function () {

  }
})