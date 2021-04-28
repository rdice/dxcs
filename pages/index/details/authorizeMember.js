// pages/index/details/authorizeMember.js
var utils = require("../../../utils/util.js");
var api = require("../../../utils/API.js");
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    manager:false,//是不是管理员

    startX: 0, //开始的坐标
    itemIdx: 0, //下标
    isTouch: false, //是否左滑

    array: ['成员', '管理员'],
    powerIdx: 0, //权限下标
    qyIdx: 0, //企业下标
    showPower: false, //显示权限框
    showQy: false, //显示企业框
    showSex: false, //显示性别框

    isPop: false, //成员弹框
    dwlist: [], //单位
    dwidx: 0,
    pageData: [], //单位人员
    mbData: {}, //选择成员 赋值弹框,
    cmemberId:"",//当前用户id
    
  },
  // 删除成员
  delItem: function(e) {
    var that = this
    var idx = e.currentTarget.dataset.idx;
    var unitid = e.currentTarget.dataset.id;
    var obj = that.data.pageData;
    wx.showModal({
      title: '提示',
      content: '是否删除',
      success(a) {
        if (a.confirm) {
          utils.request(api.deleteAdvisoryUnitMember, {
            memberId: unitid
          }, function(res) {
            console.log(res)
            if (res.data.result) {
              obj[that.data.dwidx].memberList.splice(idx, 1);
              that.setData({
                pageData: obj,
                isTouch: false
              })
              utils.showToast("删除成功")
            }
          })
        } else if (a.cancel) {
          console.log('用户点击取消')
        }
      }
    })





  },
  // 弹出成员授权框
  showEdit: function(e) {
    console.log(e.currentTarget.dataset.idx)
  
    var idx = e.currentTarget.dataset.idx;
    var obj = this.data.pageData[this.data.dwidx].memberList[idx];
    console.log(obj)
    var arr = this.data.pageData; //赋值企业id
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].id == obj.enterpriseUnitId) {
        console.log(i);
        this.setData({
          qyIdx: i
        })
      }
    }
   
    this.setData({
      isPop: true,
      mbData: obj,
      powerIdx: obj.role=="admin"?1:0
    })
  },
  // 提交成员授权
  formSubmit: function(e) {
    console.log(e)
    var that = this;
    var val = e.detail.value;
    if (!utils.checkMobile(val.phone))
      return

    val.memberId = that.data.mbData.memberId;
    console.log(val)
    utils.showToast("提交中", 8000, "loading");
    utils.request(api.servicePersonInfoSubmit, val, function(res) {
      console.log(res)
      that.setData({
        isPop: false,
        showPower: false,
        showQy: false,
        showSex: false,
      })
      setTimeout(function() {
        wx.redirectTo({
          url: '/pages/index/details/authorizeMember',
        })
      }, 500)
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      cmemberId:app.memberId,
      manager:app.manager
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this;
    // utils.request("/xcx/legalService/enterpriseUnitList", {

    // }, function(res) {
    //   console.log(res)
    //   that.setData({
    //     arrayqy: res.data
    //   })
    // })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    utils.request(api.managePersonList, {

    }, function(res) {
      console.log(res)
      console.log(121212121)
      var list = res.data;
      var arr = [];
      if (list.length > 0) {
        for (var i = 0; i < list.length; i++) {
          arr.push(list[i].name)
        }
      }

      that.setData({
        pageData: res.data,
        dwlist: arr
      })
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  // 选择成员权限
  choosePower: function(e) {
    console.log(e.currentTarget.dataset.idx)
    var list = this.data.array;
    var idx = e.currentTarget.dataset.idx
    this.setData({
      powerIdx: idx,
      showPower: false
    })
  },
  // 选择成员企业
  chooseQy: function(e) {
    console.log(e.currentTarget.dataset.idx)
    var list = this.data.pageData;
    var idx = e.currentTarget.dataset.idx
    this.setData({
      qyIdx: idx,
      showQy: false
    })
  },
  
  // 显示权限
  onfocusqx: function(e) {
    var is = this.data.showPower
    if (is) {
      this.setData({
        showPower: false
      })
    } else {
      this.setData({
        showPower: true,
        showQy: false,
        showSex: false,
      })
    }

  },
  // 显示企业
  onfocusqy: function() {
    var is = this.data.showQy
    if (is) {
      this.setData({
        showQy: false

      })
    } else {
      this.setData({
        showQy: true,
        showSex: false,
        showPower: false
      })
    }

  },
  // 显示性别
  onfocusxb: function() {
    var is = this.data.showSex
    if (is) {
      this.setData({
        showSex: false
      })
    } else {
      this.setData({
        showSex: true,
        showQy: false,
        showPower: false
      })
    }

  },
  // 新增
  addMember: function() {
    this.setData({
      isPop: true,
      qyIdx: 0,
      sexIdx: 0,
      powerIdx: 0,
      mbData: {}
    })
  },

  // 切换
  switchDw: function(e) {
    this.setData({
      dwidx: e.detail.idx
    })
  },

  // 关闭
  closeEdit: function() {
    this.setData({
      isPop: false
    })
  },
  // 左滑操作
  touchStart: function(e) {
    if(this.data.manager){
      var pageX = e.changedTouches[0].clientX
      this.setData({
        startX: pageX,
        itemIdx: e.currentTarget.dataset.idx,
        isTouch: false
      })
    }
    
  },
  touchMove: function(e) {
    var startX = this.data.startX;
    var touchMoveX = e.changedTouches[0].clientX; //滑动的坐标  
    if (touchMoveX > startX) { //右滑
      this.setData({
        isTouch: false
      })
    } else { //左滑
      this.setData({
        isTouch: true
      })
    }

  },
})