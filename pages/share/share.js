// pages/list/list.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    data: null,
    locList: {},
    id: "",
    saved: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    let _this = this;
    let app = getApp();
    _this.setData({
      id: options.id
    });
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    let res = await app.download("share", _this.data.id);
    _this.setData({
      data: res.data
    });
    app.globalData.shareList = res.data;
    let tempLocs = _this.data.data.locs.slice();
    tempLocs.reverse();
    _this.setData({
      locList: {
        name: _this.data.data.name,
        locs: tempLocs
      }
    });
    wx.hideLoading();
  },

  /**
   * 保存清单
   */
  saveList(e, content) {
    let _this = this;
    wx.showModal({
      title: '保存清单',
      content: content === undefined ? _this.data.data.name : content,
      editable: true,
      placeholderText: '请输入清单名称',
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
                  _this.saveList(e, name);
                }
              }
            });
          } else {
            let app = getApp();
            app.globalData.locLists.push({
              name: name,
              locs: _this.data.data.locs
            });
            wx.setStorageSync('locLists', app.globalData.locLists);
            _this.setData({
              saved: true
            });
            _this.onShow();
            wx.showToast({
              title: '已保存',
            })
          }
        }
      }
    });
  },

  /**
   * 分享
   */
  async onShareAppMessage() {
    let _this = this;
    let type = await function () {
      return new Promise((resolve) => {
        wx.showActionSheet({
          itemList: ["仅分享小程序"],
          success(res) {
            resolve(res.tapIndex);
          },
          fail() {
            resolve(-1);
          }
        });
      });
    }();
    if (type == -1) {
      throw "用户取消分享";
    } else {
      // 分享小程序
      return {
        title: "猪猪地图",
        imageUrl: "/images/icon.png",
        path: "/pages/list/list"
      };
    }
  },

  /**
   * 跳转到地图
   */
  toMap() {
    let _this = this;
    wx.navigateTo({
      url: '/pages/map/map?share=1',
    })
  }
})