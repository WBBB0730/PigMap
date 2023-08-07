<script>
	export default {
		onLaunch() {
		},
		globalData: {
			openId: ''
		},
		onShareAppMessage() {
			return {
				title: '猪猪地图',
				path: '/pages/lists/lists',
				imageUrl: '/static/icon.png'
			}
		},
		methods: {
			/** 登录 */
			login() {
				return new Promise((resolve) => {
					uni.showLoading()
					uni.login({
						provider: 'weixin',
						success: ({ code }) => {
							if (!code)
								return
							uniCloud.callFunction({
								name: 'login',
								data: { code }
							}).then((res) => {
								this.globalData.openId = res.result.openId
								uni.hideLoading()
								resolve()
							})
						}
					})
				})
			},
			
			/**
			 * 获取弹窗输入
			 */
			getInput(options, err) {
				return new Promise((resolve, reject) => {
					if (err) {
						uni.showModal({
							title: '提示',
							content: err,
							showCancel: false,
							complete: () => {
								uni.showModal({
									editable: true,
									...options,
									success: (res) => {
										if (res.confirm) {
											resolve(res.content.replaceAll('\n', ' '))
										} else {
											resolve(null)
										}
									}
								})
							}
						})
					} else {
						uni.showModal({
							editable: true,
							...options,
							success: (res) => {
								if (res.confirm) {
									resolve(res.content.replaceAll('\n', ' '))
								} else {
									resolve(null)
								}
							}
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import '@/uni_modules/uni-scss/index.scss';
	/* #ifndef APP-NVUE */
	@import '@/static/customicons.css';
	// 设置整个项目的背景色
	page {
		background-color: #f5f5f5;
	}

	/* #endif */
	.example-info {
		font-size: 14px;
		color: #333;
		padding: 10px;
	}
</style>
