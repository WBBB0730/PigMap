'use strict';
exports.main = async (event, context) => {
	if (!event.openId) {
		return { errCode: 1, errMsg: '参数错误' }
	}
	
	const { openId } = event
	
	const db = uniCloud.databaseForJQL({ event, context })
	const lists = (await db.collection('list')
		.where(`openId == "${openId}" && isDel == false`)
		.field('name, total')
		.orderBy('createTime')
		.get()).data
	return { lists }
};
