// pages/list/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    locList: {},
    keyWord: "",
    listIndex: 0,
    isMenuOpen: false,
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
    let lists = [];
    let app = getApp();
    for (let list of app.globalData.locLists) {
      lists.push({
        name: list.name,
        num: list.locs.length
      });
    }
    _this.setData({
      lists: lists
    });
    // 更新当前清单
    let listIndex = _this.data.listIndex;
    while (app.globalData.delLists.length > 0) {
      let index = app.globalData.delLists[0];
      if (index == listIndex) {
        listIndex = 0;
      } else if (index < listIndex) {
        listIndex--;
      }
      app.globalData.delLists.splice(0, 1);
    }
    _this.setData({
      listIndex: listIndex
    });
    _this.updateList();
  },

  /**
   * 分享
   */
  async onShareAppMessage() {
    let _this = this;
    let type = await function () {
      return new Promise((resolve) => {
        wx.showActionSheet({
          itemList: ["分享我的清单", "仅分享小程序"],
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
        title: "[分享清单]" + _this.data.locList.name,
        imageUrl: "/images/icon.png",
        path: "/pages/share/share?id=" + res.data.id
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
   * 打开或关闭清单选择菜单
   */
  openOrCloseMenu(e) {
    let _this = this;
    _this.setData({
      isMenuOpen: e.target.dataset.flag === undefined ? !_this.data.isMenuOpen : e.target.dataset.flag
    });
  },

  /**
   * 选择清单
   */
  chooseList(e) {
    let _this = this;
    _this.setData({
      listIndex: e.currentTarget.dataset.index
    });
    _this.openOrCloseMenu({
      target: {
        dataset: {
          flag: false
        }
      }
    });
    _this.updateList();
  },

  /**
   * 跳转到清单管理
   */
  toLists() {
    let _this = this;
    _this.openOrCloseMenu({
      target: {
        dataset: {
          flag: false
        }
      }
    });
    wx.navigateTo({
      url: '/pages/lists/lists',
    })
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
          let locList = app.globalData.locLists[_this.data.listIndex];
          for (let loc of locList.locs) {
            if (_this.isSameLoc(loc, res)) {
              return;
            }
          }
          locList.locs.push(res);
          wx.setStorageSync('locLists', app.globalData.locLists);
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
          let loc = _this.data.locList.locs[index];
          let app = getApp();
          let locList = app.globalData.locLists[_this.data.listIndex];
          locList.locs.splice(locList.locs.indexOf(loc), 1);
          wx.setStorageSync('locLists', app.globalData.locLists);
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
   * 更新清单
   */
  updateList() {
    let _this = this;
    let app = getApp();
    let locList = app.globalData.locLists[_this.data.listIndex];
    let tempLocs = locList.locs.slice();
    tempLocs.reverse();
    let locs = [];
    if (_this.data.keyWord) {
      for (let loc of tempLocs) {
        if (loc.name.includes(_this.data.keyWord)) {
          locs.push(loc);
        }
      }
      _this.setData({
        locList: {
          name: locList.name,
          locs: locs
        }
      });
    } else {
      _this.setData({
        locList: {
          name: locList.name,
          locs: tempLocs
        }
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
   * 清空清单
   */
  clearList() {
    let _this = this;
    wx.showModal({
      content: '确认清空？',
      confirmText: '清空',
      confirmColor: '#ff0000',
      complete: (res) => {
        if (res.confirm) {
          let app = getApp();
          let locList = app.globalData.locLists[_this.data.listIndex];
          locList.locs = [];
          wx.setStorageSync('locLists', app.globalData.locLists);
          _this.updateList();
        }
      }
    })
  },

  /**
   * 跳转到地图
   */
  toMap() {
    let _this = this;
    wx.navigateTo({
      url: '/pages/map/map?listIndex=' + _this.data.listIndex,
    })
  },

  // test() {
  //   wx.navigateTo({
  //     url: '/pages/share/share?id=ff3a195863c3c96f0022c58062b24853',
  //   })
  // }
})