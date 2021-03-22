// pages/project/more/dbsxList.js
var utils = require("../../../utils/util.js");
var moreList = require("../../../utils/moreList.js")
var api = require("../../../utils/API.js");
var pagenum = 1;

function showData(that) {
  var qhidx = that.data.qhidx;
  var dbidx = that.data.dbidx;
  var status; // 0 我的待办    2 我的已完成     1律师待办    3律师已完成
  if(qhidx==0){
    if(dbidx==0){
      status=0
    }else{
      status=2
    }
  }else{
    if(dbidx==0){
      status=1
    }else{
      status=3
    }
  }

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
    status: status,
  })
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pgList: [],
    id: "", //项目id

    dbsx: ["我的待办", "律师待办"],
    qhidx: 0, //0我的待办1律师待办

    pgS: ["待办", "已完成"],
    pgStitle: "待办",
    dbidx: 0, //0待办1已完成
    isPg:false,//是否显示

    
  },
  // 待办事项
  switchDbsx: function (e) {
    console.log(e.detail.idx)
    this.setData({
      qhidx: e.detail.idx,
      pgList:[]
    })
    pagenum = 1;
    moreList.showToast("加载中");
    showData(this)
  },
  // 是否显示下拉框
  isPgShow:function(){
    var i = this.data.isPg;
    this.setData({
      isPg:!i
    })
  },
  // 待办-已完成
  switchPg: function (e) {
    var idx = e.currentTarget.dataset.idx;
    
    this.setData({
      dbidx: e.currentTarget.dataset.idx,
      pgStitle:idx==0?"待办":"已完成",
      isPg:!this.data.isPg,
      pgList:[]
    })
    pagenum = 1;
    moreList.showToast("加载中");
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