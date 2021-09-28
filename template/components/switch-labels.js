// template/components/switch-labels.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      value: []
    }
    
  },

  /**
   * 组件的初始数据
   */
  data: {
    idx:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTap:function(e){
      // console.log(e)
      var dataset = e.currentTarget.dataset
      this.triggerEvent('myevent', dataset)     
      this.setData({
        idx: dataset.idx
      })
    }
  }
})
