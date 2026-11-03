import { defineConfig, type DefaultTheme, type HeadConfig } from 'vitepress'

const siteUrl = 'https://docs.sajunan.cn'
const siteTitle = 'CTF 新手手册'
const siteTitleEn = 'CTF Handbook'
const siteDescription =
  '面向 CTF 新手的系统化学习手册：密码学、Web、Pwn、Reverse、Misc、取证、区块链与 AI 安全，从入门到实战。'
const siteDescriptionEn =
  'A systematic CTF handbook for beginners covering cryptography, web security, pwn, reverse engineering, misc, forensics, blockchain, and AI security.'
const siteTitleJa = 'CTF ハンドブック'
const siteDescriptionJa =
  '初心者向けの体系的な CTF ハンドブック。暗号技術、Web セキュリティ、Pwn、リバースエンジニアリング、Misc、フォレンジック、ブロックチェーン、AI セキュリティを扱います。'

const repoUrl = 'https://github.com/sajunan/docs.sajunan.cn'

function resolvePageUrl(relativePath: string) {
  const path = relativePath
    .replace(/(^|\/)index\.md$/, '$1')
    .replace(/\.md$/, '')
  return new URL(path, `${siteUrl}/`).href
}

const enThemeConfig: DefaultTheme.Config = {
  nav: [
    { text: 'Home', link: '/en/' },
    { text: 'Crypto', link: '/en/crypto/', activeMatch: '/en/crypto/' },
    { text: 'Web Security', link: '/en/web/', activeMatch: '/en/web/' },
    { text: 'Pwn', link: '/en/pwn/', activeMatch: '/en/pwn/' },
    { text: 'Reverse', link: '/en/reverse/', activeMatch: '/en/reverse/' },
    { text: 'Misc', link: '/en/misc/', activeMatch: '/en/misc/' },
    {
      text: 'Forensics',
      link: '/en/forensics/',
      activeMatch: '/en/forensics/'
    },
    {
      text: 'Blockchain',
      link: '/en/blockchain/',
      activeMatch: '/en/blockchain/'
    },
    { text: 'AI Security', link: '/en/ai/', activeMatch: '/en/ai/' }
  ],
  sidebar: [
    {
      text: 'Crypto',
      items: [{ text: 'Crypto Handbook', link: '/en/crypto/' }]
    },
    {
      text: 'Web Security',
      items: [{ text: 'Web Security Basics', link: '/en/web/' }]
    },
    {
      text: 'Pwn',
      items: [{ text: 'Pwn Basics', link: '/en/pwn/' }]
    },
    {
      text: 'Reverse Engineering',
      items: [{ text: 'Reverse Basics', link: '/en/reverse/' }]
    },
    {
      text: 'Misc',
      items: [{ text: 'Misc Basics', link: '/en/misc/' }]
    },
    {
      text: 'Forensics',
      items: [{ text: 'Forensics Basics', link: '/en/forensics/' }]
    },
    {
      text: 'Blockchain',
      items: [{ text: 'Blockchain Basics', link: '/en/blockchain/' }]
    },
    {
      text: 'AI Security',
      items: [{ text: 'AI Security Basics', link: '/en/ai/' }]
    }
  ],
  outline: {
    level: [2, 3],
    label: 'On this page'
  },
  docFooter: {
    prev: 'Previous',
    next: 'Next'
  },
  lastUpdated: {
    text: 'Last updated'
  },
  editLink: {
    pattern: `${repoUrl}/edit/main/docs/:path`,
    text: 'Edit this page on GitHub'
  },
  search: {
    provider: 'local',
    options: {
      translations: {
        button: {
          buttonText: 'Search',
          buttonAriaLabel: 'Search'
        },
        modal: {
          noResultsText: 'No results found',
          resetButtonTitle: 'Clear query',
          footer: {
            selectText: 'Select',
            navigateText: 'Navigate',
            closeText: 'Close'
          }
        }
      }
    }
  },
  footer: {
    message: 'Understand attacks to build better defenses.',
    copyright: '© 2026 Inui Sajuna. All Rights Reserved.'
  },
  notFound: {
    code: '404',
    title: 'Page not found',
    quote:
      'The page you are looking for does not exist. Easter egg: the hidden page is at /en/secret/.',
    link: '/en/secret/',
    linkLabel: 'Go to hidden page',
    linkText: 'Visit /en/secret/'
  },
  returnToTopLabel: 'Back to top',
  sidebarMenuLabel: 'Menu',
  darkModeSwitchLabel: 'Appearance',
  lightModeSwitchTitle: 'Switch to light mode',
  darkModeSwitchTitle: 'Switch to dark mode',
  skipToContentLabel: 'Skip to content'
}

