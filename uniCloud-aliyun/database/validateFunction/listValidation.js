// 文档教程: https://uniapp.dcloud.net.cn/uniCloud/schema?id=validatefunction
// 扩展校验函数示例
module.exports = function(rule, value, data, callback) {
	for (const location of value) {
		if (!location.longitude || isNaN(location.longitude) || !location.latitude || isNaN(location.latitude) || !location.name || typeof(location.name) !== 'string') {
			return false
		}
	}
	return true
}