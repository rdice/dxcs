// pages/chatroom/system/main.js
import TIM from 'tim-wx-sdk';
var tim = getApp().tim;
var de = require("../../../utils/decodeElement");
var utils = require("../../../utils/util");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentMessageList: [], //消息列表
    moreId: "", //下拉更多所需id
    isCompleted: true, // 表示是否已经拉完所有消息。
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    getMessageList(that, function () {
      pageScrollTo();
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
    if (!that.data.isCompleted) {
      getMessageList(that, function (res) {

      }, that.data.moreId)
    } else {
      wx.showToast({
        title: '已经没有了',
        icon: "none"
      })
      wx.stopPullDownRefresh()
    }

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

})

function getMessageList(that, success, fistid = "") {
  // 拉取会话列表
  // 下拉查看更多消息
  let promise = tim.getMessageList({
    conversationID: "@TIM#SYSTEM",
    nextReqMessageID: fistid,
    count: 15
  });
  promise.then(function (imResponse) {
    console.log(imResponse)
    if (fistid != "") {
      var list = imResponse.data.messageList.concat(that.data.currentMessageList);
      console.log(list)
      that.setData({
        currentMessageList: decodeList(list), // 消息列表。

      })
    } else {
      console.log(decodeList(imResponse.data.messageList))
      that.setData({
        currentMessageList: decodeList(imResponse.data.messageList), // 消息列表。
      })
    }
    // console.log(parseText(imResponse.data.messageList[3].payload))
    that.setData({
      moreId: imResponse.data.nextReqMessageID, // 用于续拉，分页续拉时需传入该字段。
      isCompleted: imResponse.data.isCompleted, // 表示是否已经拉完所有消息。
    })
    success()
  });
}
function pageScrollTo() {
  // 将页面置于最底部
  wx.pageScrollTo({
    selector: '#end',
    duration: 300
  })
}
function decodeList(list){
  for (let i = 0; i < list.length; i++) {
    // 通话消息解析
    if (list[i].type === "TIMGroupSystemNoticeElem" ) {
      let date = new Date(list[i].time * 1000)
      list[i].virtualDom = de.decodeElement(list[i]);
      list[i].newtime = utils.formatTime(date)
    }
   
  }
  return list
}