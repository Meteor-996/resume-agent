# 简历专家

基于目标岗位 JD 的简历优化 Agent Web App。当前版本使用本地 mock AI 数据，不会上传用户输入。

## 启动

```powershell
npm start
```

打开 `http://127.0.0.1:4173`。项目没有第三方依赖，无需先执行安装命令。

## 结构

- `index.html`：应用入口
- `styles.css`：设计系统与响应式布局
- `app.js`：页面状态、mock AI 数据和完整交互流程
- `server.js`：零依赖本地静态服务

后续接入真实大模型时，可将 `startAnalysis` 中的本地生成逻辑替换为 API 请求，并保持各步骤的数据结构与渲染层不变。
