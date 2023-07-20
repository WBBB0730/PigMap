<template>
	<view>
		<map v-if="ready" :markers="markers" :longitude="longitude" :latitude="latitude" :scale="scale" :include-points="include" @callouttap="preview($event.detail.markerId)" @tap="closePreview()" />
		<view class="button" @tap="zoomOut()">
			<uni-icons type="map" size="48rpx" color="#ffffff" />
		</view>
		<view v-if="locIndex !== null" class="info">
			<view class="top" @tap="closePreview()">
				<uni-icons type="bottom" size="36rpx" />
			</view>
			<view class="title">
				<text class="loc-name" @tap="handleTapName()">{{ list[locIndex].name }}</text>
				<uni-icons type="map-pin-ellipse" size="48rpx" color="#07c160" @tap="focus(locIndex)" />
			</view>
			<view class="address-box" @tap="navigate(locIndex)">
				<uni-icons type="location" size="36rpx" color="#909399" />
				<text class="address">{{ list[locIndex].address }}</text>
				<uni-icons type="right" size="32rpx" color="#909399" />
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				ready: false,
				locIndex: null,
				longitude: 113.936696,
				latitude: 22.532742,
				listId: null,
				name: '',
				list: [],
				include: [],
				scale: 16
			}
		},
		computed: {
			markers() {
				return this.list.map((loc, index) => {
					return {
						id: index,
						longitude: loc.longitude,
						latitude: loc.latitude,
						width: 0,
						height: 0,
						callout: {
							display: 'ALWAYS',
							content: loc.name,
							bgColor: '#ffffff',
							borderRadius: '8rpx',
							padding: '24rpx',
							borderWidth: '1rpx',
							borderColor: '#909399'
						}
					}
				})
			}
		},
		onLoad(options) {
			this.listId = options.listId
			this.updateList()
		},
		onShareAppMessage(res) {
			return {
				title: '[分享清单]' + this.name,
				path: '/pages/share/share?listId=' + this.listId,
				imageUrl: '/static/icon.png'
			}
		},
		methods: {
			async updateList() {
				if (!this.listId) {
					return
				}
				uni.showLoading()
				const res = (await uniCloud.callFunction({
					name: 'getList',
					data: {
						listId: this.listId
					}
				})).result
				if (res.errCode) {
					uni.showToast({
						icon: 'error',
						title: res.errMsg || ''
					})
					return
				}
				const { list, name } = res.listInfo
				this.list = list
				this.name = name
				this.include = [...list]
				this.ready = true
				uni.hideLoading()
			},
			handleTapName() {
				uni.setClipboardData({
					data: this.list[this.locIndex].name
				})
			},
			focus(index) {
				this.longitude = 113.936696
				this.latitude = 22.532742
				this.scale = null
				this.$nextTick(() => {
					this.longitude = this.list[index].longitude
					this.latitude = this.list[index].latitude
					this.scale = 16
				})
			},
			zoomOut() {
				this.include = []
				this.$nextTick(() => {
					this.include = [...this.list]
				})
			},
			preview(index) {
				this.locIndex = index
			},
			navigate(index) {
				const { name, address, longitude, latitude } = this.list[index]
				uni.openLocation({ name, address, longitude, latitude })
			},
			closePreview() {
				this.locIndex = null
			}
		}
	}
</script>

<style lang="scss">
	page {
		font-size: 28rpx;
	}
	
	map {
		width: 750rpx;
		height: 100vh;
	}
	.button {
		position: fixed;
		left: 40rpx;
		bottom: 80rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		box-shadow: 0 0 16rpx $uni-secondary-color;
		background-color: #07c160;
	}
	
	.info {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		width: 750rpx;
		padding-bottom: 32rpx;
		box-sizing: border-box;
		border-radius: 32rpx 32rpx 0 0;
		box-shadow: 0 0 16rpx $uni-secondary-color;
		background-color: #ffffff;
		.top {
			display: flex;
			justify-content: center;
			padding-top: 8rpx;
		}
		.title {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 12rpx 32rpx;
			.loc-name {
				font-size: 32rpx;
			}
		}
		.address-box {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 12rpx 32rpx 12rpx 24rpx;
			.address {
				flex-grow: 1;
				margin: 0 4rpx;
				color: $uni-secondary-color;
				font-size: 26rpx;
			}
		}
	}
</style>
