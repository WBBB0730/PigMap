// app.js
App({
  onLaunch() {
    // 初始化云服务
    wx.cloud.init({
      env: "pigmap-1gamomqedaab0a10"
    });
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
      let db = wx.cloud.database();
      db.collection(collection).add({
        data: data,
        success: (res) => {
          resolve(res);
        }
      });
    });
  },

  /**
   * 数据库: 读取数据
   */
  download(collection, id) {
    return new Promise((resolve) => {
      let db = wx.cloud.database();
      db.collection(collection).doc(id).get({
        success: (res) => {
          resolve(res);
        }
      });
    });
  }
})