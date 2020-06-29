//index.js
var utils = require("../../utils/util.js");
var api = require("../../utils/API.js");
var moreList = require("../../utils/moreList.js")

const app = getApp()
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
      type: 2
    })
}
Page({
  data: {
    isIndex:true,
    userInfo:null,
    pgList:[],
    totleNum:"",//待办事项未读个数
    manager:false,//是否是管理员
    
  },
  
  onLoad: function () {
    console.log(app.manager)
   this.setData({
     userInfo: app.globalData.userInfo,
     manager: app.manager
   })
  },
  onReady:function(){
    
  },
  onShow:function(){
    var that = this;
    pagenum = 1;
    showData(that)
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
    that.setData({
      totleNum: res.data.totleNum
    })
    success(list)
    page++
  });

}