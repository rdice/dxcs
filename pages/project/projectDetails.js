// pages/project/projectDetails.js
var utils = require("../../utils/util.js");
var moreList = require("../../utils/moreList.js");
var api = require("../../utils/API.js");

import TIM from 'tim-wx-sdk';
var tim = getApp().tim;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ajjz: [],
    ajjzIdx: 0,
    ajfj: ["项目接收", "项目发出"],
    ajfjIdx: 0,
    dbsx: ["我的待办", "律师待办"],
    dbsxIdx: 0,
    id: "", //主键id
    pageData: {},
    isOpen: true

  },
  // 聊天室
  chatRoom: function () {
    var that = this;
    var bean = that.data.pageData.bean;
    
    wx.navigateTo({
      url: '/pages/chatroom/index/chat?type=GROUP&userid=' + bean.groupId,
    })
    // wx.navigateTo({
    //   url: '/pages/chatroom/index/index',
    // })

  },
  // 一对一聊天
  aloneChat:function(e){
    console.log(e.currentTarget.dataset)
    var accout = e.currentTarget.dataset.accout;
    wx.navigateTo({
      url: '/pages/chatroom/index/chat?type=C2C&userid=' + accout,
    })
  },


  // 打电话
  callPhoneback: function (e) {
    utils.callPhoneback(e.currentTarget.dataset.phone)
  },
  // 显示案件附件菜单
  addAjfjMenu: function (e) {
    var that = this;

    wx.showActionSheet({
      itemList: ['上传图片', '新增文件夹'],
      itemColor: '#3cbd30',
      success: function (res) {
        if (res.tapIndex == 0) {
          wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
              console.log(res.tempFilePaths)

              utils.uploadFiles(that.data.id, res.tempFilePaths)
              setTimeout(function () {
                wx.redirectTo({
                  url: '/pages/project/projectDetails?id=' + that.data.id,
                })
              }, 100)
            }
          })
        } else if (res.tapIndex == 1) {
          //  新增文件夹
          var pid = ""
          wx.navigateTo({
            url: '/pages/project/add/addFolder?id=' + that.data.id + '&pid=' + pid
          })

        }
      }
    })
  },
  // 修改名字回调-----采用onshow此方法暂时注释
  // editAjfjName: function(name, idx) {
  //   utils.showToast("修改成功");
  //   var that = this;
  //   var pgd = that.data.pageData
  //   pgd.fileList2[idx].name = name;
  //   that.setData({
  //     pageData: pgd
  //   })
  // },
  // 项目发出 点击省略号跳出操作菜单
  showAjfjMenu: function (e) {
    var that = this;
    var fjid = e.currentTarget.dataset.id;
    var name = e.currentTarget.dataset.name;
    var idx = e.currentTarget.dataset.idx;
    wx.showActionSheet({
      itemList: ['重命名', '删除'],
      itemColor: '#3cbd30',
      success: function (res) {
        if (res.tapIndex == 0) {
          wx.navigateTo({
            url: '/pages/project/add/rename?id=' + fjid + '&name=' + name + '&idx=' + idx,
          })
        } else if (res.tapIndex == 1) {
          var list = that.data.pageData;
          utils.deleteFile(fjid, function (res) {
            for (var i = 0; i < list.fileList2.length; i++) {
              if (fjid == list.fileList2[i].id) {
                list.fileList2.splice(i, 1);
              }
            }
            that.setData({
              pageData: list
            })
          })
        }
      }
    })
  },
  // 打开案件附件
  openFile: function (e) {
    var that = this;
    console.log(e.currentTarget.dataset.id)
    var isfile = e.currentTarget.dataset.isfile;
    var fileid = e.currentTarget.dataset.id;
    if (isfile) {
      utils.openFile(e.currentTarget.dataset.id)
    } else {
      wx.navigateTo({
        url: '/pages/project/more/fileList?id=' + that.data.id + "&pid=" + fileid + "&idx=" + that.data.ajfjIdx,
      })
    }
  },
  // 展开进展
  showajList: function (e) {
    if (this.data.isOpen) {
      this.setData({
        isOpen: false
      })
    } else {
      this.setData({
        isOpen: true
      })
    }
  },
  // 案件进展
  switchAjjz: function (e) {
    console.log(e)
    this.setData({
      ajjzIdx: e.detail.idx
    })
  },
  // 案件附件
  switchAjfj: function (e) {
    console.log(e)
    this.setData({
      ajfjIdx: e.detail.idx
    })
  },
  // 待办事项
  switchDbsx: function (e) {
    console.log(e)
    this.setData({
      dbsxIdx: e.detail.idx
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
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
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    utils.request(api.legalServiceDetails, {
      lawCaseId: that.data.id
    }, function (res) {
      console.log(res)

      var arr = res.data.serviceStageList;
      var arr2 = [];
      for (var i = 0; i < arr.length; i++) {
        arr2.push(arr[i].name)
      }
      wx.hideLoading()
      that.setData({
        pageData: res.data,
        ajjz: arr2
      })
    })
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

    wx.showLoading({
      title: '刷新中',
    })
    utils.request(api.legalServiceDetails, {
      lawCaseId: that.data.id
    }, function (res) {
      console.log(res)

      var arr = res.data.serviceStageList;
      var arr2 = [];
      for (var i = 0; i < arr.length; i++) {
        arr2.push(arr[i].name)
      }
      wx.hideLoading();
      wx.stopPullDownRefresh();
      that.setData({
        pageData: res.data,
        ajjz: arr2
      })
    })

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },


})