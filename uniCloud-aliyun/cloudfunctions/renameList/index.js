'use strict';
exports.main = async (event, context) => {
	if (!event.listId || !event.name || !event.openId) {
		return { errCode: 1, errMsg: '参数错误' }
	}
	if (event.name.length > 10) {
		return { errCode: 1, errMsg: '清单名称不能超过10个字符' }
	}
	
	const { listId, openId, name } = event
	
	const db = uniCloud.databaseForJQL({ event, context })
	const listInfo = (await db.collection('list')
		.doc(listId)
		.field('openId')
		.get()).data[0]
	if (listInfo.openId !== openId) {
		return { errCode: 2, errMsg: '没有修改权限' }
	}
	if (listInfo.isDel) {
		return { errCode: 3, errMsg: '该清单已被删除' }
	}
	await db.collection('list')
		.doc(listId)
		.update({ name })
	return {}
};
