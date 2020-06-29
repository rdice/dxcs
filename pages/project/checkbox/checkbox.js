// pages/project/checkbox/checkbox.js
var utils = require("../../../utils/util.js");
var api = require("../../../utils/API.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    lawyerList: [],
    reList: [], //回填的list
  },
  formSubmit: function(e) {
    var that = this;
    var val = e.detail.value.checkbox;
    if (val.length == 0) {
      wx.showToast({
        title: '请选择律师',
        duration: 1000
      })
      return
    }
    var list = this.data.lawyerList;
    var list1 = [];
    for (var i = 0; i < val.length; i++) {
      list1.push(list[parseInt(val[i])])
    }
    var pages = getCurrentPages(); //获取页面栈
    if (pages.length > 1) {
      //上一个页面实例对象
      var prePage = pages[pages.length - 2];
      //调用上一个页面的onShow方法
      prePage.reloadData(list1)
    }
    wx.navigateBack({
      delta: 1,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    var list = options.str.split(",");
    
    this.setData({
      id: options.legalid,
      reList: list
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this
    var list = that.data.reList;
    utils.request(api.serviceLawyerList, {
      lawCaseId: that.data.id,
      roleType: 2,
    }, function(res) {
      console.log(res)
      var list1=res.data
      
      for (var i = 0; i < list1.length; i++) {
       
        for (var j = 0; j < list.length; j++) {
       
          if (list[j] == list1[i].allUserId){
            list1[i].checked=true
          }
        }
      }
      console.log(list1)
      that.setData({
        lawyerList: list1
      })
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
})