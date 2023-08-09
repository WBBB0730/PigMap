<template>
	<view>
		<view class="title">
			<text class=list-name>{{ name }}</text>
			<text space="nbsp"> [来自用户分享]</text>
		</view>
		
		<view v-for="(item, index) in list" :key="index" class="loc" @focus="($event) => { console.log($event) }" hover-class="hover" hover-stay-time="0" @tap="handleTapLoc(index)">
			<view class="middle">
				<text>{{ item.name }}</text>
			</view>
			<view class="right" hover-stop-propagation @tap.stop @longpress.stop>
				<uni-tooltip :content="item.address">
					<uni-icons type="info" size="48rpx" color="#909399" />
				</uni-tooltip>
			</view>
		</view>
		
		<view class="block" />
		
		<view class="footer">
			<button class="default" @tap="saveList()">保存</button>
			<button class="primary" @tap="toMap()">确定</button>
		</view>
	</view>
</template>

<script>
	import { inputListName } from '/utils/input.js'
	const app = getApp()
	export default {
		data() {
			return {
				listId: null,
				name: '',
				keyword: '',
				list: []
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
			/** 加载清单 */
			async updateList() {
				if (!this.listId)
					return
					
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
				uni.hideLoading()
			},
			
			/** 保存清单 */
			async saveList() {
				if (!app.globalData.openId)
					await app.login()
				const listId = this.listId
				const openId = app.globalData.openId
				if (!listId || !openId)
					return
				
				const name = await inputListName('保存清单', this.name)
				if (name === null)
					return
					
				uni.showLoading()
				let res = (await uniCloud.callFunction({
					name: 'saveList',
					data: { listId, openId, name }
				})).result
				if (res.errCode) {
					uni.showToast({
						icon: 'error',
						title: res.errMsg || ''
					})
					return
				}
				uni.showToast({
					icon: 'success',
					title: '保存成功'
				})
				uni.navigateTo({ url: '/pages/list/list?listId=' + res.listId })
			},
			
			handleTapLoc(index) {
				uni.setClipboardData({ data: this.list[index].name })
			},
			
			toMap() {
				uni.navigateTo({ url: '/pages/map/map?listId=' + this.listId })
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
	
	.block {
		height: 104rpx;
	}
	
	.footer {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		justify-content: space-between;
		padding: 12rpx 24rpx;
		background-color: #ffffff;
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
