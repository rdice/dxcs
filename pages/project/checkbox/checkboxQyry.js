// pages/project/checkbox/checkboxQyry.js
var utils = require("../../../utils/util.js");
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
    var list1 = "";
    for (var i = 0; i < val.length; i++) {
    
      if (i == val.length-1){
        list1 += list[parseInt(val[i])].id
      }else{
        list1 += list[parseInt(val[i])].id + ','
      }
    }
   
    utils.request("/xcx/legalService/addMember", {
      legalServiceId: that.data.id,
      servicePersonIds: list1
    }, function(res) {
      console.log(res)

      wx.navigateBack({
        delta: 1,
      })
    })
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)

    this.setData({
      id: options.id,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this
    var list = that.data.reList;
    utils.request("/xcx/legalService/getEnterpriseUnitPerson", {
      legalServiceId: that.data.id,
    }, function(res) {
      console.log(res)

      that.setData({
        lawyerList: res.data
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