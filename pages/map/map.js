// pages/map/map.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    share: false,
    listIndex: 0,
    longitude: 113.939436,
    latitude: 22.528138,
    locs: [],
    markers: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let _this = this;
    let app = getApp();
    let locs = [];
    if (options.listIndex) {
      // 本地清单
      _this.setData({
        listIndex: options.listIndex
      });
      locs = app.globalData.locLists[_this.data.listIndex].locs.slice();
    } else if (options.share) {
      // 他人分享的清单
      _this.setData({
        share: true
      });
      locs = app.globalData.shareList.locs.slice();
    }
    if (locs.length) {
      _this.setData({
        locs: locs,
        latitude: locs[locs.length - 1].latitude,
        longitude: locs[locs.length - 1].longitude
      });
    }
    let markers = [];
    for (let i = 0; i < locs.length; i++) {
      markers.push({
        id: i,
        latitude: locs[i].latitude,
        longitude: locs[i].longitude,
        callout: {
          content: locs[i].name,
          borderRadius: 5,
          borderWidth: 1,
          borderColor: "#a9a9a9",
          bgcolor: "#ffffff",
          padding: 10,
          display: "ALWAYS"
        }
      });
    }
    _this.setData({
      markers: markers
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
          itemList: _this.data.share ? ["仅分享小程序"] : ["分享我的清单", "仅分享小程序"],
          success(res) {
            resolve(_this.data.share ? res.tapIndex + 1 : res.tapIndex);
          },
          fail() {
            resolve(-1);
          }
        });
      });
    }();
    if (type == -1) {
      throw "用户取消分享";
    } else if (type == 0) {
      // 分享清单
      wx.showLoading({
        title: '正在上传数据',
        mask: true
      });
      let app = getApp();
      let res = await app.upload("share", app.globalData.locLists[_this.data.listIndex]);
      wx.hideLoading();
      return {
        title: "[分享清单]" + app.globalData.locLists[_this.data.listIndex].name,
        imageUrl: "/images/icon.png",
        path: "/pages/share/share?id=" + res._id
      };
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
   * 点击气泡时复制地点名称
   */
  copyName(e) {
    let _this = this;
    wx.setClipboardData({
      data: _this.data.locs[e.detail.markerId].name
    });
  }
})