<template>
	<view>
		<view v-if="lists.length === 0" class="empty">点击右下角 + 号创建清单</view>
		<view class="lists">
			<view v-for="(item, index) in lists" :key="index" class="list" hover-class="hover" hover-start-time="0" hover-stay-time="0" @tap="handleTapList(index)" @longpress="editing = !editing">
				<view class="left">
					<text class="list-name" space="nbsp">{{ item.name }}</text>
					<text class="total">共{{ item.total }}个地点</text>
				</view>
				<view class="right" @tap.stop="handleTapDel(index)">
					<uni-icons v-if="!editing" type="right" />
					<uni-icons v-else type="minus-filled" color="#e43d33" size="64rpx" />
				</view>
			</view>
		</view>
		<movable-area>
			<movable-view class="ball" direction="all" :animation="false" x="600rpx" :y="windowHeight - toPx(200)" @tap="handleTapButton">
				<uni-icons :type="editing? 'checkmarkempty' : 'plusempty'" color="#ffffff" size="44rpx" />
			</movable-view>
		</movable-area>
	</view>
</template>

<script>
	import { inputListName } from '/utils/input.js'
	const app = getApp()
	export default {
		data() {
			return {
				editing: false,
				lists: [],
				windowWidth: 0,
				windowHeight: 0
			}
		},
		onLoad() {
			const { windowWidth, windowHeight } = uni.getSystemInfoSync()
			this.windowWidth = windowWidth
			this.windowHeight = windowHeight
		},
		async onShow() {
			if (!app.globalData.openId)
				await app.login()
			this.updateLists()
		},
		onShareAppMessage() {
			return {
				title: '猪猪地图',
				path: '/pages/lists/lists',
				imageUrl: '/static/icon.png'
			}
		},
		methods: {
			toPx(rpx) {
				return rpx / 750 * this.windowWidth
			},
			
			/** 更新清单列表 */
			async updateLists() {
				const openId = app.globalData.openId
				if (!openId)
					return
					
				uni.showLoading()
				const res = (await uniCloud.callFunction({
					name: 'getLists',
					data: { openId }
				})).result
				if (res.errCode) {
					uni.showToast({
						icon: 'error',
						title: res.errMsg || ''
					})
					return
				}
				this.lists = res.lists
				uni.hideLoading()
			},
			
			/** 新建清单 */
			async addList() {
				const openId = app.globalData.openId
				if (!openId)
					return
					
				let name = '我的清单1'
				const names = this.lists.map(item => item.name)
				for (let i = 2; names.includes(name); i++)
					name = '我的清单' + i
				name = await inputListName('新建清单', name)
				if (name === null)
					return
				
				uni.showLoading()
				let res = (await uniCloud.callFunction({
					name: 'addList',
					data: { openId, name }
				})).result
				if (res.errCode) {
					uni.showToast({
						icon: 'error',
						title: res.errMsg || ''
					})
					return
				}
				this.updateLists()
			},
			
			/** 删除清单 */
			async delList(index) {
				const openId = app.globalData.openId
				if (!openId)
					return
					
				const listId = this.lists[index]._id
				uni.showLoading()
				let res = (await uniCloud.callFunction({
					name: 'delList',
					data: { openId, listId }
				})).result
				if (res.errCode) {
					uni.showToast({
						icon: 'error',
						title: res.errMsg || ''
					})
					return
				}
				this.updateLists()
			},
			
			/** 修改清单名称 */
			async renameList(index) {
				const openId = app.globalData.openId
				if (!openId)
					return
				
				const listId = this.lists[index]._id
				const name = await inputListName('修改清单名称', this.lists[index].name)
				if (name === null)
					return
				
				uni.showLoading()
				let res = (await uniCloud.callFunction({
					name: 'renameList',
					data: { openId, listId, name }
				})).result
				if (res.errCode) {
					uni.showToast({
						icon: 'error',
						title: res.errMsg || ''
					})
					return
				}
				this.updateLists()
			},
			
			handleTapList(index) {
				if (this.editing)
					this.renameList(index)
				else
					uni.navigateTo({ url: '/pages/list/list?listId=' + this.lists[index]._id })
			},
			
			handleTapDel(index) {
				uni.showModal({
					title: '提示',
					content: '确定要删除该清单吗',
				}).then(({ confirm }) => {
					if (confirm)
							this.delList(index)
				})
			},
			
			handleTapButton() {
				if (this.editing)
					this.editing = false
				else
					this.addList()
			},
		}
	}
</script>

<style lang="scss">
	page {
		font-size: 32rpx;
	}
	
	.buttons {
		display: flex;
	}
	
	.empty {
		display: flex;
		box-sizing: border-box;
		height: 100vh;
		padding-bottom: 100rpx;
		justify-content: center;
		align-items: center;
		color: $uni-secondary-color;
	}
	
	.list {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 32rpx;
		.left {
			display: flex;
			flex-direction: column;
			.list-name {
				margin-bottom: 4rpx;
			}
			.total {
				font-size: 26rpx;
				color: $uni-secondary-color;
			}
		}
		.right {
			padding: 16rpx;
			margin: -16rpx;
		}
	}
	.list.hover {
		background-color: $uni-border-2;
	}
	movable-area {
		 position: absolute;
		 left: 0;
		 top: 0;
		 width: 100vw;
		 height: 100vh;
		 pointer-events: none;
		 movable-view {
			 display: flex;
			 justify-content: center;
			 align-items: center;
			 width: 100rpx;
			 height: 100rpx;
			 border-radius: 50%;
			 transform: translate(-50%, -50%);
			 // background-color: $uni-primary;
			 background-color: #07c160;
			 pointer-events: all;
		 }
	}
</style>
