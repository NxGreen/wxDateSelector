Component({
  properties: {
    //eg:[1990,3,27,12,12,59] 1990年3月27日12点12分59秒	设置开始时间点
    beginTime: {
      type: Array,
      value: [1900, 1, 1, 0, 0, 0]
    },
    //设置结束时间点, 
    endTime: {
      type: Array,
      value: [1, 1, 1, 1, 1, 1]
    },
    //设置当前时间点,
    recentTime: {
      type: Array,
      value: [0, 0, 0, 0, 0, 0]
    }
  },
  data: {
    // 这里是一些组件内部数据 
    dateIndex: [0, 0, 0, 0, 0, 0],
    date: []
  },
  methods: {
    /**
    * 出生日期  change 事件（点击确定后）
    */
    bindDateChange: function (e) {
      // console.log('picker发送选择改变，携带值为', e.detail.value)
      var _beginTime = this.data.beginTime,
        _recentTime = this.data.recentTime,
        _dateIndex = this.data.dateIndex;
      // console.log(_recentTime)
      this.setData({
        recentTime: _recentTime
      })
      //传递给组件外使用
      this.triggerEvent('datechange', _recentTime)
    },

    /**
     * 出生日期 年月日 三级联动 
     */
    bindDateColumnChange: function (e) {
      // console.log('修改的列为', e.detail.column, '，值的下标为', e.detail.value);
      var _column = e.detail.column,
        _value = e.detail.value,
        _beginTime = this.data.beginTime,
        _endTime = this.data.endTime,
        _recentTime = this.data.recentTime;

      var _curRV = this.data.dateIndex[_column];//变化前 recentTime 下标
      var dir = _value - _curRV;// 方向 >0 向下； <0 向上 

      _recentTime[_column] = _recentTime[_column] + dir;

      var bt = new Date(_beginTime[0], _beginTime[1], _beginTime[2], _beginTime[3], _beginTime[4]).getTime();
      var et = new Date(_endTime[0], _endTime[1], _endTime[2], _endTime[3], _endTime[4]).getTime();
      var rt = new Date(_recentTime[0], _recentTime[1], _recentTime[2], _recentTime[3], _recentTime[4]).getTime();
      rt < bt ? (_recentTime = _beginTime) : "";
      rt > et ? (_recentTime = _endTime) : "";

      var _data = this.makeDate(_recentTime);
      this.setData({
        date: _data.date,
        dateIndex: _data.dateIndex,
        recentTime: _recentTime
      })
      this.triggerEvent('datechange', _recentTime)
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
    loop: function (begin, length, fuc) {
      for (var i = begin; i < length; i++) {
        if (fuc(i)) break;
      }
    },
    checkTimeArr: function (arr1, arr2, length) {
      var checkStatus = true;
      this.loop(0, length, function (i) {
        if (arr1[i] != arr2[i]) checkStatus = false;
      });
      return checkStatus;
    },
    checkRang: function (min, max, cur) {
      if (min <= cur && max >= cur) {
        return cur;
      } else {
        return (cur - min < cur - max) ? min : max;
      }
    },

    /**
     * 初始化 date 日期时间二维数组
     */
    makeDate: function (recentTime) {
      var arr = [], _date = new Date(), that = this,
        beginTime = this.data.beginTime,
        recentTime = recentTime ? recentTime : this.data.recentTime,
        endTime = this.data.endTime,
        dateIndex = [];
      this.loop(0, beginTime.length, function (i) {
        var min = 0, max = 0, cur = 0;
        switch (i) {
          case 0:
            arr.push(that.buildArr(beginTime[i], endTime[i], "年"));
            dateIndex[i] = recentTime[i] - beginTime[i];
            break;
          case 1:
            min = that.checkTimeArr(beginTime, recentTime, 1) ? beginTime[i] : 1;
            max = that.checkTimeArr(endTime, recentTime, 1) ? endTime[i] : 12;
            // console.log(min+":"+max);
            dateIndex[i] = that.checkTimeArr(beginTime, recentTime, 1) ? recentTime[i] - beginTime[i] : recentTime[i] - 1;
            arr.push(that.buildArr(min, max, "月"))
            break;
          case 2:
            min = that.checkTimeArr(beginTime, recentTime, 2) ? beginTime[i] : 1;
            max = that.checkTimeArr(endTime, recentTime, 2) ? endTime[i] : new Date(recentTime[0], recentTime[1], 0).getDate();
            // console.log(min + ":" + max);
            dateIndex[i] = that.checkTimeArr(beginTime, recentTime, 2) ? recentTime[i] - beginTime[i] : recentTime[i] - 1;
            arr.push(that.buildArr(min, max, "日"))
            break;
          case 3:
            min = that.checkTimeArr(beginTime, recentTime, 3) ? beginTime[i] : 0;
            max = that.checkTimeArr(endTime, recentTime, 3) ? endTime[i] : 23;
            // console.log(min + ":" + max);
            dateIndex[i] = that.checkTimeArr(beginTime, recentTime, 3) ? recentTime[i] - beginTime[i] : recentTime[i];
            arr.push(that.buildArr(min, max, "时"))
            break;
          case 4:
            min = that.checkTimeArr(beginTime, recentTime, 4) ? beginTime[i] : 0;
            max = that.checkTimeArr(endTime, recentTime, 4) ? endTime[i] : 59;
            // console.log(min + ":" + max);
            dateIndex[i] = that.checkTimeArr(beginTime, recentTime, 4) ? recentTime[i] - beginTime[i] : recentTime[i];
            arr.push(that.buildArr(min, max, "分"))
            break;
          case 5:
            min = that.checkTimeArr(beginTime, recentTime, 5) ? beginTime[i] : 0;
            max = that.checkTimeArr(endTime, recentTime, 5) ? endTime[i] : 59;
            // console.log(min + ":" + max);
            dateIndex[i] = that.checkTimeArr(beginTime, recentTime, 5) ? recentTime[i] - beginTime[i] : recentTime[i];
            arr.push(that.buildArr(min, max, "秒"))
            break;
        }
      })
      // console.log(dateIndex)
      // console.log(recentTime)
      return {
        date: arr,
        dateIndex: dateIndex,
        recentTime: recentTime
      };
    },
    /**
       * 判断指定年份是否为闰年
       */
    isleap: function (_year) {
      var isleap = _year % 4 == 0 && _year % 100 != 0 || _year % 400 == 0;
      return isleap;
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
    var _data = this.makeDate(0);
    this.setData({
      date: _data.date,
      dateIndex: _data.dateIndex
    })
    // console.log(this.data.date)
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