# Image 示例资源归属与尺寸

六个 `image-*.svg` 均由本仓库 MIT 授权的 photo/one/two/poster.svg 原创几何图案派生。图片内容并非 Semi CDN 原始照片；没有复制 vendor 或远端图像内容。资产按 ADR0029 仅替换图像内容，恢复固定基线地址对应资源的固有尺寸。

2026-09-12 使用 ax 获取固定 Markdown 中的六个 CDN 地址（HTTP 200），以 macOS sips 读取像素宽高；六项均为 **1440×800**。SVG 的 width/height 为 1440×800，并保留原图案 viewBox，preserveAspectRatio=none 使完整图案填充图像区域。下载文件只保留在 ignored 诊断目录，不进入公开产物。

| 固定 CDN 文件       | 替代资源                 | CDN SHA-256                                                      |
| ------------------- | ------------------------ | ---------------------------------------------------------------- |
| abstract-small.jpeg | image-abstract-small.svg | 5334d2b7bce2b8e8b7583e016e651eebceaf47aefb9f14892668ab668005459a |
| abstract-big.png    | image-abstract-big.svg   | 630a0d467f56c2754469561ebd2e3856f81371e40cd0765d00cfc70c9fe0b6a8 |
| abstract.jpg        | image-abstract.svg       | e33a42c727c27034932b5ba769afd56fa48757f3baefb595fed369565e44d88f |
| sky.jpg             | image-sky.svg            | ddde395776643547ce4ed5be3d668d2d6811d0bd68989b1dd1873afd5e4a0ccb |
| colorful.jpg        | image-colorful.svg       | bee0790d01617ed73ae17caec6b84d4061d1e9ea0d53e057d10efff75e505bf9 |
| greenleaf.jpg       | image-greenleaf.svg      | 94bf6e55d21602d75815bd24fefd51647bc838e99347ef15939089007ed6b7ec |

源地址前缀：`https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/`。小图/大图内容使用相同原创图案、独立文件和 URL，保持原 1440×800 固有尺寸与独立加载契约，不声称复现原文件压缩大小或网络延迟。
