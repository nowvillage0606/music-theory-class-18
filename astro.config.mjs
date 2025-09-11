import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://nowvillage0606.github.io',      // ← GitHubユーザーのPagesドメイン
  base: '/music-theory-class-18',                 // ← リポ名（Project Pages用）
  output: 'static',
  build: { format: 'file' },                      // ← .htmlで出力（URL互換）
  integrations: [tailwind({ config: { applyBaseStyles: true } })],
  markdown: {
    // 必要になったら remark/rehype を追加
  }
});