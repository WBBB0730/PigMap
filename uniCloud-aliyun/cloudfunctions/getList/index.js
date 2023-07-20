'use strict';
exports.main = async (event, context) => {
	if (!event.listId) {
		return { errCode: 1, errMsg: '参数错误' }
	}
	const { listId } = event
	const keyword = event.keyword || ''
	
	const db = uniCloud.databaseForJQL({ event, context })
	const listInfo = (await db.collection('list')
		.doc(listId)
		.get()).data[0]
		
	if (listInfo.isDel) {
		return { errCode: 2, errMsg: '该清单已被删除' }
	}
	
	const list = []
	for (const loc of listInfo.list) {
		if (loc.name.includes(keyword) || loc.address.includes(keyword)) {
			list.push(loc)
		}
	}
	listInfo.list = list
	
	return { listInfo }
};
