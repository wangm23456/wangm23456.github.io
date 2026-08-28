import { defineConfig, passthroughImageService } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

export default defineConfig({
  site: "https://wangm23456.github.io",
  integrations: [react(), mdx()],
  image: { service: passthroughImageService() },
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      themes: { light: "github-light", dark: "github-dark" },
    },
  },
});
