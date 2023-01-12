// pages/list/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    locList: [],
    keyWord: ""
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
    _this.updateList();
  },

  /**
   * 分享清单
   */
  onShareAppMessage() {
    return {
      title: "猪猪地图",
      imageUrl: "/images/icon.png",
      path: "/pages/list/list"
    }
  },

  /**
   * 添加地点
   */
  addLoc() {
    let _this = this;
    wx.chooseLocation({
      success(res) {
        if (res.name) {
          let app = getApp();
          for (let loc of app.globalData.locList) {
            if (_this.isSameLoc(loc, res)) {
              return;
            }
          }
          app.globalData.locList.push(res);
          wx.setStorageSync('locList', app.globalData.locList);
          _this.updateList();
        }
      }
    });
  },

  /**
   * 删除地点
   */
  delLoc(e) {
    let _this = this;
    wx.showModal({
      content: '确认删除？',
      confirmColor: '#ff0000',
      confirmText: '删除',
      complete: (res) => {
        if (res.confirm) {
          let index = e.currentTarget.dataset.index;
          let loc = _this.data.locList[index];
          let app = getApp();
          app.globalData.locList.splice(app.globalData.locList.indexOf(loc), 1);
          wx.setStorageSync('locList', app.globalData.locList);
          _this.updateList();
        }
      }
    });
  },

  /**
   * 实时搜索
   */
  search(e) {
    let _this = this;
    _this.setData({
      keyWord: e.detail.value
    });
    _this.updateList();
  },

  /**
   * 清空搜索框输入
   */
  clearInput() {
    let _this = this;
    _this.setData({
      keyWord: ""
    });
    _this.updateList();
  },

  /**
   * 更新列表
   */
  updateList() {
    let _this = this;
    let tempList = getApp().globalData.locList.slice();
    tempList.reverse();
    let locList = [];
    if (_this.data.keyWord) {
      for (let loc of tempList) {
        if (loc.name.includes(_this.data.keyWord)) {
          locList.push(loc);
        }
      }
      _this.setData({
        locList: locList
      });
    } else {
      _this.setData({
        locList: tempList
      });
    }
  },

  /**
   * 判断两个位置是否相同
   */
  isSameLoc(loc1, loc2) {
    return loc1.name == loc2.name && loc1.address == loc2.address && loc1.latitude == loc2.latitude && loc1.longitude == loc2.longitude;
  },

  /**
   * 清空列表
   */
  clearList() {
    let _this = this;
    wx.showModal({
      content: '确认清空？',
      confirmText: '清空',
      confirmColor: '#ff0000',
      complete: (res) => {
        if (res.confirm) {
          getApp().globalData.locList = [];
          wx.setStorageSync('locList', []);
          _this.updateList();
        }
      }
    })
  },

  /**
   * 跳转到地图
   */
  toMap() {
    wx.navigateTo({
      url: '/pages/map/map',
    })
  }
})