const jaThemeConfig: DefaultTheme.Config = {
  nav: [
    { text: 'ホーム', link: '/ja/' },
    { text: '暗号技術', link: '/ja/crypto/', activeMatch: '/ja/crypto/' },
    { text: 'Web セキュリティ', link: '/ja/web/', activeMatch: '/ja/web/' },
    { text: 'Pwn', link: '/ja/pwn/', activeMatch: '/ja/pwn/' },
    { text: 'リバース', link: '/ja/reverse/', activeMatch: '/ja/reverse/' },
    { text: 'Misc', link: '/ja/misc/', activeMatch: '/ja/misc/' },
    {
      text: 'フォレンジック',
      link: '/ja/forensics/',
      activeMatch: '/ja/forensics/'
    },
    {
      text: 'ブロックチェーン',
      link: '/ja/blockchain/',
      activeMatch: '/ja/blockchain/'
    },
    { text: 'AI セキュリティ', link: '/ja/ai/', activeMatch: '/ja/ai/' }
  ],
  sidebar: [
    {
      text: '暗号技術 Crypto',
      items: [{ text: '暗号学入門', link: '/ja/crypto/' }]
    },
    {
      text: 'Web セキュリティ',
      items: [{ text: 'Web セキュリティ入門', link: '/ja/web/' }]
    },
    {
      text: 'Pwn バイナリ',
      items: [{ text: 'Pwn 入門', link: '/ja/pwn/' }]
    },
    {
      text: 'リバースエンジニアリング',
      items: [{ text: 'リバース入門', link: '/ja/reverse/' }]
    },
    {
      text: 'Misc',
      items: [{ text: 'Misc 入門', link: '/ja/misc/' }]
    },
    {
      text: 'フォレンジック',
      items: [{ text: 'フォレンジック入門', link: '/ja/forensics/' }]
    },
    {
      text: 'ブロックチェーン',
      items: [{ text: 'ブロックチェーン入門', link: '/ja/blockchain/' }]
    },
    {
      text: 'AI セキュリティ',
      items: [{ text: 'AI セキュリティ入門', link: '/ja/ai/' }]
    }
  ],
  outline: {
    level: [2, 3],
    label: 'このページの目次'
  },
  docFooter: {
    prev: '前へ',
    next: '次へ'
  },
  lastUpdated: {
    text: '最終更新'
  },
  editLink: {
    pattern: `${repoUrl}/edit/main/docs/:path`,
    text: 'GitHub でこのページを編集'
  },
  search: {
    provider: 'local',
    options: {
      translations: {
        button: {
          buttonText: '検索',
          buttonAriaLabel: '検索'
        },
        modal: {
          noResultsText: '該当する結果がありません',
          resetButtonTitle: '検索条件をクリア',
          footer: {
            selectText: '選択',
            navigateText: '移動',
            closeText: '閉じる'
          }
        }
      }
    }
  },
  footer: {
    message: '攻撃を理解して、より良い防御を。',
    copyright: '© 2026 Inui Sajuna. All Rights Reserved.'
  },
  notFound: {
    code: '404',
    title: 'ページが見つかりません',
    quote:
      'お探しのページは存在しません。イースターエッグ：隠しページは /ja/secret/ にあります。',
    link: '/ja/secret/',
    linkLabel: '隠しページへ',
    linkText: '/ja/secret/ を見る'
  },
  returnToTopLabel: 'トップへ戻る',
  sidebarMenuLabel: 'メニュー',
  darkModeSwitchLabel: '外観',
  lightModeSwitchTitle: 'ライトモードに切り替え',
  darkModeSwitchTitle: 'ダークモードに切り替え',
  skipToContentLabel: '本文へスキップ'
}

