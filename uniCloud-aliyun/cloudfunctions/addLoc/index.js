'use strict';
exports.main = async (event, context) => {
	if (!event.listId || !event.openId || !event.loc || !event.loc.name || !event.loc.address || !event.loc.longitude || !event.loc.latitude) {
		return { errCode: 1, errMsg: '参数错误' }
	}
	
	const { listId, openId } = event
	const { name, address, longitude, latitude } = event.loc
	const loc = { name, address, longitude, latitude }
	
	const db = uniCloud.databaseForJQL({ event, context })
	const listInfo = (await db.collection('list')
		.doc(listId)
		.get()).data[0]
	if (listInfo.openId !== openId) {
		return { errCode: 2, errMsg: '没有修改权限' }
	}
	if (listInfo.list.find(item => (JSON.stringify(item) === JSON.stringify(loc)))) {
		return { errCode: 3, errMsg: '该地点已存在' }
	}
	listInfo.list.unshift(loc)
	await db.collection('list')
		.doc(listId)
		.update({
			list: listInfo.list,
			total: listInfo.list.length
		})
	return {}
};
