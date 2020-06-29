// pages/chatroom/contact/contactDetails.js
import TIM from 'tim-wx-sdk';
import COS from "cos-wx-sdk-v5";
var tim = getApp().tim;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userProfile: {},
    userid:""
  },
  // 发送消息
  handleProxy: function () {
    //  type=C2C&userid=3bfd325b0ac64b5aa8ee13395d9c5fb0
    var that = this;
    wx.redirectTo({
      url: '../index/chat?type=C2C&userid=' + that.data.userid,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    let promise3 = tim.getUserProfile({
      userIDList: [options.userid] // 请注意：即使只拉取一个用户的资料，也需要用数组类型，例如：userIDList: ['user1']
    });
    promise3.then(function (imResponse) {
      console.log(imResponse)
      wx.setNavigationBarTitle({
        title: imResponse.data[0].nick
      })
      that.setData({
        userProfile: imResponse.data[0],
        userid:options.userid
      })
    }).catch(function (imError) {
      console.warn('getUserProfile error:', imError); // 获取其他用户资料失败的相关信息
    });
    this.setData({
      chatType: TIM.TYPES.CONV_C2C
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