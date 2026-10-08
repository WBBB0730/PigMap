/** uniCloud 服务空间，空间信息在构建时由环境变量注入 */
export default uniCloud.init({
	provider: 'aliyun',
	spaceId: import.meta.env.VITE_UNICLOUD_SPACE_ID,
	clientSecret: import.meta.env.VITE_UNICLOUD_CLIENT_SECRET,
	endpoint: 'https://api.next.bspapp.com'
})
