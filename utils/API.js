var app = getApp();

const api = {

  // ----------登录页面
  //提交
  enter: app.rootquery + 'xcx/legalService/enter',
  // 获取验证码
  getMsgVaildate: app.rootquery + 'xcx/legalService/getMsgVaildate',
  // 获取小程序openid
  xcxLoginDecode: app.rootquery + 'xcx/legalService/xcxLoginDecode',
  // 获取用户信息
  getUserInfo: app.rootquery + 'xcx/legalService/userInfo',
  // 获取IM秘钥
  getTencentyunConfig: app.roothd + 'legalService/getTencentyunConfig',

  // ----------------首页
  // 获取待办事项列表
  todoListList: app.rootquery + '/xcx/legalService/todoListList',
  // 结束待办
  endTask: app.roothd + 'legalService/endTask',
  // 删除待办
  deleteTodoList: app.roothd + 'xcx/legalService/deleteTodoList',
  
  // 提交待办
  editTask: app.roothd + '/legalService/editTask',
  // 更新
  todoListInfo: app.rootquery + 'xcx/legalService/todoListInfo',

  // -------成员授权
  // 删除成员
  deleteAdvisoryUnitMember: app.roothd + 'legalService/deleteAdvisoryUnitMember',
  // 添加成员
  servicePersonInfoSubmit: app.roothd + 'legalService/editAdvisoryUnitMember',
  // 查询单位/人员
  managePersonList: app.rootquery + 'xcx/legalService/managePersonList',
  // 企业成员列表
  memberList: app.rootquery + 'xcx/legalService/memberList',

  // -----服务律师
  getLegalServiceLawyer: app.rootquery + 'xcx/legalService/getLegalServiceLawyer',

  // 项目管理
  legalServiceList: app.rootquery + 'xcx/legalService/legalServiceList',

  // 项目详情
  legalServiceDetails: app.rootquery + 'xcx/legalService/legalServiceDetails',
  //  项目详情---案件进展详情
  stageLinkInfo: app.rootquery + 'xcx/legalService/stageLinkInfo',
  // 项目详情----附件列表更多
  fileList: app.rootquery + 'xcx/legalService/fileList',

  // 律师成员列表
  serviceLawyerList: app.rootquery + 'xcx/legalService/serviceLawyerList',
  
  // 工作记录详情
  workRecordInfo: app.rootquery + 'xcx/legalService/workRecordInfo',
  // 工作记录列表更多
  workRecordList: app.rootquery + 'xcx/legalService/workRecordList',
  
  // 打开附件---
  fileInfo: app.rootquery + 'xcx/legalService/fileInfo',
  // 附件重命名
  updateFileName: app.roothd + "legalService/updateFileName",
  // 新增文件夹
  addFolder: app.roothd + "legalService/addFolder",
  // 删除文件夹
  deleteFile: app.roothd + "legalService/deleteFile",
  // 上传附件----待办上传
  uploadTaskFiles: app.roothd + "legalService/uploadTaskFiles",
  // 上传附件-----案件附件上传
  uploadFiles: app.roothd + "legalService/uploadFiles",


}

module.exports = api;