import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/start": [
    "",
  ],
  "/demo": [
    "disable.md", "encrypt.md", "layout.md", "markdown.md", "page.md"
  ],
  "/guide": [
    "AES", "DES", "RC4", "SM4"
  ]
});
