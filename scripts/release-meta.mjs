import { randomUUID } from 'node:crypto'
import { readFileSync } from 'node:fs'

const tag = process.argv[2]
const { version } = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))

if (tag !== `v${version}`) {
  throw new Error(`Tag ${tag ?? '(missing)'} does not match package.json version ${version}`)
}

// 更新说明 = CHANGELOG.md 里这一版那段（「## [版本号]」到下一个「## 」之间）；没写就留空
const changelog = readFileSync(new URL('../CHANGELOG.md', import.meta.url), 'utf8')
const entry = changelog.split(/^## /m).find((section) => section.startsWith(`[${version}]`))
const notes = entry ? entry.slice(entry.indexOf('\n') + 1).trim() : ''
// 多行输出按 GitHub 文档写成 heredoc，分隔符随机，避免与正文撞车
const delimiter = `NOTES_${randomUUID()}`

process.stdout.write(`version=${version}\n`)
process.stdout.write(`notes<<${delimiter}\n${notes}\n${delimiter}\n`)
