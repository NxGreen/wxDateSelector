Component({
  properties: {
    //eg:[1990,3,27,12,12,59] 1990年3月27日12点12分59秒	设置开始时间点
    beginTime: {
      type: Array,
      value: [1949, 10, 1, 0]
    },
    //设置结束时间点, 默认为空数组时，自动设置为当天时间
    endTime: {
      type: Array,
      value: []
    },
    defSelectTime: {
      // 默认选中时间
      type: Array,
      value: [1990, 6, 16, 0]
    },
    //设置当前时间点,
    selectTime: {
      type: null,
      value: [1990, 6, 16, 0]
    },
    isUnclear: {
      // 是否添加小时 不清楚 选项
      type: Boolean,
      value: true
    },
    // 组件样式 [0]为默认占位符样式 [1]为选中样式
    color: {
      type: Array,
      value: ['#eee', '#333']
    }
  },
  data: {
    // 这里是一些组件内部数据 
    dateIndex: [1, 1, 1, 1],
    date: [], // 时间数据
    recentTime: [1990, 6, 16, 0], // 存储选中时间 对应 properties-selectTime
    // endTime:[],
    placeholderShow: true, // 默认显示 占位符
    placeholder: '公历年月日小时',
    bMillisecond: 0, //beginTime 的毫秒数
    eMillisecond: 0 //endTime 的毫秒数
  },
  methods: {
    /**
     * 出生日期  change 事件（点击确定后）
     */
    bindDateChange: function(e) {
      // console.log('picker发送选择改变，携带值为', e.detail.value)

      // 当快速滚动下拉框 再迅速点击确认后 会导致数据不更新
      // 对比dateindex 和e.mp.detail.value 不同进行更新数据
      let [_col, _val, isEqual, arr] = [0, 0, true, e.detail.value]
      for (let i = 0; i < this.data.dateIndex.length; i++) {
        let item = this.data.dateIndex[i]
        if (item != arr[i]) {
          _col = i
          _val = arr[i]
          isEqual = false
          break
        }
      }

      if (isEqual) {
        var _recentTime = this.data.recentTime;
        // console.log(_recentTime)
        this.setData({
          recentTime: _recentTime,
          placeholderShow: false
        })
        //传递给组件外使用
        this.triggerEvent('datechange', _recentTime)
      } else {
        this.update(_col, _val)
      }
    },

    /**
     * 出生日期 年月日 三级联动 
     */
    bindDateColumnChange: function(e) {
      // console.log('修改的列为', e.detail.column, '，值的下标为', e.detail.value);
      this.update(e.detail.column, e.detail.value)
    },
    update: function(_column, _value) {
      var _beginTime = this.data.beginTime,
        _endTime = this.data.endTime,
        _recentTime = this.data.recentTime;
      var _curRV = this.data.dateIndex[_column]; //变化前 recentTime 下标
      var dir = _value - _curRV; // 方向 >0 向下； <0 向上 
      _recentTime[_column] = _recentTime[_column] + dir;

      var rt = this.changMillisecond(_recentTime)

      rt < this.data.bMillisecond ? (_recentTime = _beginTime.concat()) : "";
      rt > this.data.eMillisecond ? (_recentTime = _endTime.concat()) : "";
      // console.log(_recentTime)
      if (this.data.isUnclear && _column == 3 && _value == 0) {
        _recentTime[_column] = -1
      }

      var _data = this.makeDate(_recentTime);
      this.setData({
        date: _data.date,
        dateIndex: _data.dateIndex,
        recentTime: _recentTime,
        placeholderShow: false
      })
      this.triggerEvent('datechange', _recentTime)
    },

    /**
     * eg:this.buildArr(1990,2018,"年")
     */
    buildArr: function(_star, _end, company, _isUnclear) {
      var arr = [];
      var end = Math.max(_star, _end),
        star = Math.min(_star, _end);
      for (var i = star; i <= end; i++) {
        arr.push(i + company)
      }
      if (_isUnclear) {
        arr.unshift('不清楚')
      }
      return arr;
    },
    loop: function(begin, length, fuc) {
      for (var i = begin; i < length; i++) {
        if (fuc(i)) break;
      }
    },
    checkTimeArr: function(arr1, arr2, length) {
      var checkStatus = true;
      this.loop(0, length, function(i) {
        if (arr1[i] != arr2[i]) checkStatus = false;
      });
      return checkStatus;
    },
    checkRang: function(min, max, cur) {
      if (min <= cur && max >= cur) {
        return cur;
      } else {
        return (cur - min < cur - max) ? min : max;
      }
    },

    /**
     * 初始化 date 日期时间二维数组
     */
    makeDate: function(recentTime) {
      // console.log('makeDate:' + recentTime)
      var arr = [],
        _date = new Date(),
        that = this,
        beginTime = this.data.beginTime,
        recentTime = recentTime ? recentTime : this.data.recentTime,
        endTime = this.data.endTime,
        dateIndex = [];
      this.loop(0, beginTime.length, function(i) {
        var min = 0,
          max = 0,
          cur = 0;
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
            dateIndex[i] = that.checkTimeArr(beginTime, recentTime, 3) ? recentTime[i] - beginTime[i] : recentTime[i];
            // 处理时间不清楚
            if (that.data.isUnclear) {
              dateIndex[i] += 1
              dateIndex[i] = dateIndex[i] <= -1 ? 0 : dateIndex[i]
            }
            // console.log(beginTime, recentTime, endTime, min, max, dateIndex[i]);
            arr.push(that.buildArr(min, max, "时", that.data.isUnclear))
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
    changMillisecond: function(arr) {
      var tempArr = arr.concat();
      for (var i = 0; i < 6; i++) {
        if (!arr[i]) {
          tempArr[i] = 0
        } else {
          tempArr[i] = arr[i]
        }
      }
      return new Date(tempArr[0], tempArr[1] - 1, tempArr[2], tempArr[3], tempArr[4], tempArr[5]).getTime()
    },
    init: function() {
      var _recentTime, _endTime = this.data.endTime,
        _placeholder = this.data.placeholder,
        _placeholderShow = this.data.placeholderShow
      if (typeof this.data.selectTime == 'string') { //占位符
        _recentTime = this.data.defSelectTime.concat()
        _placeholder = this.data.selectTime
      } else { // 有默认选中项
        _recentTime = this.data.selectTime.concat()
        _placeholderShow = false
      }

      if (_endTime.length <= 0) {
        var now = new Date()
        var year = now.getFullYear()
        var month = now.getMonth() + 1
        var day = now.getDate()
        var hours = now.getHours()
        _endTime = [year, month, day, hours]
      }

      this.setData({
        recentTime: _recentTime,
        endTime: _endTime,
        placeholder: _placeholder,
        placeholderShow: _placeholderShow
      })

      // console.log(_recentTime)
      var _data = this.makeDate(_recentTime)
      // console.log(_data)
      this.setData({
        date: _data.date,
        dateIndex: _data.dateIndex,
        recentTime: _data.recentTime,
        bMillisecond: this.changMillisecond(this.data.beginTime),
        eMillisecond: this.changMillisecond(this.data.endTime)
      })
    }
  },
  onShow() {

  },


  /**
   * 生命周期函数--在组件实例进入页面节点树时执行，注意此时不能调用 setData
   */
  created: function() {},

  /**
   * 生命周期函数--在组件实例进入页面节点树时执行
   */
  attached: function() {

    this.init()
    // console.log(this.data.date)
  },

  /**
   * 生命周期函数--在组件布局完成后执行，此时可以获取节点信息（使用 SelectorQuery ）
   */
  ready: function() {

  },

  /**
   * 生命周期函数--在组件实例被移动到节点树另一个位置时执行
   */
  moved: function() {

  },

  /**
   * 生命周期函数--在组件实例被从页面节点树移除时执行
   */
  detached: function() {

  }
})