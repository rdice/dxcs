//index.js
var utils = require("../../utils/util.js");
var api = require("../../utils/API.js");
var moreList = require("../../utils/moreList.js")

const app = getApp()
var pagenum = 1;



function showData(that) {
  var idx = that.data.idx;
  var url = "";
  var obj = {};
  if(idx==0){
    url= api.todoListList;
    obj = {
      taskType:0
    }
  }else if(idx==1){
    url= api.todoListList;
    obj = {
      taskType:2
    }
  }else{
    url = api.workRecordList 
    obj = {}
  }
  moreList.getList2(that.data.pgList, that, url, pagenum, function (res) {
    console.log(res)
    that.setData({
      pgList: res
    })
    setTimeout(function () {
      wx.hideToast()
    }, 500)
  }, 10, obj)
}
Page({
  data: {
    isIndex:true,
    userInfo:null,
    pgList:[],
    totleNum:{},//首页未读数
    manager:false,//是否是管理员
    idx:0
    
  },
  // 切换导航
  switchNav:function(e){
    this.setData({
      idx:e.currentTarget.dataset.id
    })
    showData(this)
  },
  onLoad: function () {
    console.log(app.manager)
   this.setData({
     userInfo: app.globalData.userInfo,
     manager: app.manager
   })
  },
  onReady:function(){
    
  },
  onShow:function(){
    var that = this;
    pagenum = 1;
    showData(that);
    utils.request(api.getIndexNumber, {}, function (res) {
      that.setData({
        totleNum:res.data
      })
    });
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
