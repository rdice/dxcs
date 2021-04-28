var app = getApp();
var api = require("./API.js");
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  // const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


// ---网络请求---
function request(baseurl, parameters, success) {

  parameters.openid = app.openid;
  parameters.currentMemberId = app.memberId;
  console.log(parameters)

  wx.request({
    url: baseurl,
    data: parameters,
    method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      // console.log(res)
      if (res.statusCode == 200) {
        success(res);
      } else {
        wx.showToast({
          title: "网络异常",
          icon: "none",
          duration: 1000,
          mask: true
        })
      }

    },
    fail: function () {
      wx.showToast({
        title: "网络异常",
        icon: "none",
        duration: 1000,
        mask: true
      })
    },
    complete: function () {
      // complete

    }
  })
}


// 验证手机号码
function checkMobile(phoneNum) {

  if (!(/^1[3|4|5|8|7|6|9][0-9]\d{8}$/.test(phoneNum))) {
    wx.showToast({
      title: "请输入正确号码",
      icon: 'none',
      duration: 1000,
      mask: true
    })
    return false;
  } else {
    return true;
  }
}
// 待办上传文件
function uploadTaskFiles(id = "", tempFilePaths, success) {
  var pList = [];
  for (var i = 0; i < tempFilePaths.length; i++) {
    pList.push(new Promise(function (resolve, reject) {
      wx.uploadFile({
        url: api.uploadTaskFiles,
        filePath: tempFilePaths[i],
        name: 'uploaded_file',
        formData: {
          'taskId': id, //栏目id 待办要传
          'currentMemberId': app.memberId, //当前用户id
        },
        success: function (res) {
          resolve()
        }
      })
    }))
  }
  Promise.all(pList).then(function (res) {
    wx.showToast({
      title: '上传成功',
      duration: 1000
    })
    setTimeout(function () {
      success()
    }, 1000)
  })
}

// 案件附件上传文件
function uploadFiles(id = "", tempFilePaths, parentNodeId = "", success) {
  var pList = [];
  for (var i = 0; i < tempFilePaths.length; i++) {
    pList.push(new Promise(function (resolve, reject) {
      wx.uploadFile({
        url: api.uploadFiles,
        filePath: tempFilePaths[i],
        name: 'uploaded_file',
        formData: {
          'lawCaseId': id, //栏目id 待办要传
          'currentMemberId': app.memberId, //当前用户id
          'parentNodeId': parentNodeId, //父类id
        },
        success: function (res) {
          console.log(res)
          //do something
          resolve()
        }
      })
    }))
  }
  Promise.all(pList).then(function (res) {
    wx.showToast({
      title: '上传成功',
      duration: 1000
    })
    success()
  })
}

// 删除附件
function deleteFile(id, success) {
  request(api.deleteFile, {
    id: id
  }, function (res) {
    if (res.data) {
      success(res)
      wx.showToast({
        title: '删除成功',
        duration: 1000
      })
    } else {
      wx.showToast({
        title: '删除失败',
        duration: 500
      })
    }
  })
}
// 打开文件
function openFile(id) {
  request(api.fileInfo, {
    allFileId: id
  }, function (res) {
    console.log(res.data)
    var url = res.data;
    var images = false;
    var url1 = url.substring(url.lastIndexOf(".") + 1, url.length).toLowerCase();
    if (url1 == "png" || url1 == "jpeg" || url1 == "bmp" || url1 == "jpg" || url1 == "svg" || url1 == "pic") {
      images = true
    } else {
      images = false
    }
    if (images) {
      var showList = [];
      showList.push(url)
      wx.previewImage({
        current: url, // 当前显示图片的http链接
        urls: showList // 需要预览的图片http链接列表
      })
    } else {
      var downloadTask = wx.downloadFile({
        url: url,
        success: function (res) {
          // console.log(res)
          if (res.statusCode == 404) {
            showToast("文件下载失败");
          } else {
            wx.openDocument({
              filePath: res.tempFilePath,
              success: function (res) {
                // console.log('打开文档成功')
              },
              fail: function (res) {
                showToast("暂不支持打开改文件类型");
              }
            })
          }
        },
        fail:function(res){
          showToast("暂不支持打开改文件类型");
        }
      })
      downloadTask.onProgressUpdate((res) => {
        console.log('下载进度', res.progress)
        wx.showToast({
          title: res.progress + "%",
          icon: 'loading',
          duration: 10000
        })
        if (res.progress == 100) {
          wx.hideToast();
        }
      })
    }
  })



}
// 上传文件夹
function addFolder(id, name, success, parentNodeId = "") {
  request(api.addFolder, {
    lawCaseId: id, //项目id
    name: name, //文件夹名
    parentNodeId: parentNodeId, //父层名字
  }, function (res) {
    console.log(res)
    if (res.data) {
      wx.showToast({
        title: '上传成功',
        duration: 1000
      })
      success()
    } else {
      wx.showToast({
        title: '上传失败',
        duration: 1000
      })
    }
  })
}

function showToast(title = "加载中", duration = 1000, icon = "success") {
  wx.showToast({
    title: title,
    duration: duration,
    icon: icon
  })
}

function callPhoneback(phone) {
  wx.makePhoneCall({
    phoneNumber: phone //客服电话
  })
}
module.exports = {
  formatTime: formatTime,
  request: request,
  checkMobile: checkMobile,
  uploadFiles: uploadFiles,
  uploadTaskFiles: uploadTaskFiles,
  openFile: openFile,
  deleteFile: deleteFile,
  showToast: showToast,
  addFolder: addFolder,
  callPhoneback: callPhoneback
}