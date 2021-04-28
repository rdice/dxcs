// pages/project/more/memberList.js
var utils = require("../../../utils/util.js");
var moreList = require("../../../utils/moreList.js");
var app = getApp();
var api = require("../../../utils/API.js");
var pagenum = 1;

function showData(that) {
  var roleType;//1企业用户 2律师 3其他
  if(that.data.cyxzIdx==0){
    roleType=2
  }else if(that.data.cyxzIdx==1){
    roleType=1
  }else{
    roleType=3
  }
  moreList.getList(that.data.pgList, that, api.memberList, pagenum, function (res) {
    console.log(res)
    that.setData({
      pgList: res
    })
    setTimeout(function () {
      wx.hideToast()
    }, 500)
  }, 10, {
    lawCaseId: that.data.id,
    roleType: roleType
  })
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cyxz: [ "律师团队", "企业人员","其他人员"],
    cyxzIdx: 0,
    pgList: [],
    id: "", //项目id
    tp: 1,
    manager: false, //是不是管理员
    currentMemberId:""

  },
  // 聊天
  toChat:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/chatroom/index/chat?type=C2C&userid=' + id,
    })
  },
  // 管理员才有的操作  增删企业人员
  editMenu: function () {
    var that = this;
    wx.navigateTo({
      url: '/pages/project/checkbox/checkboxQyry?id=' + that.data.id,
    })

  },
  // 打电话
  callPhone:function(e){
   
    utils.callPhoneback(e.currentTarget.dataset.phone)
  },
  // 管理员---删除
  delqyMember: function (e) {
    console.log(e.currentTarget.dataset.id)
    var delid = e.currentTarget.dataset.id;
    var that = this
    wx.showModal({
      title: '提示',
      content: '是否删除',
      success(a) {
        if (a.confirm) {
          utils.request(api.deleteMember, {
            memberId: delid,
            lawCaseId:that.data.id
          }, function (res) {
            console.log(res)
            if (res.data) {

              pagenum = 1;
              showData(that);
              utils.showToast("删除成功")
            }
          })
        } else if (a.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },

  // 待办事项
  switchCyxz: function (e) {
    console.log(e)
    this.setData({
      cyxzIdx: e.detail.idx
    })
    pagenum = 1;
    showData(this)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
      manager: app.manager,
      currentMemberId:app.memberId
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    pagenum = 1;
    showData(this)
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