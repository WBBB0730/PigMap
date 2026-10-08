'use strict';
exports.main = async (event, context) => {
	console.log("event: ", event)
	if (event.code) {
		const { code } = event
		const res = await uniCloud.httpclient.request('https://api.weixin.qq.com/sns/jscode2session', {
			contentType: 'json',
			dataType: 'json',
			data: {
				// 在 uniCloud 控制台的云函数环境变量中配置
				appid: process.env.WX_APPID,
				secret: process.env.WX_APPSECRET,
				js_code: code,
				grant_type: 'authorization_code'
			}
		})
		if (res.data && res.data.openid) {
			const openId = res.data.openid
			const db = uniCloud.databaseForJQL({
				event,
				context
			})
			return { openId }
		} else {
			return { errCode: 2, errMsg: '获取openId失败' }
		}
	}
	return { errCode: 1, errMsg: '缺少code' }
};
