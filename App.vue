<script>
	export default {
		onLaunch() {},
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
				uni.showLoading()
				return uni.login({ provider: 'weixin' }).then(({ code }) => {
					if (!code)
						return Promise.reject()
					return uniCloud.callFunction({
						name: 'login',
						data: { code }
					})
				}).then((res) => {
					this.globalData.openId = res.result.openId
					uni.hideLoading()
				}).catch(() => {
					uni.showToast({
						icon: 'error',
						title: '登录失败'
					})
				})
			},

			/** 获取弹窗输入 */
			getInput(options, err) {
				if (err)
					return uni.showModal({
						title: '提示',
						content: err,
						showCancel: false
					}).then(() => uni.showModal({
						editable: true,
						...options
					})).then(({ confirm, content }) => confirm ? content.replaceAll('\n', ' ') : null)
				
				return uni.showModal({
					editable: true,
					...options
				}).then(({ confirm, content }) => confirm ? content.replaceAll('\n', ' ') : null)
			},
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