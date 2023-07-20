'use strict';
exports.main = async (event, context) => {
	if (!event.listId || !event.openId || !event.locs) {
		return { errCode: 1, errMsg: '参数错误' }
	}
	
	const { listId, openId, locs } = event
	
	const db = uniCloud.databaseForJQL({ event, context })
	const listInfo = (await db.collection('list')
		.doc(listId)
		.get()).data[0]
	if (listInfo.openId !== openId) {
		return { errCode: 2, errMsg: '没有修改权限' }
	}
	
	for (const loc of locs) {
		const index = listInfo.list.findIndex(item => (JSON.stringify(item) === JSON.stringify(loc)))
		if (index != -1) {
			listInfo.list.splice(index, 1)
		}
	}
	
	await db.collection('list')
		.doc(listId)
		.update({
			list: listInfo.list,
			total: listInfo.list.length
		})
	return {}
};
