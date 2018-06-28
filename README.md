
# wxDateSelector
wxDateSelector是用于微信小程序的一个日期选择器插件。鉴于目前微信小程序自带的日期选择器只能支持 年月日 或者 时分 的选择。并且不能设定时间的起止筛选而开发的微信小程序自定义组件，方便项目中快捷使用。

如果需要mpvue 时间选择插件 请移步 [mpvue-dateselector](https://github.com/NxGreen/mpvue-dateselector) 


----------


 ### 主要功能：
 1. 日期选择器支持到 年月日时分秒 最多6项选择，可以自定义精确到（月日时分秒）任意选择。
 2. 支持 起止 时间筛选。 比如支持 2000年1月1日0时0分0秒 到 2019年2月2日2时2分2秒 间的选择
 3. 支持设置默认时间。比如 默认 选择2016年10月10日10时10分10秒为选中状态
 4. 自定义组件方便更换皮肤。
 5. 日期格式支持 回调 自己组合数据 比如 2019-02-02 02:02:02 或者 2019年2月2日 2时2分2秒 等各种自定义。
 


----------


### 如何使用
index.wxml

```
<date-selector id="dateSelector"  beginTime="{{beginTime}}" endTime="{{endTime}}" selectTime="{{selectTime}}" bind:datechange="datechange">
      <view class="picker">{{ca.strHandle(selectTime)}}</view>
    </date-selector>
```

index.js
```
Page({
  data: {
    beginTime: [2000, 1, 1, 0, 0, 0],
    selectTime: [2016, 10,10, 10, 10,10],
    endTime: [2019, 2, 2, 2, 2, 2],
    defSelectTime:[2019, 2, 2, 2, 2, 2]
  },
  datechange: function (e) {
    console.log(e.detail)
    this.setData({
      selectTime: e.detail
    })
  }
})
```


----------


### 参数配置


| 参数 | 字符类型  |  取值  | 说明 | 
| -----| -----| -----| -----|
|  **beginTime**   |  {Array} |*eg:[2000, 1, 1, 0, 0, 0]    2000年1月1日0时0分0秒*| 设置开始时间点 |
|  **endTime** |  {Array} |同beginTime| 设置结束时间点 请确保beginTime、endTime、selectTime、defSelectTime 数组长度一样 |
|  **selectTime**  |  {Array,String} |为数组时,为当前选中时间;为string时,为占位符提示| 设置选中时间点，当为string时，为占位符显示的文字描述 eg:'请选择时间'， |
|  **defSelectTime**  |  {Array} |同beginTime| 设置默认选中时间点（当有占位符显示时，可以设置一个默认选中时间） |

tips:当设置selectTime为数组时，请确保beginTime、endTime、selectTime、defSelectTime 数组长度一样。即确保这4个参数精确到同样的小时、分、秒。

----------
### 其他

 - 开发此组件也是因为公司业务涉及到日期选择器使用的频繁度，而刚刚微信小程序自带插件又无法满足需求。
 - 此组件开发的大部分思路也是来源于[AppianZ][1]，本人菜鸟，全靠大神带路。感谢中...
 


  [1]: https://github.com/AppianZ/multi-picker/tree/master/DateSelector

