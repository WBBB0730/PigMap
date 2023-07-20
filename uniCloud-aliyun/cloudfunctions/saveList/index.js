'use strict';
exports.main = async (event, context) => {
	if (!event.listId || !event.openId || !event.name) {
		return { errCode: 1, errMsg: '参数错误' }
	}
	if (event.name.length > 10) {
		return { errCode: 1, errMsg: '清单名称不能超过10个字符' }
	}
	const { listId, openId, name } = event
	
	const db = uniCloud.databaseForJQL({ event, context })
	const listInfo = (await db.collection('list')
		.doc(listId)
		.get()).data[0]
		
	if (listInfo.isDel) {
		return { errCode: 2, errMsg: '该清单已被删除' }
	}
	
	const id = (await db.collection('list')
		.add({
			openId,
			name,
			list: listInfo.list,
			total: listInfo.list.length
		})).id
	return { listId: id }
};
