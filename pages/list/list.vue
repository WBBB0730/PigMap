<template>
	<view>
		<view class="title">
			<text class=list-name>{{ name }}</text>
			<!-- <uni-search-bar radius="32rpx" placeholder="在清单中搜索" cancel-button="none" focus /> -->
			<view class="search">
				<uni-icons type="search" size="36rpx" color="#909399" />
				<input class="search-input" v-model="keyword" prefix-icon="search" placeholder="搜索清单中的地点" confirm-type="search" @confirm="updateList()" />
				<uni-icons class="clear" v-if="keyword" type="clear" size="40rpx" color="#909399" @tap="keyword = ''; updateList()" />
			</view>
		</view>
		
		<!-- <button @tap="addLoc">添加地点</button> -->
		<view class="add" @tap="addLoc()">
			<uni-icons type="plusempty" size="44rpx" color="#6a6a6a" />
			<text class="text">添加地点</text>
		</view>
			
		<view v-for="(item, index) in list" :key="index" class="loc" @focus="($event) => { console.log($event) }" hover-class="hover" hover-start-time="0" hover-stay-time="0" @longpress="handleLongPressLoc(index)" @tap="handleTapLoc(index)">
			<view v-if="editing" class="left">
				<uni-icons v-if="select[index]" type="checkbox-filled" color="#05c160" size="48rpx" />
				<uni-icons v-else type="circle" color="#dcdcdc" size="48rpx" />
			</view>
			<view class="middle">
				<text>{{ item.name }}</text>
			</view>
			<view class="right" hover-stop-propagation @tap.stop @longpress.stop>
				<uni-tooltip :content="item.address">
					<uni-icons type="info" size="48rpx" color="#909399" />
				</uni-tooltip>
			</view>
		</view>
		
		<view class="footer">
			<block v-if="!editing">
				<button class="default" open-type="share">分享</button>
				<button class="primary" @tap="toMap()">确定</button>
			</block>
			<block v-else>
				<button class="cancel" @tap="editing = false">取消</button>
				<button class="warn" :disabled="selectNum === 0" @tap="handleTapDel()">删除</button>
			</block>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				editing: false,
				listId: null,
				name: '',
				keyword: '',
				list: [],
				select: []
			}
		},
		computed: {
			selectNum() {
				let cnt = 0
				for (const item of this.select) {
					if (item) {
						cnt++
					}
				}
				return cnt
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
						listId: this.listId,
						keyword: this.keyword
					}
				})).result
				if (res.errCode) {
					uni.showToast({
						icon: 'error',
						title: res.errMsg || ''
					})
					return
				}
				const { name, list } = res.listInfo
				this.name = name
				this.list = list
				this.editing = false
				uni.hideLoading()
			},
			async addLoc() {
				const app = getApp()
				const openId = app.globalData.openId
				if (!openId) {
					return
				}
				const loc = await this.chooseLocation()
				if (!loc) {
					return
				}
				uni.showLoading()
				const res = (await uniCloud.callFunction({
					name: 'addLoc',
					data: {
						listId: this.listId,
						openId,
						loc
					}
				})).result
				if (res.errCode) {
					uni.showToast({
						icon: 'error',
						title: res.errMsg || ''
					})
					return
				}
				this.updateList()
			},
			async delLocs(locs) {
				const app = getApp()
				const openId = app.globalData.openId
				if (!this.editing || !openId || locs.length === 0) {
					return
				}
				uni.showLoading()
				const res = (await uniCloud.callFunction({
					name: 'delLocs',
					data: {
						openId,
						listId: this.listId,
						locs
					}
				})).result
				if (res.errCode) {
					uni.showToast({
						icon: 'error',
						title: res.errMsg || ''
					})
					return
				}
				this.updateList()
			},
			async chooseLocation() {
				return new Promise((resolve, reject) => {
					uni.chooseLocation({
						success: (res) => {
							resolve(res)
						},
						fail: () => {
							resolve(null)
						}
					})
				})
			},
			handleTapLoc(index) {
				if (this.editing) {
					this.select[index] = !this.select[index]
				} else {
					uni.setClipboardData({
						data: this.list[index].name
					})
				}
			},
			handleLongPressLoc(index) {
				if (!this.editing) {
					this.editing = true
					this.select = new Array(this.list.length).fill(false)
					this.select[index] = true
				}
			},
			handleTapDel() {
				uni.showModal({
					title: '提示',
					content: '确定删除选中的地点吗？',
					confirmText: '删除',
					confirmColor: '#e43d33',
					success: (res) => {
						if (res.confirm) {
							const locs = []
							for (let i = 0; i < this.list.length; i++) {
								if (this.select[i]) {
									locs.push(this.list[i])
								}
							}
							this.delLocs(locs)
						}
					}
				})
			},
			toMap() {
				uni.navigateTo({
					url: '/pages/map/map?listId=' + this.listId
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #ffffff;
		font-size: 32rpx;
	}
	
	.title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 24rpx;
		.list-name {
			font-size: 36rpx;
			font-weight: bold;
		}
		
		.search {
			display: flex;
			align-items: center;
			width: 320rpx;
			height: 64rpx;
			padding: 0 16rpx;
			box-sizing: border-box;
			border-radius: 40rpx;
			background-color: #f5f5f5;
			.search-input {
				margin: 0 8rpx;
				font-size: 28rpx;
				line-height: 1;
			}
			.clear {
				padding: 8rpx;
				margin: -8rpx;
			}
		}
	}
	
	.add {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 96rpx;
		// background-color: #f5f5f5;
		margin: 0 24rpx;
		border: 1rpx solid $uni-border-3;
		box-sizing: border-box;
		border-radius: 16rpx;
		color: $uni-base-color;
		line-height: 1;
		.text {
			margin-left: 8rpx;
		}
	}
	
	.loc {
		display: flex;
		align-items: center;
		height: 100rpx;
		padding: 0 24rpx;
		.left {
			margin-right: 8rpx;
		}
		.middle {
			flex-grow: 1;
		}
		.right {
			padding: 16rpx;
			margin: -16rpx;
			.uni-tooltip-popup {
				right: 0;
				left: unset;
				max-width: 600rpx;
				width: max-content;
				box-sizing: border-box;
			}
		}
	}
	.loc.hover {
		background-color: $uni-border-2;
	}
	
	.footer {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		justify-content: space-between;
		padding: 12rpx 24rpx;
		button {
			width: 325rpx;
			height: 80rpx;
			font-size: 34rpx;
			font-weight: bold;
			line-height: 80rpx;
		}
		button.default {
			color: #06ae56;
			background-color: #f2f2f2;
		}
		button.primary {
			color: #ffffff;
			background-color: #07c160;
		}
		button.cancel {
			color: $uni-secondary-color;
			background-color: #f2f2f2;
		}
		button.warn {
			color: #ffffff;
			background-color: #fa5151;
		}
		button.warn[disabled] {
			color: #ffffff99;
			background-color: $uni-error-disable;
		}
	}
</style>
