'use strict';
exports.main = async (event, context) => {
	if (!event.listId || !event.openId) {
		return { errCode: 1, errMsg: '参数错误' }
	}
	
	const { listId, openId } = event
	
	const db = uniCloud.databaseForJQL({ event, context })
	const listInfo = (await db.collection('list')
		.doc(listId)
		.field('openId')
		.get()).data[0]
	if (listInfo.openId !== openId) {
		return { errCode: 2, errMsg: '没有修改权限' }
	}
	await db.collection('list')
		.doc(listId)
		.update({
			isDel: true
		})
	return {}
};
