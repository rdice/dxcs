// pages/project/more/dbsxList.js
var utils = require("../../../utils/util.js");
var moreList = require("../../../utils/moreList.js")
var api = require("../../../utils/API.js");
var pagenum = 1;

function showData(that) {
  getList(that.data.pgList, that, api.todoListList, pagenum, function (res) {
    console.log(res)
    that.setData({
      pgList: res
    })
    setTimeout(function () {
      wx.hideToast()
    }, 500)
  }, 10, {
    lawCaseId: that.data.id,
    type: that.data.tp,
    status:that.data.tp-1,
  })
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dbsx: ["我的待办", "律师待办"],
    pgList: [],
    id: "", //项目id
    dbsxIdx: 0,
    tp: 1
  },
  // 待办事项
  switchDbsx: function (e) {
    console.log(e)
    var idx = e.detail.idx;
    if (idx == 0) { //服务律师的
      this.setData({
        tp: 1
      })
    } else {
      this.setData({
        tp: 2
      })
    }
    this.setData({
      dbsxIdx: e.detail.idx
    })
    pagenum = 1;
    showData(this)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {


  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    pagenum = 1;
    showData(this);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    pagenum = 1;
    that.setData({
      pgList: []
    })
    moreList.showToast("刷新中");

    setTimeout(function () {
      wx.stopPullDownRefresh({
        complete: function (res) {
          showData(that)
        }
      })
    }, 500);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;


    if (that.data.pgList.length % 10 == 0 && that.data.pgList.length >= pagenum * 10) {

      moreList.showToast("加载中");
      pagenum++
      showData(that)

    } else {
      moreList.showToast("没有更多了...", 500)
    }
  },
})
//加载更多
function getList(dataList, that, url, page, success, page_size = 10, parameters = {}) {
  if (page == 1) {
    dataList = []
  }
  parameters.pageNum = page;
  utils.request(url, parameters, function (res) {
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