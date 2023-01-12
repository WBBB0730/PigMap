// pages/map/map.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    longitude: 113.939436,
    latitude: 22.528138,
    locList: [],
    markers: []
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
    let locList = getApp().globalData.locList.slice();
    if (locList.length) {
      _this.setData({
        locList: locList,
        latitude: locList[locList.length - 1].latitude,
        longitude: locList[locList.length - 1].longitude
      });
    }
    let markers = [];
    for (let i = 0; i < locList.length; i++) {
      markers.push({
        id: i,
        latitude: locList[i].latitude,
        longitude: locList[i].longitude,
        iconPath: "",
        callout: {
          content: locList[i].name,
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
   * 分享清单
   */
  onShareAppMessage() {
    return {
      title: "猪猪地图",
      imageUrl: "/images/icon.png",
      path: "/pages/list/list"
    }
  },
})