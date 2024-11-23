import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  lang: "zh-CN",
  title: "CryptoFlyMaster (文档demo)",
  description: "CryptoFlyMaster 的文档",

  theme,

  // 和 PWA 一起启用
  // shouldPrefetch: false,
});
