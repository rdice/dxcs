// pages/chatroom/contact/groups.js
import TIM from 'tim-wx-sdk';
var tim = getApp().tim;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupList: [],
  },
  handleProxy: function (e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/chatroom/index/chat?type=GROUP&userid=' +id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    // 该接口默认只拉取这些资料：群类型、群名称、群头像以及最后一条消息的时间。
    let promise = tim.getGroupList();
    promise.then(function (imResponse) {
      that.setData({
        groupList: imResponse.data.groupList
      })
      console.log(imResponse.data.groupList); // 群组列表
    }).catch(function (imError) {
      console.warn('getGroupList error:', imError); // 获取群组列表失败的相关信息
    });
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
  onShareAppMessage: function () {

  }
})