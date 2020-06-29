// pages/personal/personalDatas.js
var utils = require("../../utils/util.js");
var app = getApp();
var pwidth = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src: '',
    name: '',//名字
    phone: '',
    animationData: {},//创建一个动画对象
    num: 1,
    root: app.root,
    sex:"",
    email:""
  },
  // 修改
  formsubmit: function (e) {

    var formdata = e.detail.value;
    var that = this;
    console.log(formdata)
    if (!utils.checkMobile(formdata.phone)){
      return
    }
    utils.request('/xcx/legalService/udpateUserInfo', formdata, function (res) {
      console.log(res)
      if (res.data) {
        utils.showToast('修改成功')
        that.setData({
          name: formdata.name
        })
        wx.redirectTo({
          url: 'personalDatas',
        })
      }

    })
  },

  // 弹框填写
  popBox: function (e) {

    var animation = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease',
    })
    this.animation = animation

    this.animation.translateX(0).step()

    this.setData({
      animationData: animation.export(),
      num: e.currentTarget.dataset.num
    })
  },

  closeInput: function () {
    closeBox(this, 400);
  },
  resetName: function () {

  },
  upload() {
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        const src = res.tempFilePaths[0]

        wx.redirectTo({
          url: `./upload/upload?src=${src}`
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    // 调用头像上传
    let { avatar } = options
    if (avatar) {
      console.log(avatar)
      wx.uploadFile({
        url: app.rooturl + "/xcx/legalService/uploadHeadImage",
        filePath: avatar,
        name: 'file',
        formData: {
          'memberId': app.memberId,
        },
        success: function (res) {
          console.log(res)


        }
      })



    }
    // 获取手机宽度
    wx.getSystemInfo({
      success: function (res) {
        pwidth = res.windowWidth

      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    closeBox(this);
    var that = this;
    setTimeout(function () {
      utils.request('/xcx/legalService/userDetails', {}, function (res) {
        console.log(res)
        that.setData({
          src: res.data.headImage + "?i=" + Math.floor(Math.random() * 10),
          name: res.data.name,
          phone: res.data.phone,
          sex:res.data.sex,
          email: res.data.email,
        })
      })
    }, 500)


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
  // onShareAppMessage: function () {

  // }
})
function closeBox(that, duration = 0) {
  var animation = wx.createAnimation({
    duration: duration,
    timingFunction: 'ease',
  })
  that.animation = animation

  animation.translateX(pwidth).step()
  that.setData({
    animationData: animation.export()
  })
}