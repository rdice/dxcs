// components/tabBar/tab-bar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    active:{
      type:Number
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    list:[
      {
        url:"/pages/index/index",
        title:"首页"
      },
      {
        url:"/pages/project/project",
        title:"项目"
      },
      {
        url:"/pages/discover/discover",
        title:"发现"
      },
      {
        url:"/pages/personal/personal",
        title:"我的"
      }
    ],
  },
  
  /**
   * 组件的方法列表
   */
  methods: {
    navTabBar:function(e){
      const url = e.currentTarget.dataset.url;
      wx.redirectTo({
        url: url,
      })
    }
  },
  ready(){
    
  }
})
