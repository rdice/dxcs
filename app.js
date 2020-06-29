//app.js
import TIM from 'tim-wx-sdk';
import COS from "cos-wx-sdk-v5";
App({
  onLaunch: function () {


    let options = {
      SDKAppID: 1400373427 // 接入时需要将0替换为您的即时通信 IM 应用的 SDKAppID
    };
    // 创建 SDK 实例，`TIM.create()`方法对于同一个 `SDKAppID` 只会返回同一份实例
     this.tim = TIM.create(options); // SDK 实例通常用 tim 表示

    // 设置 SDK 日志输出级别，详细分级请参见 setLogLevel 接口的说明
    this.tim.setLogLevel(0); // 普通级别，日志量较多，接入时建议使用
    // this.tim.setLogLevel(1); // release 级别，SDK 输出关键信息，生产环境时建议使用

    // 注册 COS SDK 插件
    this.tim.registerPlugin({
      'cos-wx-sdk': COS
    });
  },

  globalData: {
    userInfo: null,//用户信息
  },
  manager:false,//是不是管理员
  openid:"",
  memberId:"",//服务用户id
  accout:"",//聊天用户id
  root: 'http://localhost:8080/',
  rootquery: 'http://localhost:8080/hetong/',//查询
  roothd: 'http://110.84.129.48:8281/fzx/controller/',//提交
  // root: 'http://fj.hetongb.com/',
  // rooturl: 'http://fj.hetongb.com/hetong/',
})