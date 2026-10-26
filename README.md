# 词光 · 孩子基础词版

基于 [designfuchen/word-atlas](https://github.com/designfuchen/word-atlas) 修改，供一名 10 岁孩子在家中 iPad 上使用。当前词包包含 203 个基础词、12 个生活主题，尚未按具体学校教材编排。

- 看插画、听英美发音、练拼写，保留 FSRS 间隔复习。
- 单人使用，无需账号；记录保存在当前浏览器，支持导出和恢复。
- 日常使用和构建均不调用付费模型 API。
- 网站只发布词单中的内容及对应媒体，不发布原版完整雅思词库。
- 首次使用默认每天 5 个新词，浅色界面，背景音乐和开屏动画默认关闭。

## 本地运行

使用 Node.js 22+：

```bash
npm ci
npm run dev
```

打开 http://localhost:5188。`predev` 和 `prebuild` 会从原始素材自动组装儿童词包到被 Git 忽略的 `.local/child-public/`。

```bash
npm test
npm run check:atlas
ATLAS_BASE=/word-atlas/ npm run build
ATLAS_BASE=/word-atlas/ npm run preview
```

子路径预览地址为 http://localhost:5188/word-atlas/。构建结果在 `dist/`；只发布这个目录。不要把 `.local/`、学习备份或整个源码目录作为网站上传。

## 词单与内容

[data/child-vocabulary.json](data/child-vocabulary.json) 是人工选择的发布清单。修改它即可调整内容，不需要调用模型。来源素材保留在 `public/atlas/`，构建脚本重新编号索引和数据块，只复制对应媒体。

保留原版第一条日常例句及其录音，去掉第二条雅思长例句和扩展词族等内容；通常只展示一个主要义项，`extraSenses` 中的词保留第二义项以帮助理解原句。不要直接修改例句却继续配用原录音。

这不是完整小学词表或经审定教材。原文字、插画和语音由 AI 生成，存在准确性局限；家庭版筛选不等于专业逐条教材审校。后续可依据孩子实际教材补充和修订。

## iPad 与备份

固定用 Safari 普通浏览模式打开网址，可用「分享 → 添加到主屏幕」。记录不会自动跨设备同步，也不会写入 GitHub。

家长定期在「我的」导出 JSON，保存到「文件」。导入前会验证文件并要求确认；本机会保留一份导入前记录，支持恢复。该恢复副本仍在同一浏览器，不能替代导出到文件的备份。

离线缓存只覆盖已访问且可被浏览器缓存的资源；音频 Range 请求不进入应用缓存，首次使用和部分发音需要网络。不要把「添加到主屏幕」理解为已下载全部内容。

## GitHub Pages

已准备手动触发的 `.github/workflows/pages.yml`，不会因推送代码自动发布。

经确认提交并推送后，在仓库 Settings → Pages 选择 GitHub Actions，再从 Actions 手动运行 **Deploy child vocabulary to GitHub Pages**。默认地址为 https://ootttss.github.io/word-atlas/；准备工作流不代表已经上线。

工作流先安装依赖、运行测试及词库检查，再按仓库名设置 `ATLAS_BASE` 构建并发布 `dist/`。不需要添加任何模型密钥。

## 授权与来源

代码按 [MIT](LICENSE) 保留版权与许可。词库文本、指定插画和词条录音来源于 Word Atlas，按 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) 署名：**Word Atlas contributors — CC BY 4.0**。家庭版修改了发布词单、词条展示范围、界面、备份和缓存逻辑，详见 [内容许可](CONTENT_LICENSE.md)。

第三方依赖与字体保留各自许可。原项目、字体和合成声音的来源说明见上述许可及应用「关于」。
