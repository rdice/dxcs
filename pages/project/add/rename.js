// pages/project/details/rename.js
var utils = require("../../../utils/util.js");
var api = require("../../../utils/API.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    name: "",
    idx:0,
  },
  submitForm: function(e) {
   
    var that = this
    var val = e.detail.value;
    val.id = that.data.id;
    utils.request(api.updateFileName, val, function(res) {
      console.log(res)
      if(res.data){
        // ----采用onshow此方法暂时注释
        // var pages = getCurrentPages(); //获取页面栈
        // if (pages.length > 1) {
        //   //上一个页面实例对象
        //   var prePage = pages[pages.length - 2];
        //   //调用上一个页面的onShow方法
        //   prePage.editAjfjName(val.name, that.data.idx)
        // }
        
      }
      wx.navigateBack({
        delta: 1
      })
      
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    this.setData({
      id: options.id,
      name: options.name,
      idx: options.idx
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this;


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

  }
})