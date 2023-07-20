'use strict';
exports.main = async (event, context) => {
	if (!event.openId || !event.name) {
		return { errCode: 1, errMsg: '参数错误' }
	}
	if (event.name.length > 10) {
		return { errCode: 1, errMsg: '清单名称不能超过10个字符' }
	}
	
	const { openId, name } = event
	
	const db = uniCloud.databaseForJQL({ event, context })
	await db.collection('list')
		.add({ openId, name })
	return {}
};
