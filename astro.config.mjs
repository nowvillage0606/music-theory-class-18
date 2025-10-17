// astro.config.mjs
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite"; // ★コレがないとエラー

// GitHub Pages を使うなら ↓ をあなたの環境に合わせて設定
// （このリポなら base は "/music-theory-class-18"）
export default defineConfig({
  site: "https://nowvillage0606.github.io",
  base: "/music-theory-class-18",

  // SSGのままでOK（SSR不要なら触らない）
  output: "static",
  build: { format: "file" },

  // Tailwind v4 は Vite プラグインで読む
  vite: {
    plugins: [tailwindcss()],
  },

  // React islands
  integrations: [react()],

  // 必要ならここにmarkdownや画像最適化の設定を追加
});