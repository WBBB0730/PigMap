// app.js
App({
  onLaunch() {
    let _this = this;
    let locLists = wx.getStorageSync('locLists');
    if (locLists) {
      _this.globalData.locLists = locLists;
    }
  },

  globalData: {
    locLists: [{
      name: "默认清单",
      locs: []
    }],
    delLists: [],
    shareList: {}
  },

  /**
   * 数据库: 插入数据
   */
  upload(collection, data) {
    return new Promise((resolve) => {
      wx.request({
        url: 'https://fc-mp-d82a7f5f-1cbf-450c-96dd-121cdf0d7dc7.next.bspapp.com/upload',
        method: "POST",
        data: {
          collection: collection,
          data: data
        },
        success(res) {
          resolve(res);
        }
      })
    });
  },

  /**
   * 数据库: 读取数据
   */
  download(collection, id) {
    return new Promise((resolve) => {
      wx.request({
        url: 'https://fc-mp-d82a7f5f-1cbf-450c-96dd-121cdf0d7dc7.next.bspapp.com/download',
        data: {
          collection: collection,
          id: id
        },
        success(res) {
          resolve(res);
        }
      })
    });
  }
})