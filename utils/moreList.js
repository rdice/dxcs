var app = getApp();
var utils = require("./util.js");
//请稍后
function showToast(title = "请稍后", duration = 8000) {
  wx.showToast({
    title: title,
    icon: 'loading',
    duration: duration,
    mask: true
  })
}
//加载更多
function getList(dataList, that, url, page, success, page_size=10, parameters = {}) {
  if (page == 1) {
    dataList = []
  }
  parameters.pageNum = page;
  utils.request(url, parameters, function (res) {
    console.log(res)
    var list = dataList;
    if (page == 0 && page_size < 9) {
      if (page == 0 && page_size > res.data.length) {
        for (var i = 0; i < res.data.length; i++) {
          list.push(res.data[i]);
        }
      } else {
        for (var i = 0; i < page_size; i++) {
          list.push(res.data[i]);
        }
      }
    } else {
      for (var i = 0; i < res.data.length; i++) {
        list.push(res.data[i]);
      }
    }
    success(list)
    page++
  });
  
}
// 多获取一层list
function getList2(dataList, that, url, page, success, page_size = 10, parameters = {}) {
  if (page == 1) {
    dataList = []
  }
  parameters.pageNum = page;
  utils.request(url, parameters, function (res) {
    console.log(res)
    var arr = res.data.list;
    var list = dataList;
    if (page == 0 && page_size < 9) {
      if (page == 0 && page_size > arr.length) {
        for (var i = 0; i < arr.length; i++) {
          list.push(arr[i]);
        }
      } else {
        for (var i = 0; i < page_size; i++) {
          list.push(arr[i]);
        }
      }
    } else {
      for (var i = 0; i < arr.length; i++) {
        list.push(arr[i]);
      }
    }
 
    success(list)
    page++
  });

}
module.exports = {
  getList: getList,
  showToast:showToast,
  getList2:getList2
}