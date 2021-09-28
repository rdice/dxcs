// pages/discover/discoverList.js
var utils = require("../../utils/util.js");
var api = require("../../utils/API.js");
var moreList = require("../../utils/moreList.js")

const app = getApp()
var pagenum = 1;
function showData(that) {
  moreList.getList(that.data.pgList, that, api.legalDatabaseContentData, pagenum, function (res) {
    console.log(res)
    that.setData({
      pgList: res
    })
    setTimeout(function () {
      wx.hideToast()
    }, 500)
  },10,{
    legalDatabaseId:that.data.legalDatabaseId,
    legalDatabaseTypeId :that.data.legalDatabaseTypeId,
    keywrod:that.data.keywrod
  })
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pgList:[],
    legalDatabaseId:"",//资料库id
    keywrod:"",//搜索内容
    legalDatabaseTypeId:"",//分类id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      legalDatabaseId:options.baseid,
      legalDatabaseTypeId:options.typeid
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    showData(this)
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