// pages/index/details/serviceLawyer.js
var app = getApp();
var util = require("../../../utils/util.js");
var moreList = require("../../../utils/moreList.js")
var api = require("../../../utils/API.js");
var pagenum = 1;
function showData(that) {
  moreList.getList(that.data.pgList, that, api.getLegalServiceLawyer, pagenum, function (res) {
    console.log(res)
    that.setData({
      pgList: res
    })
    setTimeout(function () {
      wx.hideToast()
    }, 500)
  })
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pgList: [],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
 
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    pagenum = 1;
    showData(this);

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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