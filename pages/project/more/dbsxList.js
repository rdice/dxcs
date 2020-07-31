// pages/project/more/dbsxList.js
var utils = require("../../../utils/util.js");
var moreList = require("../../../utils/moreList.js")
var api = require("../../../utils/API.js");
var pagenum = 1;

function showData(that) {
  
  moreList.getList2(that.data.pgList, that, api.todoListList, pagenum, function (res) {
    console.log(res)
    that.setData({
      pgList: res
    })
    setTimeout(function () {
      wx.hideToast()
    }, 500)
  }, 10, {
    lawCaseId: that.data.id,
    status:that.data.status,
  })
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dbsx: ["待办", "已完成"],
    pgList: [],
    id: "", //项目id
    qhidx: 0,//0我的待办1律师待办
    tp: 1,//1我的待办2律师待办
    dbidx:0,//0待办1已完成
    status:0,
  },
  // 待办事项
  switchDbsx: function (e) {
    console.log(e.detail.idx)
    let idx = e.detail.idx
    if(this.data.qhidx==0){
      if(idx==0){
        this.setData({
          status:0
        })
      }else{
        this.setData({
          status:2
        })
      }
    }else{
      if(idx==0){
        this.setData({
          status:1
        })
      }else{
        this.setData({
          status:2
        })
      }
    }
    
  
    pagenum = 1;
    moreList.showToast("加载中");
    showData(this)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
      qhidx:options.idx
    })
    var idx = options.idx;
    if (idx == 0) { //服务律师的
      this.setData({
        tp: 1
      })
    } else {
      this.setData({
        tp: 2
      })
    }
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
