// pages/project/details/dbsxDetails.js
var utils = require("../../../utils/util.js");
var api = require("../../../utils/API.js");
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

    legalServiceId: "", //项目id
    tempFilePaths: [], //附件list
    lawyerStr: "", //选择律师
    lawyerStrId: "", //选择律师 id
    date: '',
    time:'',
  },
  // 日期
  bindDateChange:function(e){
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  // 日期
  bindTimeChange:function(e){
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },
  // 选择律师
  chooseLawyer: function(e) {
    var that = this;
    console.log(e.currentTarget.dataset.value)
    var str = e.currentTarget.dataset.value;
    wx.navigateTo({
      url: '../checkbox/checkbox?str=' + that.data.lawyerStrId + "&legalid=" + that.data.legalServiceId,
    })
  },
  // 提交
  formSubmit: function(e) {
    console.log(e)
    var that = this;
    var data = e.detail.value;
    if (data.title == "") {
      utils.showToast("请输入标题")
      return
    }
    if (data.content == "") {
      utils.showToast("请输入内容")
      return
    }
    if (that.data.lawyerStrId == "") {
      utils.showToast("请选择律师")
      return
    }
    console.log(JSON.stringify(that.data.lawyerStrId.split(",")))
    data.completedate = that.data.date+" "+that.data.time;
    data.userList = JSON.stringify(that.data.lawyerStrId.split(","))
    data.lawCaseId = that.data.legalServiceId;
    utils.request(api.editTask, data, function(res) {
      console.log(res)

      if (res.data.result) {
        utils.uploadTaskFiles(res.data.bean.id, that.data.tempFilePaths,function(){
          wx.navigateBack({
            delta:1
          })
        })
     
      }
    })
  },
  // 删除或预览
  prevOrdelImage: function(e) {
    var that = this;
    openImage(e, that.data.tempFilePaths, function(list) {
      that.setData({
        tempFilePaths: list
      })
    })
  },
  // 上传
  chooseFile: function() {
    var that = this;
    chooseImg(function(res) {
      var imgList = that.data.tempFilePaths
      for (var i = 0; i < res.length; i++) {
        imgList.push(res[i])
      }
      that.setData({
        tempFilePaths: imgList
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var date1 = new Date();
    var date,time;
    date = utils.formatTime(date1).substring(0, 10);
    time = utils.formatTime(date1).substring(11, 16);
    this.setData({
      legalServiceId: options.xmid,
      date:date,
      time:time
    })
    

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this;

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
  reloadData: function(list) {
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
// 预览或删除图片
function openImage(e, tempFilePaths, success) {
  var that = this;
  var fileList = tempFilePaths;
  wx.showActionSheet({
    itemList: ['预览', '删除'],
    itemColor: '#3cbd30',
    success: function(res) {
      if (res.tapIndex == 0) {
        ylopenFile(e.currentTarget.dataset.url, fileList);
      } else if (res.tapIndex == 1) {
        fileList.splice(e.currentTarget.dataset.idx, 1)
        success(fileList)
      }
    }
  })

}
// 接上面
function ylopenFile(url, showList) {

  wx.previewImage({
    current: url, // 当前显示图片的http链接
    urls: showList // 需要预览的图片http链接列表
  })


}
// 选择图片
function chooseImg(success) {
  wx.chooseImage({
    count: 9, // 默认9
    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    success: function(res) {
      // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
      var tempFilePaths = res.tempFilePaths
      success(tempFilePaths)
    }
  })
}