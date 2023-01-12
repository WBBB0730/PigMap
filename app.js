// app.js
App({
  onLaunch() {
    let _this = this;
    let locList = wx.getStorageSync('locList');
    if (locList) {
      _this.globalData.locList = locList;
    }
  },

  globalData: {
    userInfo: null,
    locList: []
  }
})
