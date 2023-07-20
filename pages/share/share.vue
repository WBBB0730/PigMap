<template>
	<view>
		<view class="title">
			<text class=list-name>{{ name }}</text>
			<text space="nbsp"> [来自用户分享]</text>
			<!-- <uni-search-bar radius="32rpx" placeholder="在清单中搜索" cancel-button="none" focus /> -->
			
		</view>
		
		<view v-for="(item, index) in list" :key="index" class="loc" @focus="($event) => { console.log($event) }" hover-class="hover" hover-stay-time="0" @longpress="handleLongPressLoc(index)" @tap="handleTapLoc(index)">
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
			<button class="default" @tap="saveList()">保存</button>
			<button class="primary" @tap="toMap()">确定</button>
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
			
			async saveList() {
				const app = getApp()
				const openId = app.globalData.openId
				if (!openId || !this.listId) {
					return
				}
				let name = this.name
				name = await app.getInput({
					title: '保存清单',
					content: name,
					placeholderText: '请输入清单名称'
				})
				while (name !== null && !(name && name.length <= 10)) {
					let err = ''
					if (!name) {
						err = '清单名称不能为空'
					} else if (name.length > 10) {
						err = '清单名称不能超过10个字符'
					}
					name = await app.getInput({
						title: '保存清单',
						content: name,
						placeholderText: '请输入清单名称'
					}, err)
				} 
				if (name === null) {
					return
				}
				uni.showLoading()
				let res = (await uniCloud.callFunction({
					name: 'saveList',
					data: {
						openId,
						name,
						listId: this.listId,
					}
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
				uni.navigateTo({
					url: '/pages/list/list?listId=' + res.listId
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
