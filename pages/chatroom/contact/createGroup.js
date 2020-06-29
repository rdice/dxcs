// pages/chatroom/contact/createGroup.js
import TIM from 'tim-wx-sdk';
var tim = getApp().tim;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: true,
    groupID: "",
    groupName: ""
  },
  // 监听输入
  handleProxy(e) {
    var num = e.currentTarget.dataset.id;
    if (num == "1") {
      this.setData({
        groupID: e.detail.value
      })
    } else {
      this.setData({
        groupName: e.detail.value
      })
    }
    if ( this.data.groupName != "") {
      this.setData({
        disabled: false
      })
    }
  },
  // 创建群组
  createGroup: function () {
    var that = this;
    let promise = tim.createGroup({
      type: TIM.TYPES.GRP_PUBLIC,
      name: that.data.groupName,
      groupID:that.data.groupID,
      
      // memberList: [{
      //   userID: 'user1'
      // }, {
      //   userID: 'user2'
      // }] // 如果填写了 memberList，则必须填写 userID
    });
    promise.then(function (imResponse) { // 创建成功
      console.log(imResponse.data.group); // 创建的群的资料
      wx.navigateTo({
        url: '/pages/chatroom/index/chat?type=GROUP&userid=' + imResponse.data.group.groupID,
      })
    }).catch(function (imError) {
      console.warn('createGroup error:', imError); // 创建群组失败的相关信息
    });
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