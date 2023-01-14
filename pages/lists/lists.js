// pages/lists/lists.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let _this = this;
    _this.setData({
      lists: getApp().globalData.locLists.slice()
    })
  },

  /**
   * 新建清单
   */
  addList(e, content = "") {
    let _this = this;
    wx.showModal({
      title: '新建清单',
      content: content,
      editable: true,
      placeholderText: '请输入新的清单名称',
      complete: (res) => {
        if (res.confirm) {
          let name = res.content;
          let err = "";
          if (name.length == 0) {
            err = "清单名称不能为空"
          } else if (name.length > 8) {
            err = "清单名称不能超过8个字"
          }
          if (err) {
            wx.showModal({
              content: err,
              showCancel: false,
              complete: (res) => {
                if (res.confirm) {
                  _this.addList(e, name);
                }
              }
            });
          } else {
            let app = getApp();
            app.globalData.locLists.push({
              name: name,
              locs: []
            });
            wx.setStorageSync('locLists', app.globalData.locLists);
            _this.onShow();
          }
        }
      }
    });
  },

  /**
   * 删除清单
   */
  delList(e) {
    let _this = this;
    let index = e.currentTarget.dataset.index;
    if (index == 0) {
      wx.showModal({
        // title: '提示',
        content: '默认清单不能编辑或删除',
        showCancel: false
      });
    } else {
      wx.showModal({
        title: '删除清单',
        content: '确认删除？删除后无法恢复',
        confirmText: '删除',
        confirmColor: '#ff0000',
        complete: (res) => {
          if (res.confirm) {
            let app = getApp();
            app.globalData.locLists.splice(index, 1);
            app.globalData.delLists.push(index);
            wx.setStorageSync('locLists', app.globalData.locLists);
            _this.onShow();
          }
        }
      });
    }
  },

  /**
   * 编辑清单
   */
  editList(e, content) {
    let _this = this;
    let index = e.currentTarget.dataset.index;
    if (index == 0) {
      wx.showModal({
        // title: '提示',
        content: '默认清单不能编辑或删除',
        showCancel: false
      });
    } else {
      wx.showModal({
        title: '修改清单名称',
        content: content === undefined ? _this.data.lists[index].name : content,
        editable: true,
        placeholderText: '请输入新的清单名称',
        complete: (res) => {
          if (res.confirm) {
            let name = res.content.replaceAll("\n", "");
            let err = "";
            if (name.length == 0) {
              err = "清单名称不能为空"
            } else if (name.length > 8) {
              err = "清单名称不能超过8个字"
            }
            if (err) {
              wx.showModal({
                content: err,
                showCancel: false,
                complete: (res) => {
                  if (res.confirm) {
                    _this.editList(e, name);
                  }
                }
              });
            } else {
              let app = getApp();
              app.globalData.locLists[index].name = name;
              wx.setStorageSync('locLists', app.globalData.locLists);
              _this.onShow();
            }
          }
        }
      });
    }
  }
})