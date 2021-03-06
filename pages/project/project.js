// pages/project/project.js
var app = getApp();
var util = require("../../utils/util.js");
var moreList = require("../../utils/moreList.js")
var api = require("../../utils/API.js");
var pagenum = 1;
function showData(that) {
  moreList.getList(that.data.pgList, that, api.legalServiceList, pagenum, function (res) {
    console.log(res)
    that.setData({
      pgList: res
    })
    setTimeout(function () {
      wx.hideToast()
    }, 500)
  },10,{
    keyword:that.data.keyword,
    status:that.data.status
  })
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pgList:[],
    xmlist:["所有项目","进行中","已结束"],//切换
    keyword:"",
    status:""
  },
  switchXm:function(e){
    console.log(e.detail.idx);
    if(e.detail.idx==0){
      this.setData({
        status:""
      })
    }else if(e.detail.idx==1){
      this.setData({
        status:2101
      })
    }else{
      this.setData({
        status:2102
      })
    }
    showData(this)

  },
  searchSubject:function(e){
    console.log(e.detail.value)
    this.setData({
      keyword:e.detail.value
    })
    showData(this)
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