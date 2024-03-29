// pages/discover/discover.js
var app = getApp();
var utils = require("../../utils/util.js");
var api = require("../../utils/API.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    pageData: {},
    cyzlList: ["证据标准", "文书格式", "交通事故"],
    dxzxList: ["法律法规", "最新法条", "电信相关"],
    idx:0
  },
  switchlabel: function (e) {
    console.log(e)
    this.setData({
      idx:e.detail.idx
    })
  },
  navList:function(e){
    console.log(e)
    wx.navigateTo({
      url: './discoverList?baseid='+e.currentTarget.dataset.baseid+'&typeid='+e.currentTarget.dataset.typeid,
  
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    utils.request(api.legalDatabase, {}, function (res) {
      console.log(res)
      console.log("=========")
      that.setData({
        pageData: res.data
      })
    });
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})