// pages/project/add/addFolder.js
var utils = require("../../../utils/util.js");
var api = require("../../../utils/API.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",//项目id
    parentNodeId:'',//是否有父层文件夹
  },
  submitForm: function (e) {

    var that = this
    var name = e.detail.value.name;
    
    utils.addFolder(that.data.id, name, function () {     
      wx.navigateBack({
        delta: 1
      })
    }, that.data.parentNodeId)
   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
console.log(options)
    this.setData({
      id: options.id,
      parentNodeId:options.pid,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;


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

  }
})