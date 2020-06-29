// pages/personal/personal.js
var utils = require("../../utils/util.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList1: ["我的收藏", "我的浏览", "通讯录"],
    idx:0,
    mailList:[],//通讯录
    userInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },
  // 打电话
  callPhoneback:function(e){
    utils.callPhoneback(e.currentTarget.dataset.phone)
  },
  switchTab: function (e) {
    
    var idx = e.detail.idx;
    this.setData({
      idx: idx
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    showMailList(that)
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
function showMailList(that){
  utils.request("/xcx/legalService/lawyerList", { }, function (res) {
    console.log(res)
    that.setData({
      mailList: res.data
    })
  })
}