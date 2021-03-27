// pages/project/more/fileList.js
var util = require("../../../utils/util.js");
var moreList = require("../../../utils/moreList.js");
var api = require("../../../utils/API.js");
function showData(that) {
  var fileModule = that.data.tp==0?"shareCaseDoc":"receiveCaseDoc" 
  util.request(api.fileList, {
    lawCaseId: that.data.id,
    name: that.data.name,
    parentNodeId:that.data.pid,
    fileModule:fileModule
  }, function(res) {
    console.log(res)
    that.setData({
      pgList: res.data
    })
    setTimeout(function() {
      wx.hideToast()
    }, 500)
  })
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ajfj: ["律师发给我的文件", "我发给律师的文件"],
    pgList: [],
    id: "", //项目id
    tp: 0, //1 律师上传的附件 2 用户发出的附3进展的附4待办的附件5工作记录的附件
    name: "", //搜索的名字
    pid:"",//父类id

  },
  // 搜索
  searchSubject:function(e){
    // console.log(e.detail.value)
    this.setData({
      name: e.detail.value
    })
    showData(this)
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
              util.uploadFiles( that.data.id, res.tempFilePaths,that.data.pid)
              setTimeout(function () {
                wx.redirectTo({
                  url: '/pages/project/more/fileList?id=' + that.data.id + '&idx=' + that.data.tp +'&pid='+that.data.pid,
                })
              }, 100)
            }
          })
        } else if (res.tapIndex == 1) {
          //  新增文件夹
          wx.navigateTo({
            url: '/pages/project/add/addFolder?id=' + that.data.id + '&pid=' + that.data.pid
          })

        }
      }
    })
  },
  // 修改名字回调
  editAjfjName: function(name, idx) {

    util.showToast("修改成功");
    var that = this;
    var pgd = that.data.pgList

    pgd[idx].name = name;
    that.setData({
      pgList: pgd
    })
  },
  // 项目发出 点击省略号跳出操作菜单
  showAjfjMenu: function(e) {
    var that = this;
    var fjid = e.currentTarget.dataset.id;
    var name = e.currentTarget.dataset.name;
    var idx = e.currentTarget.dataset.idx;
    wx.showActionSheet({
      itemList: ['重命名', '删除'],
      itemColor: '#3cbd30',
      success: function(res) {
        if (res.tapIndex == 0) {
          wx.navigateTo({
            url: '/pages/project/add/rename?id=' + fjid + '&name=' + name + '&idx=' + idx,
          })
        } else if (res.tapIndex == 1) {
          var list = that.data.pgList;
          util.deleteFile(fjid, function(res) {
            for (var i = 0; i < list.length; i++) {
              if (fjid == list[i].id) {
                list.splice(i, 1);
              }
            }
            that.setData({
              pgList: list
            })
          })
        }
      }
    })
  },

  // 打开案件附件
  openFile: function(e) {
    var that = this;
    console.log(e.currentTarget.dataset)
    var isfile = e.currentTarget.dataset.isfile;
    var fileid = e.currentTarget.dataset.id;
    if (isfile!="N") {
      util.openFile(e.currentTarget.dataset.id)
    } else {
      wx.navigateTo({
        url: '/pages/project/more/fileList?id=' + that.data.id + "&pid=" + fileid + "&idx=" + that.data.tp,
      })
    }
  },
  // 案件附件
  switchajfj: function (e) {
    console.log(e)
    this.setData({
      tp:e.detail.idx,
    })
    showData(this)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    var idx = parseInt(options.idx)
    this.setData({
      id: options.id,
      pid:options.pid,
      tp: idx,
    
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
 
    showData(this);
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
    var that = this;

    that.setData({
      pgList: []
    })
    moreList.showToast("刷新中");

    setTimeout(function() {
      wx.stopPullDownRefresh({
        complete: function(res) {
          showData(that)
        }
      })
    }, 500);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
  
  },
})