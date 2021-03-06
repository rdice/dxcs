// pages/project/details/ajjzDetails.js
var utils = require("../../../utils/util.js");
var api = require("../../../utils/API.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    pageData: {},
  },
  // 预览
  openFile: function (e) {
    var that = this
    wx.showActionSheet({
      itemList: ['预览'],
      itemColor: '#3cbd30',
      success: function (res) {
        if (res.tapIndex == 0) {
          utils.openFile(e.currentTarget.dataset.id)
        }
      }
    })
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
    var that = this;
    utils.request(api.stageLinkInfo, { stageLinkId: that.data.id }, function (res) {
      console.log(res)
      that.setData({
        pageData: res.data
      })
    })
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


})