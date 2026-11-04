// 构建完成后，把 sitemap 中的 URL 提交给 IndexNow（Bing / Yandex 等）
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const host = 'docs.sajunan.cn'
const key = '5df9445c6c1f45e9bd90354c4129479a'
const sitemapPath = resolve('docs/.vitepress/dist/sitemap.xml')

const xml = await readFile(sitemapPath, 'utf8')
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((match) => match[1])
  .filter((url) => !url.includes('/secret/') && !url.endsWith('/404'))

if (urls.length === 0) {
  console.error('未在 sitemap 中找到可提交的 URL')
  process.exit(1)
}

const payload = {
  host,
  key,
  keyLocation: `https://${host}/${key}.txt`,
  urlList: urls
}

if (process.env.INDEXNOW_DRY_RUN === '1') {
  console.log(`[dry-run] 待提交 ${urls.length} 个 URL`)
  console.log(payload.keyLocation)
  process.exit(0)
}

const keyResponse = await fetch(payload.keyLocation, { method: 'GET' })
const keyBody = keyResponse.ok ? (await keyResponse.text()).trim() : ''

if (!keyResponse.ok || keyBody !== key) {
  console.log(
    `跳过提交：${payload.keyLocation} 尚不可访问或内容不匹配（${keyResponse.status}）`
  )
  process.exit(0)
}

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(payload)
})

console.log(`IndexNow 提交 ${urls.length} 个 URL，状态码 ${response.status}`)

if (!response.ok) {
  console.error(await response.text())
  process.exit(1)
}
