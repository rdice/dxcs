// pages/login/login.js
var util = require("../../utils/util.js");
var api = require("../../utils/API.js");
var app = getApp();


import TIM from 'tim-wx-sdk';
var tim = getApp().tim;
var gen = require("../../debug/GenerateTestUserSig.js");


function countdown(that) {
  var second = that.data.second
  if (second == 0) {
    that.setData({
      issendcode: false
    });
    return;
  }
  var time = setTimeout(function () {
    that.setData({
      second: second - 1
    });
    countdown(that);
  }, 1000)
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
    login: true,
    phone: '',
    code: '',
    issendcode: false,
    second: 180,
    scrollHeight: 416,

  },

  submitForm: function () {


    var that = this;


    util.request(api.enter, {
      phone: this.phone,
      openid: app.openid,
      validate: this.code,

    }, function (res) {

      if (res.data.code == "1") {

        getuserInfo()
      } else { //

        wx.showToast({
          title: res.data.msg,
          icon: 'success',
          duration: 2000
        })
      }
    })
    //


  },
  phoneBlur: function (e) {
    this.phone = e.detail.value;
  },
  codeBlur: function (e) {
    this.code = e.detail.value;
  },
  // 获取验证码
  getPhoneCode: function () {

    var that = this;
    if (util.checkMobile(this.phone)) {

      util.request(api.getMsgVaildate, {
        phone: this.phone
      }, function (res) {
        if (res.data.res) {


          // that.issendcode = true;
          that.setData({
            issendcode: true
          })
          wx.showToast({
            title: '发送成功',
            icon: 'success',
            duration: 2000
          })
          countdown(that);
        } else { //

          wx.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 2000
          })
        }
      })
    } else {
      wx.showToast({
        title: '请填写正确的手机号码',
        icon: 'success',
        duration: 2000
      })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var accout = "123"
    // console.log(gen.genTestUserSig(accout).userSig)
    // let promise = app.tim.login({
    //   userID: accout,
    //   userSig: gen.genTestUserSig(accout).userSig
    // });
    // promise.then(function (imResponse) {
    //   console.log(imResponse.data); // 登录成功
    //   let onSdkReady = function(event) {
    //     wx.redirectTo({
    //       url: '/pages/chatroom/index/index',
    //     })
        
    //   };
    //   tim.on(TIM.EVENT.SDK_READY, onSdkReady);

    // }).catch(function (imError) {
    //   console.warn('login error:', imError); // 登录失败的相关信息
    // });
    // return


    wx.login({
      success: function (loginRes) {

        if (loginRes.code) {
          //发起网络请求
          wx.request({
            url: api.xcxLoginDecode,
            data: {
              code: loginRes.code
            },
            success: function (res) {
              app.openid = res.data.res;
              getuserInfo()

            }
          })
        } else {
          wx.showToast({
            title: '获取用户登录态失败！',
            icon: 'success',
            duration: 2000
          })

        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  }


})

function getuserInfo() {
  util.request(api.getUserInfo, {
    openid: app.openid
  }, function (e) {
    
    if (e.data.code == 1) {
      wx.showLoading({
        title: '正在加载中',
      })
      var accout = e.data.bean.memberAccount
      app.accout = accout; 
      console.log(e.data.bean)
      console.log("===")

      app.globalData.userInfo = e.data.bean;
      app.memberId = e.data.bean.memberId;
      app.manager = e.data.manager;
      getTencentyunConfig(accout)

      
      
    }
  })
}
function getTencentyunConfig(accout){
  util.request(api.getTencentyunConfig, {
    memberAccount: accout
  }, function (e) {

    // 调用im同时登录
    let promise = app.tim.login({
      userID: accout,
      userSig: e.data.userSig
    });
    promise.then(function (imResponse) {
      //console.log(imResponse.data); // 登录成功
      let onSdkReady = function(event) {
        wx.hideLoading()
        wx.redirectTo({
          url: '/pages/index/index',
        })
        
      };
      tim.on(TIM.EVENT.SDK_READY, onSdkReady);

    }).catch(function (imError) {
      console.warn('login error:', imError); // 登录失败的相关信息
    });
  })
}