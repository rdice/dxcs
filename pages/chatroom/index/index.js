//index.js
import TIM from 'tim-wx-sdk';
var tim = getApp().tim;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabBar: [{
        name: "消息",
        icon: "/images/theme/chat",
        url: "/pages/chatroom/index/index"
      },
      {
        name: "通讯录",
        icon: "/images/theme/contact",
        url: "/pages/chatroom/contact/index"
      }
    ],
    idx: 0, //tabbar---idx
    msgList: [], //会话列表
    myInfo: {}, //用户信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;
    let promise1 = tim.getMyProfile();
    promise1.then(function (imResponse) {
      console.log(imResponse.data); // 个人资料 - Profile 实例
      that.setData({
        myInfo: imResponse.data
      })
    }).catch(function (imError) {
      console.warn('getMyProfile error:', imError); // 获取个人资料失败的相关信息
    });


    wx.showLoading({
      title: '正在同步数据',
    })
    // 监听消息回调
    let onMessageReceived = function (event) {
      // event.data - 存储 Message 对象的数组 - [Message]
      console.log(event)
      getConversationList(that);
    };
    tim.on(TIM.EVENT.MESSAGE_RECEIVED, onMessageReceived);

  },
  //点击/按压触发
  handleProxy: function (e) {
    console.log(e)
    var that = this;
    var type = e.currentTarget.dataset.type
    console.log(type)
    var csid = e.currentTarget.dataset.type + e.currentTarget.dataset.userid;
    var userid = e.currentTarget.dataset.userid;
    if (e.type == "longpress") { //按压
      wx.showModal({
        content: "确认删除会话？",
        confirmText: "确认",
        success(res) {
          if (res.confirm) {
            let promise = tim.deleteConversation(csid);
            promise.then(function (imResponse) {
              //删除成功。
              console.log(imResponse.data)
              getConversationList(that)
            }).catch(function (imError) {
              console.warn('deleteConversation error:', imError); // 删除会话失败的相关信息
            });
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else if (e.type == "tap") { //点击
      wx.navigateTo({
        url: './chat?type=' + type + "&userid=" + userid,
        success() {
          // 将已读去掉
          tim.setMessageRead({
            conversationID: csid
          });
          // 刷新列表
          getConversationList(that);
        }
      })
    }
  },
  // 底下tabbar跳转
  tabBarNav: function (e) {
    console.log(e.currentTarget.dataset.idx)
    this.setData({
      idx: e.currentTarget.dataset.idx
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
    //每次进入该页面都要重新请求
    var that = this;
    getConversationList(that);
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

function getConversationList(that) {
  // 拉取会话列表
  let promise = tim.getConversationList();
  promise.then(function (imResponse) {
    const conversationList = imResponse.data.conversationList; // 会话列表，用该列表覆盖原有的会话列表
    console.log(conversationList)
    conversationList.forEach(item => {
      item.lastMessage._lastTime = timestampFormat(item.lastMessage.lastTime)
    });
    that.setData({
      msgList: conversationList
    })
    wx.hideLoading();
  }).catch(function (imError) {
    console.warn('getConversationList error:', imError); // 获取会话列表失败的相关信息
  });
}

function timestampFormat(timestamp) {
  function zeroize(num) {
    return (String(num).length == 1 ? '0' : '') + num;
  }

  var curTimestamp = parseInt(new Date().getTime() / 1000); //当前时间戳
  var timestampDiff = curTimestamp - timestamp; // 参数时间戳与当前时间戳相差秒数

  var curDate = new Date(curTimestamp * 1000); // 当前时间日期对象
  var tmDate = new Date(timestamp * 1000); // 参数时间戳转换成的日期对象
  var Y = tmDate.getFullYear(),
    m = tmDate.getMonth() + 1,
    d = tmDate.getDate();
  var H = tmDate.getHours(),
    i = tmDate.getMinutes(),
    s = tmDate.getSeconds();
  // if (timestampDiff < 60) { // 一分钟以内
  //   return "刚刚";
  // } else if (timestampDiff < 3600) { // 一小时前之内
  //   return Math.floor(timestampDiff / 60) + "分钟前";
  // } 
  if (curDate.getFullYear() == Y && curDate.getMonth() + 1 == m && curDate.getDate() == d) {
    return '今天' + zeroize(H) + ':' + zeroize(i);
  } else {
    var newDate = new Date((curTimestamp - 86400) * 1000); // 参数中的时间戳加一天转换成的日期对象
    if (newDate.getFullYear() == Y && newDate.getMonth() + 1 == m && newDate.getDate() == d) {
      return '昨天' + zeroize(H) + ':' + zeroize(i);
    } else {
      return Y + '/' + zeroize(m) + '/' + zeroize(d) ;
    }
  }
}