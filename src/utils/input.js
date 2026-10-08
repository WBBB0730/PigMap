/** 获取弹窗输入 */
export function getInput(options) {
	return uni.showModal({
		editable: true,
		...options
	}).then(({ confirm, content }) => confirm ? content.replaceAll('\n', ' ').trim() : null)
}

/** 输入清单名称 */
export async function inputListName(title, name = '') {
	name = await getInput({
		title,
		content: name,
		placeholderText: '请输入清单名称'
	})
	while (name !== null && (!name || name.length > 10)) {
		await uni.showModal({
			title: '提示',
			content: name ? '清单名称不能超过10个字符' : '清单名称不能为空',
			showCancel: false
		})
		name = await getInput({
			title,
			content: name,
			placeholderText: '请输入清单名称'
		})
	}
	return name
}
