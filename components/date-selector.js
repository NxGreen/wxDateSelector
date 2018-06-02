Component({
  properties: {
    //eg:[0, 1, 1, 1, 1] 设置单位，元素分别对应设置['year', 'month', 'day', 'hour', 'minute'], 1为需要，0为不需要, 需要为连续的1
    param:{
      type: Array,
      value: [1, 1, 1, 1, 1]
    },
    //eg:[3,27,12,12] 3月27日12点12分 设置开始时间点,空数组默认设置成1970年1月1日0时0分开始，数组的值对应param参数的对应值。
    beginTime: {
      type: Array,
      value: [1, 1, 1, 1, 1]
    },
    //设置结束时间点, 空数组默认设置成次年12月31日23时59分结束，数组的值对应param参数的对应值
    endTime: {
      type: Array,
      value: [1, 1, 1, 1, 1]
    },
    //设置当前时间点,空数组默认设置为系统当前时间，数组的值对应param参数的对应值。
    dateIndex: {
      type: Array,
      value: [0,0,0,0,0]
    }
  },
  data: {
    // 这里是一些组件内部数据
    //如果设置 dateIndex 必须要填上数据，不然显示会报错。--- 和 .wxs运行机制有关
    //["2018年", "2017年"], ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"], ["1日", "2日", "3日", "4日", "5日", "6日", "7日", "8日", "9日", "10日", "11日", "12日", "13日", "14日", "15日", "16日", "17日", "18日", "19日", "20日", "21日", "22日", "23日", "24日", "25日", "26日", "27日", "28日", "29日", "30日", "31日"], ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"]
    date: []
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
    },
    /**
       * 出生日期 年月日 三级联动 
       */
    bindDateColumnChange: function (e) {
      console.log('修改的列为', e.detail.column, '，值的下标为', e.detail.value);
      var _column = e.detail.column,
        _value = e.detail.value,
        _year = '',
        that = this;
      var data = {
        date: this.data.date,
        dateIndex: this.data.dateIndex
      };
      data.dateIndex[_column] = _value;

      if (_column == 0) {  // 年份的变化 
        _year = data.date[0][_value].slice(0, -1);
        data = that.yearSetDate(data, _year);
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
    buildArr: function (star, end, company) {
      var arr = [];
      for (var i = star; i <= end; i++) {
        arr.push(i + company)
      }
      return arr;
    },
    /**
     * 初始化 date 日期时间二维数组 100年
     */
    makeDate: function () {
      var arr = [], _date = new Date(),
        now_year = _date.getFullYear();
      arr.push(
        this.buildArr(now_year - 100, now_year, "年"),
        this.buildArr(1, 12, "月"),
        this.buildArr(1, 31, "日"),
        this.buildArr(0, 23, "")
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
    var that = this;
    this.setData({
      date: that.makeDate(),
      dateIndex:that.data.dateIndex
    })
    console.log(this.data.date)
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