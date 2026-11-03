<script setup lang="ts">
import { useData } from '../composables/data'

const { theme, frontmatter } = useData()
</script>

<template>
  <footer v-if="frontmatter.footer !== false" class="VPFooter">
    <div class="container">
      <p v-if="theme.footer?.message" class="message">
        <bdi v-html="theme.footer.message" />
      </p>
      <p class="message beian-row">
        <a
          href="https://beian.mps.gov.cn/#/query/webSearch?code=41172202000269"
          target="_blank"
          rel="noreferrer"
        >
          <img
            src="/assets/gongan-beian.png"
            alt="公安备案图标"
            class="beian-icon"
          />
          豫公网安备41172202000269号
        </a>
        <span class="beian-sep">，</span>
        <a href="https://beian.miit.gov.cn/" target="_blank" rel="noreferrer">
          豫ICP备2026035032号-1
        </a>
      </p>
      <p class="message tech-row">
        本站基于
        <a
          href="https://vitepress.dev/"
          target="_blank"
          rel="noopener noreferrer"
        >
          VitePress
        </a>
        构建
        <span class="link-sep">|</span>
        <a href="https://blog.sajunan.cn/" target="_blank" rel="noopener noreferrer">Blog</a>
        <span class="link-sep">/</span>
        <a href="https://docs.sajunan.cn/" target="_blank" rel="noopener noreferrer">Docs</a>
      </p>
      <p v-if="theme.footer?.copyright" class="copyright">
        <bdi v-html="theme.footer.copyright" />
      </p>
    </div>
  </footer>
</template>

<style scoped>
.VPFooter {
  position: relative;
  z-index: var(--vp-z-index-footer);
  border-top: 1px solid var(--vp-c-gutter);
  padding: 2rem 1.5rem;
  background-color: var(--vp-c-bg);
}

.VPFooter :deep(a) {
  text-decoration-line: underline;
  text-underline-offset: 0.125rem;
  transition: color 0.25s;
}

.VPFooter :deep(a:hover) {
  color: var(--vp-c-text-1);
}

@media (min-width: 48rem) {
  .VPFooter {
    padding: 2rem;
  }
}

.container {
  margin: 0 auto;
  max-width: var(--vp-layout-max-width);
  text-align: center;
}

.message,
.copyright {
  line-height: 1.7142857;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.beian-row,
.tech-row {
  margin-top: 8px;
}

.beian-icon {
  height: 1rem;
  width: auto;
  vertical-align: middle;
  margin-right: 4px;
  display: inline-block;
}

.beian-sep {
  margin: 0 4px;
}

.link-sep {
  margin: 0 6px;
}
</style>
