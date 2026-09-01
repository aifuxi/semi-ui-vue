---
status: accepted
---

# 使用 semi.fuxiaochen.com 作为文档正式域名

组件文档门户的正式站点源固定为 `https://semi.fuxiaochen.com`，站点部署在域名根路径，正式双语页面保持 `/zh-CN/...` 与 `/en-US/...`，不增加仓库名子路径。站点地图、canonical URL、社交分享、搜索结果和语言切换均以该域名生成链接。

## Consequences

- Astro 的生产 `site` 使用该 HTTPS 域名，`base` 保持根路径。
- 根路径固定跳转到 `/zh-CN/`，正式页面不依赖浏览器语言协商。
- DNS、TLS 证书和实际托管连通性属于部署证据；当前代理环境无法可靠验证该域名的公共解析，不能据此宣称域名已经上线。
