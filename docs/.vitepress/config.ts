import { defineConfig, type HeadConfig } from 'vitepress'

const siteUrl = 'https://docs.sajunan.cn'
const siteTitle = 'CTF 新手手册'
const siteDescription =
  '面向 CTF 新手的系统化学习手册：密码学、Web、Pwn、Reverse、Misc、取证、区块链与 AI 安全，从入门到实战。'

function resolvePageUrl(relativePath: string) {
  const path = relativePath
    .replace(/(^|\/)index\.md$/, '$1')
    .replace(/\.md$/, '')
  return new URL(path, `${siteUrl}/`).href
}

export default defineConfig({
  lang: 'zh-CN',
  title: siteTitle,
  description: siteDescription,
  cleanUrls: true,
  lastUpdated: true,

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#2563eb' }],
    ['meta', { name: 'author', content: 'Inui Sajuna' }],
    [
      'meta',
      {
        name: 'keywords',
        content:
          'CTF,CTF 新手手册,网络安全,密码学,Web 安全,Pwn,Reverse,Misc,取证,区块链,AI 安全'
      }
    ],
    ['meta', { name: 'robots', content: 'index, follow' }],
    [
      'meta',
      {
        name: 'ctf-easter-egg',
        content: 'flag{54GM5rOo5aGU6I+y6LCi6LCi5Za1}'
      }
    ],
    ['meta', { property: 'og:site_name', content: siteTitle }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { property: 'og:image', content: `${siteUrl}/og.png` }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    ['meta', { property: 'og:image:alt', content: siteTitle }],
    ['meta', { name: 'twitter:image', content: `${siteUrl}/og.png` }],
    [
      'script',
      { type: 'application/ld+json' },
      JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: siteTitle,
        url: siteUrl,
        description: siteDescription,
        inLanguage: 'zh-CN'
      })
    ]
  ],

  markdown: {
    math: true
  },

  sitemap: {
    hostname: siteUrl,
    transformItems(items) {
      return items.filter((item) => {
        const page = item.url.replace(/^\/+/, '')
        return page !== '404' && !page.startsWith('secret')
      })
    }
  },

  transformPageData(pageData) {
    const url = resolvePageUrl(pageData.relativePath)
    const head = (pageData.frontmatter.head ??= []) as HeadConfig[]
    head.push(
      ['link', { rel: 'canonical', href: url }],
      ['meta', { property: 'og:url', content: url }],
      [
        'meta',
        {
          property: 'og:title',
          content: pageData.title
            ? `${pageData.title} | ${siteTitle}`
            : siteTitle
        }
      ],
      [
        'meta',
        {
          property: 'og:description',
          content: pageData.description || siteDescription
        }
      ]
    )
  },

  themeConfig: {
    logo: '/logo.svg',

    nav: [
      { text: '首页', link: '/' },
      { text: '密码学', link: '/crypto/', activeMatch: '/crypto/' },
      { text: 'Web', link: '/web/', activeMatch: '/web/' },
      { text: 'Pwn', link: '/pwn/', activeMatch: '/pwn/' },
      { text: 'Reverse', link: '/reverse/', activeMatch: '/reverse/' },
      { text: 'Misc', link: '/misc/', activeMatch: '/misc/' },
      { text: '取证', link: '/forensics/', activeMatch: '/forensics/' },
      { text: '区块链', link: '/blockchain/', activeMatch: '/blockchain/' },
      { text: 'AI 安全', link: '/ai/', activeMatch: '/ai/' }
    ],

    sidebar: [
      {
        text: '密码学 Crypto',
        items: [{ text: '密码学入门', link: '/crypto/' }]
      },
      {
        text: 'Web 安全',
        items: [{ text: 'Web 入门', link: '/web/' }]
      },
      {
        text: 'Pwn 二进制利用',
        items: [{ text: 'Pwn 入门', link: '/pwn/' }]
      },
      {
        text: 'Reverse 逆向工程',
        items: [{ text: 'Reverse 入门', link: '/reverse/' }]
      },
      {
        text: 'Misc 杂项',
        items: [{ text: 'Misc 入门', link: '/misc/' }]
      },
      {
        text: 'Forensics 取证',
        items: [{ text: '取证入门', link: '/forensics/' }]
      },
      {
        text: 'Blockchain 区块链',
        items: [{ text: '区块链入门', link: '/blockchain/' }]
      },
      {
        text: 'AI 安全',
        items: [{ text: 'AI 安全入门', link: '/ai/' }]
      }
    ],

    outline: {
      level: [2, 3],
      label: '本页目录'
    },

    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },

    lastUpdated: {
      text: '最后更新于'
    },

    editLink: {
      pattern:
        'https://github.com/NAN8991/docs.sajunan.cn/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页'
    },

    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档'
          },
          modal: {
            noResultsText: '没有找到相关内容',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭'
            }
          }
        }
      }
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/NAN8991' }],

    footer: {
      message: '以攻促防，从理解攻击开始学习安全。',
      copyright: '© 2026 Inui Sajuna. All Rights Reserved.'
    },

    notFound: {
      code: '404',
      title: '页面走丢了',
      quote: '你访问的地址不存在。彩蛋提示：真正的隐藏页面在 /secret/。',
      link: '/secret/',
      linkLabel: '前往隐藏页面',
      linkText: '去 /secret/ 看看'
    },

    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '外观',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    skipToContentLabel: '跳到正文',
    externalLinkIcon: true
  }
})
