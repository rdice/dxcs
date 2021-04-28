// pages/chatroom/contact/group-profile.js
var tim = getApp().tim;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupid:"",
    memberList: [], //成员列表
    groupProfile: {}, //群资料
  },
  handleProxy: function (e) {
    console.log(e.currentTarget.dataset.userid)
    var userid = e.currentTarget.dataset.userid;
    wx.navigateTo({
      url: '/pages/chatroom/contact/contactDetails?userid=' + userid,
    })
  },
  toAllMemberList: function (e) {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
  
    that.setData({
      groupid:options.userid
    })
    getGroupList(that)

    // 获取群资料
    let promise2 = tim.getGroupProfile({
      groupID: options.userid,
      groupCustomFieldFilter: ['key1', 'key2']
    });
    promise2.then(function (imResponse) {
      console.log(imResponse.data.group);
      that.setData({
        groupProfile: imResponse.data.group
      })
    }).catch(function (imError) {
      console.warn('getGroupProfile error:', imError); // 获取群详细资料失败的相关信息
    });
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
})

function getGroupList(that, success, fistid = "") {
  // 拉取头像列表
  
  let promise = tim.getGroupMemberList({
    groupID: that.data.groupid,
    count: 100,
    offset: 0
  }); // 从0开始拉取30个群成员
  promise.then(function (imResponse) {
    // 群成员列表
    var list = imResponse.data.memberList;
    that.setData({
      memberList: list
    })
  }).catch(function (imError) {
    console.warn('getGroupMemberList error:', imError);
  });
}