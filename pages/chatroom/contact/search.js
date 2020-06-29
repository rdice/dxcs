// pages/chatroom/contact/search.js
import TIM from 'tim-wx-sdk';
import COS from "cos-wx-sdk-v5";
var tim = getApp().tim;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: "user", //会话或者群组
    placeholder: "请输入userID",
    id: "", //搜索的id
    userObj: {},
    searched: false,
    buttonText: "发起会话"

  },
  // 处理搜索
  handleProxy: function (e) {
    this.setData({
      id: e.detail.value
    })
    wx.showLoading({
      title: '搜索中',
    })
    this.data.type == "user" ? this.searchUser() : this.searchGroup()
  },
  sendMsg: function (e) {
    var that = this;
    var csid = this.data.type == "user" ? "C2C" : "GROUP"
    var id = this.data.type == "user" ? this.data.userObj.userID : this.data.userObj.groupID
    if (this.data.type == "user") {
      wx.navigateTo({
        url: '/pages/chatroom/index/chat?type=' + csid + "&userid=" + id,
      })
    } else {
      let promise = tim.joinGroup({
        groupID: that.data.id,
        type: TIM.TYPES.GRP_PUBLIC
      });
      promise.then(function (imResponse) {
        console.log(imResponse)
        switch (imResponse.data.status) {
          case TIM.TYPES.JOIN_STATUS_WAIT_APPROVAL:
            wx.showToast({
              title: '等待管理员批准',
            })
            break; // 等待管理员同意
          case TIM.TYPES.JOIN_STATUS_SUCCESS: // 加群成功
          
            console.log(imResponse.data.group); // 加入的群组资料
            break;
          default:
            wx.navigateTo({
              url: '/pages/chatroom/index/chat?type=' + csid + "&userid=" + id,
            })
            break;
        }
      }).catch(function (imError) {
        console.warn('joinGroup error:', imError); // 申请加群失败的相关信息
      });
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type: options.type
    })
    if (options.type == "user") {
      this.setData({
        placeholder: "请输入userID"
      })
    } else {
      this.setData({
        placeholder: "请输入groupID"
      })
    }
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
  searchUser: function () {
    var t = this;
    let promise = tim.getUserProfile({
      userIDList: [t.data.id] // 请注意：即使只拉取一个用户的资料，也需要用数组类型，例如：userIDList: ['user1']
    });


    promise.then(function (e) {
      console.log(e.data); // 存储用户资料的数组 - [Profile]
      var n = e.data;
      wx.hideLoading();
      n.length > 0 ? t.setData({
        userObj: e.data[0],
        buttonText: "发起会话",
        searched: true
      }) : wx.showToast({
        title: "未找到该用户",
        duration: 1e3,
        icon: "none"
      })

    }).catch(function (imError) {

    });

  },
  searchGroup: function () {
    var that = this;
    let promise = tim.searchGroupByID(that.data.id);
    promise.then(function (e) {
      console.log(e)
      const group = e.data.group; // 群组信息
      var n = e.data;
      wx.hideLoading();
      if (n.group.type == "Public") {
        that.setData({
          buttonText: "进入群聊",
          searched: true,
          userObj: group
        })
      }

    }).catch(function (t) {
      console.warn('searchGroupByID error:', t); // 搜素群组失败的相关信息
      wx.hideLoading(), 10007 === t.code ? wx.showToast({
        title: "讨论组类型群组不允许申请加群",
        duration: 1e3,
        icon: "none"
      }) : wx.showToast({
        title: "未找到该群组",
        duration: 1e3,
        icon: "none"
      })
    });

  },

})