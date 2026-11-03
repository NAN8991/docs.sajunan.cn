import Theme from 'vitepress/theme'
import '@fontsource/outfit/400.css'
import '@fontsource/outfit/500.css'
import '@fontsource/outfit/700.css'
import '@fontsource-variable/jetbrains-mono/index.css'
import './styles.css'

function printConsoleEgg() {
  const banner = `
 ██████╗████████╗███████╗
██╔════╝╚══██╔══╝██╔════╝
██║        ██║   █████╗
██║        ██║   ██╔══╝
╚██████╗   ██║   ██║
 ╚═════╝   ╚═╝   ╚═╝`

  console.log(
    `%c${banner}`,
    'color:#2563eb;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12px;line-height:1.05;'
  )
  console.log(
    '%c CTF 新手手册 ',
    'background:linear-gradient(90deg,#2563eb,#7c3aed,#06b6d4);color:#fff;font-size:18px;font-weight:700;padding:6px 12px;border-radius:6px;'
  )
  console.log(
    '%c从零开始，系统进阶。',
    'color:#2563eb;font-size:14px;font-weight:600;'
  )
  console.log(
    '%c技术栈 : VitePress + Vue 3\n仓库   : https://github.com/sajunan/docs.sajunan.cn\n协议   : MIT',
    'color:#64748b;font-size:12px;line-height:1.6;'
  )
  console.log(
    '%c彩蛋   : 源码里藏着一串 flag，试试 Ctrl+U 搜索 flag{。\n         也可以解开这串 Base64：54GM5rOo5aGU6I+y6LCi6LCi5Za1\n         隐藏页面 /secret/ 需要街机指令：↑↑↓↓←→←→BA',
    'color:#f59e0b;font-size:13px;line-height:1.6;'
  )
  console.log(
    '%c安全提示：不要在这里粘贴或执行任何陌生代码，谨防 Self-XSS。',
    'color:#ef4444;font-size:12px;'
  )
}

const konamiSequence = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a'
]

function bindKonamiCode() {
  let index = 0

  window.addEventListener('keydown', (event) => {
    const target = event.target as HTMLElement | null
    if (
      target &&
      (target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable)
    ) {
      return
    }

    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key

    if (key === konamiSequence[index]) {
      index++
      if (index === konamiSequence.length) {
        index = 0
        console.log(
          '%cKonami Code 已触发！正在前往隐藏页面 /secret/ ...',
          'color:#22c55e;font-size:14px;font-weight:700;'
        )
        window.setTimeout(() => {
          if (!window.location.pathname.startsWith('/secret')) {
            window.location.href = '/secret/'
          }
        }, 800)
      }
      return
    }

    index = key === konamiSequence[0] ? 1 : 0
  })
}

export default {
  extends: Theme,
  enhanceApp() {
    if (typeof window === 'undefined') return

    const win = window as any
    if (!win.__ctfHandbookEggShown) {
      win.__ctfHandbookEggShown = true
      printConsoleEgg()
    }
    if (!win.__ctfKonamiBound) {
      win.__ctfKonamiBound = true
      bindKonamiCode()
    }
  }
}
