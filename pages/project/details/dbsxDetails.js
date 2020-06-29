// pages/project/details/dbsxDetails.js
var utils = require("../../../utils/util.js");
var api = require("../../../utils/API.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskId: "",//当前待办id
    lawCaseId:"",//项目id
    pageData: {},
    isEdit: 0,
    lawyerStr: "", //选择律师
    lawyerStrId: "",//选择律师 id

  },
  // 待办结束
  remindDbxs:function(){
    var that = this;
    utils.request(api.endTask, {
      taskId:that.data.taskId,
    }, function (res) {
      console.log(res)
      var data = that.data.pageData;
      if(res.data.result){
        data.status = 1;
        utils.showToast("提醒成功",1000,function(){
          wx.redirectTo({
            url: '/pages/project/details/dbsxDetails?id=' + that.data.taskId + '&legalid=' + that.data.lawCaseId + '&is=0',
          })
        })
        
      }
      
    })
  },
  // 选择律师
  chooseLawyer: function (e) {
    var that = this;
    console.log(e.currentTarget.dataset.value)
    var str = e.currentTarget.dataset.value;
    wx.navigateTo({
      url: '../checkbox/checkbox?str=' + that.data.lawyerStrId + "&legalid=" + that.data.lawCaseId,
    })
  },
  // 删除待办
  delDbsx:function(e){
    var that = this;
    utils.request(api.deleteTodoList, {id:that.data.taskId}, function (res) {
      console.log(res)
      if (res.data) {
        wx.redirectTo({
          url: '/pages/project/projectDetails?id=' + that.data.lawCaseId,
        })
      }
    })
  },
  // 提交
  formSubmit:function(e){
    console.log(e)
    var that = this;
    var data = e.detail.value;
    data.userList = JSON.stringify(that.data.lawyerStrId.split(","))
    data.taskId = that.data.taskId;
    data.lawCaseId = that.data.lawCaseId;
    utils.request(api.editTask, data, function(res) {
      console.log(res)

      if (res.data.result) {
        // 暂时取消
        // utils.uploadTaskFiles(res.data.taskId,that.data.tempFilePaths)
        wx.redirectTo({
          url: '/pages/project/details/dbsxDetails?id=' + that.data.taskId + '&legalid=' + that.data.lawCaseId+'&is=1',
        })
      }
    })
    
  },
  // 只预览
  openFile1:function(e){
    var that = this
    wx.showActionSheet({
      itemList: ['预览'],
      itemColor: '#3cbd30',
      success: function (res) {
        if (res.tapIndex == 0) {
          utils.openFile(e.currentTarget.dataset.id)
        }
      }
    })
  },
  // 删除或预览
  openFile: function(e) {
    var that =this
    wx.showActionSheet({
      itemList: ['预览', '删除'],
      itemColor: '#3cbd30',
      success: function(res) {
        if (res.tapIndex == 0) {
          utils.openFile(e.currentTarget.dataset.id)
          
        } else if (res.tapIndex == 1) {
          utils.deleteFile(e.currentTarget.dataset.id,function(res){
            console.log(res)
            updateData(that)
          })
        }
      }
    })
  },
  // 上传
  chooseFile: function() {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        console.log(res.tempFilePaths)
        utils.uploadTaskFiles(that.data.taskId,res.tempFilePaths)
        setTimeout(function(){
          updateData(that)
        },200)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    this.setData({
      taskId: options.id,
      isEdit: options.is,
      lawCaseId: options.legalid
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this;
    updateData(that)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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
  // 回调
  reloadData: function (list) {
    console.log(list)
    var str = "";
    var strId = "";
    for (var i = 0; i < list.length; i++) {

      if ((list.length - 1) == i) {
        str += list[i].realname;
        strId += list[i].allUserId;
      } else {
        str += list[i].realname + ","
        strId += list[i].allUserId + ","
      }
    }
    this.setData({
      lawyerStr: str,
      lawyerStrId: strId
    })
  }
})
function updateData(that){
  utils.request(api.todoListInfo, {
    taskId: that.data.taskId
  }, function (res) {
    console.log(res)
    console.log(222)
    var userList = res.data.userList;
    if (userList.length>0){
      var strId = "";
      for (var i = 0; i < userList.length; i++) {

        if ((userList.length - 1) == i) {
          strId += userList[i]
        } else {
          strId += userList[i] + ","
        }
      }
      that.setData({
        lawyerStrId:strId,
        lawyerStr:res.data.cooperator
      })
    }
    
    that.setData({
      pageData: res.data,
      
    })

   
  })

}