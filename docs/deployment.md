# 家庭版部署

`npm run build` 自动生成精选词包，并将可发布静态文件放入 `dist/`。只有 `dist/` 应作为网页内容发布；其中不包含原版完整词库、生成脚本或学习备份。

## GitHub Pages

1. 完成本地验收并获得发布确认。
2. 将改动提交、推送到 `OOTTTss/word-atlas`。
3. 仓库 Settings → Pages → Build and deployment → Source 选择 GitHub Actions。
4. Actions → **Deploy child vocabulary to GitHub Pages** → Run workflow，选择待发布分支。
5. 构建、测试和部署全部成功后，检查 https://ootttss.github.io/word-atlas/，并用家中 iPad 验证发音、拼写、关闭后重开及备份恢复。

工作流仅手动触发，不会随普通提交自动发布，不需要模型服务凭据。Pages 本身是公开网址；浏览器学习记录不会随发布上传。

## 本地验证子路径

```bash
npm ci
npm test
npm run check:atlas
ATLAS_BASE=/word-atlas/ npm run build
ATLAS_BASE=/word-atlas/ npm run preview
```

打开 http://localhost:5188/word-atlas/。使用 Node.js 22+。预览需要与构建使用相同的 `ATLAS_BASE`。

## 缓存与更新

生成脚本按词包和应用源文件计算缓存版本。Service Worker 仅清理本应用、当前子路径下的旧缓存，不触碰同一域名下其他项目的缓存或浏览器学习进度。

支持缓存部分已经访问的资源，不能保证全词包及音频完全离线。浏览器仍可能清理本地数据，家长应定期导出学习记录。

## 参考

- [GitHub Pages 自定义工作流](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [GitHub Pages 用量限制](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)