export default defineConfig({
  lang: 'zh-CN',
  title: siteTitle,
  description: siteDescription,
  cleanUrls: true,
  lastUpdated: true,

  locales: {
    root: { label: '简体中文', lang: 'zh-CN' },
    en: {
      label: 'English',
      lang: 'en-US',
      title: siteTitleEn,
      description: siteDescriptionEn,
      themeConfig: enThemeConfig
    },
    ja: {
      label: '日本語',
      lang: 'ja-JP',
      title: siteTitleJa,
      description: siteDescriptionJa,
      themeConfig: jaThemeConfig
    }
  },

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#2563eb' }],
    ['meta', { name: 'author', content: 'Inui Sajuna' }],
    [
      'meta',
      {
        name: 'keywords',
        content:
          'CTF,CTF 新手手册,CTF Handbook,CTF ハンドブック,网络安全,密码学,cryptography,暗号学,Web 安全,web security,Pwn,Reverse,リバース,Misc,取证,forensics,フォレンジック,区块链,blockchain,ブロックチェーン,AI 安全,AI security,AI セキュリティ'
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
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { property: 'og:image', content: `${siteUrl}/og.png` }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    ['meta', { property: 'og:image:alt', content: siteTitle }],
    ['meta', { name: 'twitter:image', content: `${siteUrl}/og.png` }]
  ],

  markdown: {
    math: true
  },

  sitemap: {
    hostname: siteUrl,
    transformItems(items) {
      return items.filter((item) => {
        const page = item.url.replace(/^\/+/, '')
        return page !== '404' && page !== 'en/404' && !page.includes('secret')
      })
    }
  },

  transformPageData(pageData) {
    const isEn = pageData.relativePath.startsWith('en/')
    const isJa = pageData.relativePath.startsWith('ja/')
    const siteName = isEn ? siteTitleEn : isJa ? siteTitleJa : siteTitle
    const fallbackDescription = isEn
      ? siteDescriptionEn
      : isJa
        ? siteDescriptionJa
        : siteDescription
    const langCode = isEn ? 'en-US' : isJa ? 'ja-JP' : 'zh-CN'
    const ogLocale = isEn ? 'en_US' : isJa ? 'ja_JP' : 'zh_CN'
    const url = resolvePageUrl(pageData.relativePath)
    const head = (pageData.frontmatter.head ??= []) as HeadConfig[]

    head.push(
      ['link', { rel: 'canonical', href: url }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { property: 'og:site_name', content: siteName }],
      ['meta', { property: 'og:locale', content: ogLocale }],
      [
        'meta',
        {
          property: 'og:title',
          content: pageData.title ? `${pageData.title} | ${siteName}` : siteName
        }
      ],
      [
        'meta',
        {
          property: 'og:description',
          content: pageData.description || fallbackDescription
        }
      ],
      [
        'script',
        { type: 'application/ld+json' },
        JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: siteName,
          url: siteUrl,
          description: fallbackDescription,
          inLanguage: langCode
        })
      ]
    )
  },

  themeConfig: {
    logo: '/logo.svg',

    nav: [
      { text: '首页', link: '/' },
      { text: '密码学', link: '/crypto/', activeMatch: '/crypto/' },
      { text: 'Web 安全', link: '/web/', activeMatch: '/web/' },
      { text: 'Pwn 二进制', link: '/pwn/', activeMatch: '/pwn/' },
      { text: '逆向工程', link: '/reverse/', activeMatch: '/reverse/' },
      { text: '杂项', link: '/misc/', activeMatch: '/misc/' },
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
        items: [{ text: 'Web 安全入门', link: '/web/' }]
      },
      {
        text: 'Pwn 二进制利用',
        items: [{ text: 'Pwn 入门', link: '/pwn/' }]
      },
      {
        text: 'Reverse 逆向工程',
        items: [{ text: '逆向工程入门', link: '/reverse/' }]
      },
      {
        text: 'Misc 杂项',
        items: [{ text: '杂项入门', link: '/misc/' }]
      },
      {
        text: '取证 Forensics',
        items: [{ text: '取证入门', link: '/forensics/' }]
      },
      {
        text: '区块链 Blockchain',
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
      pattern: `${repoUrl}/edit/main/docs/:path`,
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

    socialLinks: [{ icon: 'github', link: repoUrl }],

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
