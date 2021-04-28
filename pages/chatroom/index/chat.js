// pages/chat/chat.js
import TIM from 'tim-wx-sdk';
// import COS from "cos-wx-sdk-v5";

var item = require("../../../debug/emoji.js");
var tim = getApp().tim;
var de = require("../../../utils/decodeElement")
// 1. 获取全局唯一的录音管理器 RecorderManager
const recorderManager = wx.getRecorderManager();
// 录音部分参数
const recordOptions = {
  duration: 60000, // 录音的时长，单位 ms，最大值 600000（10 分钟）
  sampleRate: 44100, // 采样率
  numberOfChannels: 1, // 录音通道数
  encodeBitRate: 192000, // 编码码率
  format: 'aac' // 音频格式，选择此格式创建的音频消息，可以在即时通信 IM 全平台（Android、iOS、微信小程序和 Web）互通
};

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowMenu: false, //菜单更多
    isEmojiOpen: false, //展示表情
    isSendBtn: false, //发送按钮
    isShowAudio: false, //显示发送语音按钮
    text: "", //要发送的消息文本
    msgList: [], //消息列表

    conversationID: "", //会话 ID
    moreId: "", //下拉更多所需id
    isCompleted: true, // 表示是否已经拉完所有消息。
    userid: "", //对方用户id或者群id
    chatType: "", //用户或者群
    myInfo: {}, //用户信息
    currentTime: 0,
    currentTimeID: "",

    emojiName: [],
    emojiMap: {},
    emojiUrl: "",
    faceUrl: "https://webim-1252463788.file.myqcloud.com/assets/face-elem/",
    emojiShow: true,
    bigEmojiShow: false,
    bigEmoji: ["tt01", "tt02", "tt03", "tt04", "tt05", "tt06", "tt07", "tt08", "tt09", "tt10", "tt11", "tt12", "tt13", "tt14", "tt15", "tt16"],
  },
  // 打开资料
  handleDetails: function (e) {
    var that = this;
    if (that.data.chatType == "C2C") {
      wx.redirectTo({
        url: '../contact/contactDetails?userid=' + that.data.userid,
      })
    } else {
      wx.redirectTo({
        url: '../contact/group-profile?userid=' + that.data.userid,
      })
    }
  },
  //  发送消息
  sendText: function (e) {
    var that = this;
    console.log(that.data.userid)

    let message = tim.createTextMessage({
      to: that.data.userid,
      conversationType: that.data.chatType,
      payload: {
        text: that.data.text
      }
    });
    sendMessage(message, that, function () {
      that.setData({
        text: "",
        isSendBtn: false
      })
    })
  },
  // 发送表情
  sendEmoji(e) {
    const idx = e.currentTarget.dataset.eventid;
    const item = this.data.emojiName[idx];
    const text = this.data.text;

    this.setData({
      text: text + item
    })
  },
  // 更多功能
  // 发送图片相机/相册
  sendPictures: function (e) {
    var that = this;
    var type = e.currentTarget.dataset.type;
    wx.chooseImage({
      sourceType: [type], // 从相册、相机选择
      count: 1, // 只选一张，目前 SDK 不支持一次发送多张图片
      success: function (res) {
        // 2. 创建消息实例，接口返回的实例可以上屏
        let message = tim.createImageMessage({
          to: that.data.userid,
          conversationType: that.data.chatType,
          payload: {
            file: res
          },
          onProgress: function (event) {
            console.log('file uploading:', event)
          }
        });
        sendMessage(message, that, function () {
          that.setData({
            isShowMenu: false,
          })
        })
      }
    })
  },
  // 选择视频文件
  chooseVideo: function () {
    var that = this;
    wx.chooseVideo({
      sourceType: ['album', 'camera'], // 来源相册或者拍摄
      maxDuration: 60, // 设置最长时间60s
      camera: 'back', // 后置摄像头
      success(res) {
        // 2. 创建消息实例，接口返回的实例可以上屏
        let message = tim.createVideoMessage({
          to: that.data.userid,
          conversationType: that.data.chatType,
          // priority: TIM.TYPES.MSG_PRIORITY_NORMAL,
          payload: {
            file: res
          }
        })
        sendMessage(message, that, function () {
          that.setData({
            isShowMenu: false,
          })
        })
      }
    })
  },
  // 事件操作
  handleProxy: function (e) {
    console.log(e)
    var that = this;
    var msgList = this.data.msgList;
    var msgObj = {};

    var msgid = e.currentTarget.dataset.msgid

    for (var i in msgList) { //遍历新消息
      if (msgList[i].ID == msgid) { //为当前聊天对象的消息
        msgObj = msgList[i]
      }
    }
    if (e.type == "longpress") { //按压撤回消息


      if (this.data.currentTime - msgObj.time < 120 && (msgObj.flow === 'out')) {
        wx.showModal({
          content: "确定要撤回本消息吗？",
          confirmText: "确认",
          success(res) {
            if (res.confirm) {
              let promise = tim.revokeMessage(msgObj);
              promise.then(function (imResponse) {
                console.log("消息撤回成功")
                getMessageList(that, function () {
                  pageScrollTo();
                })
              }).catch(function (imError) {
                // 消息撤回失败
                console.warn('revokeMessage error:', imError);
              });
            } else if (res.cancel) {

            }
          }
        })
      }


    } else if (e.type == "tap") { //点击
      var num = e.currentTarget.dataset.num;
      if (num == "1") {
        // 这里是重新编辑
        that.setData({
          text: msgObj.payload.text,
          isSendBtn: true
        })

      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    console.log(options)
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




    if (options.type == "C2C") {
      // 获取对方用户资料
      let promise3 = tim.getUserProfile({
        userIDList: [options.userid] // 请注意：即使只拉取一个用户的资料，也需要用数组类型，例如：userIDList: ['user1']
      });
      promise3.then(function (imResponse) {
        wx.setNavigationBarTitle({
          title: imResponse.data[0].nick
        })
      }).catch(function (imError) {
        console.warn('getUserProfile error:', imError); // 获取其他用户资料失败的相关信息
      });
      this.setData({
        chatType: TIM.TYPES.CONV_C2C
      })
    } else {
      // 获取群名称
      let promise2 = tim.getGroupProfile({
        groupID: options.userid,
        groupCustomFieldFilter: ['key1', 'key2']
      });
      promise2.then(function (imResponse) {
        wx.setNavigationBarTitle({
          title: imResponse.data.group.name
        })
      }).catch(function (imError) {
        console.warn('getGroupProfile error:', imError); // 获取群详细资料失败的相关信息
      });


      this.setData({
        chatType: TIM.TYPES.CONV_GROUP
      })
    }
    this.setData({
      conversationID: options.type + options.userid,
      userid: options.userid,

    })


    getMessageList(that, function () {
      pageScrollTo();
    });
    // 监听消息回调
    let onMessageReceived = function (event) {
      // event.data - 存储 Message 对象的数组 - [Message]
      var list1 = event.data;
      var list2 = that.data.msgList.concat(list1);
      that.setData({
        msgList: decodeList(list2)
      })
      pageScrollTo();


    };
    tim.on(TIM.EVENT.MESSAGE_RECEIVED, onMessageReceived);
  },

  // 开始录音
  startRecord: function () {
    var that = this;
    wx.showLoading({
      title: '抬起 发送',
    })
    recorderManager.start(recordOptions);
  },
  // 录音结束
  stopRecord: function () {
    var that = this;
    var text = "";
    recorderManager.stop()
    wx.hideLoading()

  },
  // 接听语音
  listeningToVoice: function (e) {
    wx.playVoice({
      filePath: e.currentTarget.dataset.url,
      complete() {}
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    this.setData({
      emojiUrl: item.emojiUrl,
      emojiMap: item.emojiMap,
      emojiName: item.emojiName
    })


    // 2.1 监听录音错误事件
    recorderManager.onError(function (errMsg) {
      console.warn('recorder error:', errMsg);
    });
    // 2.2 监听录音结束事件，录音结束后，调用 createAudioMessage 创建音频消息实例
    recorderManager.onStop(function (res) {
      console.log('recorder stop', res);

      // 4. 创建消息实例，接口返回的实例可以上屏
      const message = tim.createAudioMessage({
        to: that.data.userid,
        conversationType: TIM.TYPES.CONV_C2C,
        payload: {
          file: res
        }
      });

      // 5. 发送消息
      sendMessage(message, that, function () {
        console.log("发送成功")
      })

    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var t = this;
    t.setData({
      currentTime: (new Date).getTime() / 1e3
    })
    this.currentTimeID = setInterval(function () {
      t.setData({
        currentTime: (new Date).getTime() / 1e3
      })
    }, 3e3)
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
    clearInterval(this.currentTimeID)
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
  // 输入文本
  inputText: function (e) {
    this.setData({
      text: e.detail.value
    })
    if (e.detail.value != "") {
      this.setData({
        isSendBtn: true
      })
    } else {
      this.setData({
        isSendBtn: false
      })
    }
  },
  // 展示语音
  handAudio: function () {

    const isa = this.data.isShowAudio;
    console.log(!isa)
    this.setData({
      isShowAudio: !isa
    })
  },
  // 展示菜单
  handleMenu: function (e) {
    var func = e.currentTarget.dataset.func;
    var type = e.currentTarget.dataset.type;
    if (type == "handleMenu") {
      if (func) {

        this.setData({
          isShowMenu: false
        })
      } else {
        this.setData({
          isShowMenu: true,
          isEmojiOpen: false
        })
      }
    } else {
      this.setData({
        isShowMenu: false,
        isEmojiOpen: false
      })
    }
    pageScrollTo()
  },
  // 展示表情
  handleEmoji: function (e) {
    var func = e.currentTarget.dataset.func;
    if (func) {
      this.setData({
        isEmojiOpen: false,
        emojiShow: false,
      })
    } else {
      this.setData({
        isEmojiOpen: true,
        emojiShow: true,
        isShowMenu: false,
      })
    }
    pageScrollTo()
  },
  // 预览图片
  previewImage: function (e) {
    var src = e.currentTarget.dataset.src;
    var urls = [];
    urls.push(src);
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
})
// 2. 发送消息
function sendMessage(message, that, success) {

  let promise = tim.sendMessage(message);
  promise.then(function (imResponse) {
    // 发送成功
    console.log(imResponse.data.message);
    success()

    getMessageList(that, function () {
      pageScrollTo();
    })
  }).catch(function (imError) {
    // 发送失败
    console.warn('sendMessage error:', imError);
    that.setData({
      text: ""
    })
  });
}

function getMessageList(that, success, fistid = "") {
  // 拉取会话列表
  // 下拉查看更多消息
  let promise = tim.getMessageList({
    conversationID: that.data.conversationID,
    nextReqMessageID: fistid,
    count: 15
  });
  promise.then(function (imResponse) {
    console.log(imResponse)
    if (fistid != "") {
      var list = imResponse.data.messageList.concat(that.data.msgList);
      that.setData({
        msgList: decodeList(list), // 消息列表。

      })
    } else {
      that.setData({
        msgList: decodeList(imResponse.data.messageList), // 消息列表。
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

function decodeList(list) {
  for (let i = 0; i < list.length; i++) {
    // 群组通话消息解析
    if (list[i].conversationID.indexOf('GROUP') === 0 && list[i].type === 'TIMGroupTipElem') {
      list[i].type = 'TIMGroupTipElem' // 将自定义消息类型重置为群提示消息做渲染
      list[i].virtualDom = de.decodeElement(list[i])

    }

  }
  return list
}

