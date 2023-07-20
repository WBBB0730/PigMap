<template>
	<view>
		<view class="lists">
			<view v-for="(item, index) in lists" :key="index" class="list" hover-class="hover" hover-start-time="0" hover-stay-time="0" @tap="handleTapList(index)" @longpress="editing = true">
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
		onShow() {
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
			/**
			 * 更新清单列表
			 */
			async updateLists() {
				const app = getApp()
				const openId = app.globalData.openId
				if (!openId) {
					return
				}
				uni.showLoading()
				const res = (await uniCloud.callFunction({
					name: 'getLists',
					data: {
						openId
					}
				})).result
				console.log(res)
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
			
			/**
			 * 新建清单
			 */
			async addList() {
				const app = getApp()
				const openId = app.globalData.openId
				if (!openId) {
					return
				}
				let name;
				for (let i = 1; ; i++) {
					name = '我的清单' + i
					if (!this.lists.map(item => item.name).includes(name)) {
						break
					}
				}
				name = await app.getInput({
					title: '新建清单',
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
						title: '新建清单',
						content: name,
						placeholderText: '请输入清单名称'
					}, err)
				} 
				if (name === null) {
					return
				}
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
			
			/**
			 * 删除清单
			 */
			async delList(index) {
				const app = getApp()
				const openId = app.globalData.openId
				if (!openId) {
					return
				}
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
			
			/**
			 * 修改清单名称
			 */
			async renameList(index) {
				const app = getApp()
				const openId = app.globalData.openId
				if (!openId) {
					return
				}
				const listId = this.lists[index]._id
				let name = this.lists[index].name;
				name = await app.getInput({
					title: '修改清单名称',
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
						title: '修改清单名称',
						content: name,
						placeholderText: '请输入清单名称'
					}, err)
				} 
				if (name === null) {
					return
				}
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
				if (this.editing) {
					this.renameList(index)
				} else {
					uni.navigateTo({
						url: '/pages/list/list?listId=' + this.lists[index]._id
					})
				}
			},
			handleTapDel(index) {
				uni.showModal({
					title: '提示',
					content: '确定要删除该清单吗',
					success: (res) => {
						if (res.confirm) {
							this.delList(index)
						}
					}
				})
			},
			handleTapButton() {
				if (this.editing) {
					this.editing = false
				} else {
					this.addList()
				}
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
